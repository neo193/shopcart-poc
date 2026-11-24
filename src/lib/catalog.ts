import { ALL_PRODUCTS, Product } from "@/data/products";

/**
 * Catalogue queries. Everything reads from the local product list today;
 * swap these functions for Supabase queries later without touching pages.
 */

export interface Category {
  slug: string;
  name: string;
  /** Matches Product.category. */
  productCategory: string;
  emoji: string;
  tagline: string;
  bannerTitle: string;
  bannerBg: string;
}

export const CATEGORIES: Category[] = [
  { slug: "headphones", name: "Headphones", productCategory: "Headphones", emoji: "🎧", tagline: "Wireless, noise-cancelling and studio sound", bannerTitle: "Grab Upto 50% Off On Selected Headphone", bannerBg: "bg-brand-cream" },
  { slug: "tech", name: "Tech", productCategory: "Tech", emoji: "💻", tagline: "Laptops, speakers and gaming gear", bannerTitle: "Smart Tech For Work And Play", bannerBg: "bg-brand-sky" },
  { slug: "furniture", name: "Furniture", productCategory: "Furniture", emoji: "🛋️", tagline: "Pieces that make a house a home", bannerTitle: "Make Your Space Feel Like You", bannerBg: "bg-emerald-50" },
  { slug: "hand-bag", name: "Hand Bag", productCategory: "Hand Bag", emoji: "👜", tagline: "Totes, crossbodies and clutches", bannerTitle: "Carry Everything, Beautifully", bannerBg: "bg-rose-50" },
  { slug: "books", name: "Books", productCategory: "Books", emoji: "📚", tagline: "Bestsellers and new releases", bannerTitle: "Your Next Favourite Read Is Here", bannerBg: "bg-amber-50" },
  { slug: "sneakers", name: "Sneakers", productCategory: "Sneakers", emoji: "👟", tagline: "Runners, court classics and trail shoes", bannerTitle: "Step Up Your Sneaker Game", bannerBg: "bg-orange-50" },
  { slug: "travel", name: "Travel", productCategory: "Travel", emoji: "🧳", tagline: "Luggage and travel essentials", bannerTitle: "Pack Light, Travel Far", bannerBg: "bg-sky-50" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryForProduct(p: Product): Category | undefined {
  return CATEGORIES.find((c) => c.productCategory === p.category);
}

export function productsInCategory(slug: string): Product[] {
  const cat = getCategory(slug);
  return cat ? ALL_PRODUCTS.filter((p) => p.category === cat.productCategory) : [];
}

export function categoryCount(slug: string): number {
  return productsInCategory(slug).length;
}

/** "20% Off" -> 20; other offers -> null. */
export function offerPercent(p: Product): number | null {
  const m = p.offer?.match(/(\d+)%\s*off/i);
  return m ? Number(m[1]) : null;
}

/**
 * For the POC, `price` is the sale price and a "% Off" offer implies the
 * original price. With a real backend this would be a stored compare-at price.
 */
export function compareAtPrice(p: Product): number | null {
  const pct = offerPercent(p);
  if (!pct) return null;
  // Round to a retail-looking "was" price ending in 99, e.g. ₹3,699.
  return Math.max(p.price + 1, Math.round(p.price / (1 - pct / 100) / 100) * 100 - 1);
}

export function dealProducts(): Product[] {
  return ALL_PRODUCTS.filter((p) => offerPercent(p) !== null);
}

const NEW_WINDOW_DAYS = 45;

export function isNew(p: Product, now = new Date()): boolean {
  const ageDays = (now.getTime() - new Date(p.addedAt).getTime()) / 86_400_000;
  return ageDays >= 0 && ageDays <= NEW_WINDOW_DAYS;
}

export function newProducts(now = new Date()): Product[] {
  return [...ALL_PRODUCTS]
    .filter((p) => isNew(p, now) || p.offer === "New Arrival")
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

export function searchProducts(query: string): Product[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const scored = ALL_PRODUCTS.map((p) => {
    const name = p.name.toLowerCase();
    const hay = [p.name, p.brand, p.category, p.shortDesc, p.material ?? "", p.headphoneType ?? "", ...p.colors.map((c) => c.name)]
      .join(" ")
      .toLowerCase();
    if (!terms.every((t) => hay.includes(t))) return null;
    // Name matches rank above matches elsewhere.
    const score = terms.reduce((s, t) => s + (name.startsWith(t) ? 3 : name.includes(t) ? 2 : 1), 0);
    return { p, score };
  }).filter((x): x is { p: Product; score: number } => x !== null);
  return scored.sort((a, b) => b.score - a.score || b.p.reviews - a.p.reviews).map((x) => x.p);
}

export function similarProducts(p: Product, limit = 4): Product[] {
  const same = ALL_PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category);
  const others = ALL_PRODUCTS.filter((x) => x.id !== p.id && x.category !== p.category).sort(
    (a, b) => b.reviews - a.reviews
  );
  return [...same, ...others].slice(0, limit);
}
