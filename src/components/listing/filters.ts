import { Product } from "@/data/products";

export type SortKey = "featured" | "popular" | "rating" | "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const PRICE_BUCKETS = [
  { id: "under-1000", label: "Under ₹1,000", min: 0, max: 1000 },
  { id: "1000-2500", label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
  { id: "2500-5000", label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
  { id: "5000-15000", label: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
  { id: "15000-plus", label: "₹15,000 & above", min: 15000, max: Infinity },
];

export const RATING_OPTIONS = [
  { id: "4.5", label: "4.5★ & up" },
  { id: "4", label: "4★ & up" },
  { id: "3.5", label: "3.5★ & up" },
];

export interface FilterState {
  type: string[];
  price: string | null;
  rating: string | null;
  color: string[];
  material: string[];
  offer: string[];
  sort: SortKey;
  page: number;
}

export type FilterKey = "type" | "price" | "rating" | "color" | "material" | "offer";

export interface FilterGroup {
  key: FilterKey;
  label: string;
  multi: boolean;
  options: { id: string; label: string; count: number; swatch?: string }[];
}

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function parseFilters(params: URLSearchParams): FilterState {
  const sort = params.get("sort") as SortKey | null;
  return {
    type: list(params.get("type")),
    price: params.get("price"),
    rating: params.get("rating"),
    color: list(params.get("color")),
    material: list(params.get("material")),
    offer: list(params.get("offer")),
    sort: sort && SORT_OPTIONS.some((o) => o.value === sort) ? sort : "featured",
    page: Math.max(1, Number(params.get("page")) || 1),
  };
}

function matches(p: Product, f: FilterState, skip?: FilterKey): boolean {
  if (skip !== "type" && f.type.length && !f.type.includes(p.headphoneType ?? "")) return false;
  if (skip !== "price" && f.price) {
    const b = PRICE_BUCKETS.find((x) => x.id === f.price);
    if (b && (p.price < b.min || p.price >= b.max)) return false;
  }
  if (skip !== "rating" && f.rating && p.rating < Number(f.rating)) return false;
  if (skip !== "color" && f.color.length && !p.colors.some((c) => f.color.includes(c.name)))
    return false;
  if (skip !== "material" && f.material.length && !f.material.includes(p.material ?? ""))
    return false;
  if (skip !== "offer" && f.offer.length && !f.offer.includes(p.offer ?? "")) return false;
  return true;
}

export function applyFilters(products: Product[], f: FilterState): Product[] {
  const out = products.filter((p) => matches(p, f));
  const by: Record<SortKey, (a: Product, b: Product) => number> = {
    featured: () => 0,
    popular: (a, b) => b.reviews - a.reviews,
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    newest: (a, b) => b.addedAt.localeCompare(a.addedAt),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };
  return out.sort(by[f.sort]);
}

/**
 * Builds the filter groups for a product set. Counts reflect the other active
 * filters (faceted search), so an option never leads to an empty page unless
 * it shows 0.
 */
export function buildGroups(products: Product[], f: FilterState): FilterGroup[] {
  const groups: FilterGroup[] = [];
  const count = (key: FilterKey, test: (p: Product) => boolean) =>
    products.filter((p) => matches(p, f, key) && test(p)).length;

  const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

  const types = uniq(products.map((p) => p.headphoneType).filter(Boolean) as string[]);
  if (types.length > 1)
    groups.push({
      key: "type",
      label: "Headphone Type",
      multi: true,
      options: types.map((t) => ({ id: t, label: t, count: count("type", (p) => p.headphoneType === t) })),
    });

  groups.push({
    key: "price",
    label: "Price",
    multi: false,
    options: PRICE_BUCKETS.map((b) => ({
      id: b.id,
      label: b.label,
      count: count("price", (p) => p.price >= b.min && p.price < b.max),
    })).filter((o) => products.some((p) => {
      const b = PRICE_BUCKETS.find((x) => x.id === o.id)!;
      return p.price >= b.min && p.price < b.max;
    })),
  });

  groups.push({
    key: "rating",
    label: "Review",
    multi: false,
    options: RATING_OPTIONS.map((r) => ({
      id: r.id,
      label: r.label,
      count: count("rating", (p) => p.rating >= Number(r.id)),
    })),
  });

  const colorMap = new Map<string, string>();
  products.forEach((p) => p.colors.forEach((c) => colorMap.has(c.name) || colorMap.set(c.name, c.hex)));
  if (colorMap.size > 1)
    groups.push({
      key: "color",
      label: "Color",
      multi: true,
      options: Array.from(colorMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, hex]) => ({
          id: name,
          label: name,
          swatch: hex,
          count: count("color", (p) => p.colors.some((c) => c.name === name)),
        })),
    });

  const materials = uniq(products.map((p) => p.material).filter(Boolean) as string[]).sort();
  if (materials.length > 1)
    groups.push({
      key: "material",
      label: "Material",
      multi: true,
      options: materials.map((m) => ({ id: m, label: m, count: count("material", (p) => p.material === m) })),
    });

  const offers = uniq(products.map((p) => p.offer).filter(Boolean) as string[]).sort();
  if (offers.length > 0)
    groups.push({
      key: "offer",
      label: "Offer",
      multi: true,
      options: offers.map((o) => ({ id: o, label: o, count: count("offer", (p) => p.offer === o) })),
    });

  return groups;
}

export function activeCount(f: FilterState): number {
  return f.type.length + f.color.length + f.material.length + f.offer.length + (f.price ? 1 : 0) + (f.rating ? 1 : 0);
}
