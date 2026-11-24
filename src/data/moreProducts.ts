import type { Product, ColorVariant } from "./products";
import { formatPrice } from "@/lib/money";

/**
 * Placeholder catalogue for the non-electronics categories so every category
 * page in the POC is browsable. Brands are fictional and the art is an emoji
 * tile; swap in the client's real catalogue and photos later.
 */

interface Seed {
  slug: string;
  name: string;
  brand: string;
  price: number;
  shortDesc: string;
  description: string;
  rating: number;
  reviews: number;
  addedAt: string;
  material: string;
  offer?: string;
  stockLeft: number;
  emoji: string;
  colors: ColorVariant[];
  details: Record<string, string>;
}

const C = {
  walnut: { name: "Walnut", hex: "#8B5E3C", secondaryHex: "#E7D3C1" },
  oak: { name: "Natural Oak", hex: "#C8A27A", secondaryHex: "#F3E8DC" },
  forest: { name: "Forest Green", hex: "#1A4D3E", secondaryHex: "#CFE3DB" },
  charcoal: { name: "Charcoal", hex: "#374151", secondaryHex: "#D1D5DB" },
  sand: { name: "Sand", hex: "#D6C3A5", secondaryHex: "#F6EFE4" },
  tan: { name: "Tan", hex: "#B07A4F", secondaryHex: "#F1DFCF" },
  black: { name: "Black", hex: "#1F2937", secondaryHex: "#E5E7EB" },
  blush: { name: "Blush", hex: "#E8A1A1", secondaryHex: "#FBE7E7" },
  crimson: { name: "Crimson", hex: "#8F1D2C", secondaryHex: "#F6D9DD" },
  navy: { name: "Navy", hex: "#1E3A5F", secondaryHex: "#D6E2F0" },
  white: { name: "White", hex: "#E5E7EB", secondaryHex: "#F9FAFB" },
  orange: { name: "Sunset Orange", hex: "#F47B20", secondaryHex: "#FDE3CF" },
  olive: { name: "Olive", hex: "#6B7A3A", secondaryHex: "#E6EAD5" },
  sky: { name: "Sky Blue", hex: "#7695B5", secondaryHex: "#DCE7F2" },
} satisfies Record<string, ColorVariant>;

function build(category: string, seeds: Seed[]): Product[] {
  return seeds.map((s) => ({
    id: s.slug,
    slug: s.slug,
    name: s.name,
    brand: s.brand,
    price: s.price,
    shortDesc: s.shortDesc,
    description: s.description,
    rating: s.rating,
    reviews: s.reviews,
    addedAt: s.addedAt,
    category,
    material: s.material,
    offer: s.offer,
    stockLeft: s.stockLeft,
    visualType: "emoji",
    emoji: s.emoji,
    defaultColor: s.colors[0].hex,
    colors: s.colors,
    specs: {
      general: {
        Brand: s.brand,
        Model: s.name,
        Price: formatPrice(s.price),
        Category: category,
        Material: s.material,
      },
      details: s.details,
    },
  }));
}

const FURNITURE = build("Furniture", [
  { slug: "nordic-lounge-chair", name: "Nordic Lounge Chair", brand: "Hearthwood", price: 14999, shortDesc: "Solid wood frame, boucle cushion", description: "A low-slung lounge chair with a solid wood frame and a cloud-soft boucle seat, made for slow Sunday mornings.", rating: 4.7, reviews: 842, addedAt: "2026-11-05", material: "Solid Wood", offer: "20% Off", stockLeft: 9, emoji: "🪑", colors: [C.oak, C.walnut, C.charcoal], details: { Dimensions: "74 × 80 × 78 cm", "Seat Height": "40 cm", "Max Load": "120 kg", Assembly: "Legs only", Warranty: "2 years" } },
  { slug: "cloud-three-seater-sofa", name: "Cloud 3-Seater Sofa", brand: "Hearthwood", price: 54999, shortDesc: "Deep seats, washable covers", description: "Generously deep seats with feather-blend cushions and removable, machine-washable covers.", rating: 4.8, reviews: 1290, addedAt: "2026-08-14", material: "Linen Blend", offer: "Free Shipping", stockLeft: 5, emoji: "🛋️", colors: [C.sand, C.forest, C.charcoal], details: { Dimensions: "220 × 95 × 82 cm", Seats: "3", "Cushion Fill": "Feather blend", "Removable Covers": "Yes", Warranty: "5 years" } },
  { slug: "arc-floor-lamp", name: "Arc Floor Lamp", brand: "Lumen & Co", price: 6499, shortDesc: "Dimmable, marble base", description: "A sweeping arc lamp with a weighted marble base and warm dimmable LED.", rating: 4.4, reviews: 376, addedAt: "2026-10-12", material: "Steel & Marble", stockLeft: 14, emoji: "💡", colors: [C.black, C.white], details: { Height: "190 cm", Bulb: "E27 LED, dimmable", "Cable Length": "2 m", Warranty: "1 year" } },
  { slug: "oak-bedside-table", name: "Oak Bedside Table", brand: "Hearthwood", price: 4999, shortDesc: "One drawer, soft-close", description: "A compact bedside table with a soft-close drawer and an open shelf for books.", rating: 4.2, reviews: 214, addedAt: "2026-05-21", material: "Oak Veneer", offer: "30% Off", stockLeft: 22, emoji: "🗄️", colors: [C.oak, C.walnut], details: { Dimensions: "45 × 40 × 55 cm", Drawers: "1 (soft-close)", Assembly: "Required", Warranty: "2 years" } },
]);

const HAND_BAGS = build("Hand Bag", [
  { slug: "everyday-leather-tote", name: "Everyday Leather Tote", brand: "Marlowe", price: 7999, shortDesc: "Full-grain leather, laptop sleeve", description: "A structured full-grain leather tote with a padded 14\" laptop sleeve and magnetic closure.", rating: 4.7, reviews: 1532, addedAt: "2026-09-30", material: "Full-grain Leather", offer: "20% Off", stockLeft: 11, emoji: "👜", colors: [C.tan, C.black, C.blush], details: { Dimensions: "38 × 30 × 14 cm", "Laptop Sleeve": "Up to 14\"", Closure: "Magnetic", Pockets: "4 interior" } },
  { slug: "mini-crossbody-bag", name: "Mini Crossbody Bag", brand: "Marlowe", price: 2999, shortDesc: "Adjustable strap, 3 colours", description: "A go-anywhere crossbody with an adjustable strap and room for phone, cards and keys.", rating: 4.5, reviews: 960, addedAt: "2026-11-08", material: "Vegan Leather", offer: "New Arrival", stockLeft: 25, emoji: "👛", colors: [C.blush, C.black, C.sand], details: { Dimensions: "20 × 14 × 6 cm", Strap: "Adjustable, 60–120 cm", Closure: "Zip" } },
  { slug: "weekend-canvas-backpack", name: "Weekend Canvas Backpack", brand: "Fieldnote", price: 3999, shortDesc: "Water-resistant waxed canvas", description: "Waxed canvas backpack with leather trims and a roll-top that expands for weekend trips.", rating: 4.3, reviews: 488, addedAt: "2026-04-18", material: "Waxed Canvas", offer: "Free Shipping", stockLeft: 16, emoji: "🎒", colors: [C.olive, C.navy, C.charcoal], details: { Capacity: "22 L", "Water Resistant": "Yes", "Laptop Sleeve": "Up to 15\"" } },
  { slug: "evening-clutch", name: "Evening Clutch", brand: "Marlowe", price: 1999, shortDesc: "Satin finish, chain strap", description: "A satin evening clutch with a detachable chain strap.", rating: 4.0, reviews: 132, addedAt: "2026-07-02", material: "Satin", offer: "50% Off", stockLeft: 8, emoji: "👝", colors: [C.crimson, C.black], details: { Dimensions: "24 × 13 × 4 cm", Strap: "Detachable chain" } },
]);

const BOOKS = build("Books", [
  { slug: "the-quiet-garden", name: "The Quiet Garden", brand: "Paperlane Press", price: 499, shortDesc: "Hardcover · Fiction", description: "A tender novel about three generations of a family and the garden that holds them together.", rating: 4.8, reviews: 4210, addedAt: "2026-10-28", material: "Hardcover", offer: "New Arrival", stockLeft: 40, emoji: "📗", colors: [C.forest], details: { Format: "Hardcover", Pages: "352", Language: "English", Genre: "Literary Fiction" } },
  { slug: "design-for-everyday", name: "Design for Everyday", brand: "Paperlane Press", price: 1299, shortDesc: "Hardcover · Design", description: "A visual guide to how good design shapes the objects we use every day.", rating: 4.6, reviews: 980, addedAt: "2026-06-11", material: "Hardcover", offer: "20% Off", stockLeft: 18, emoji: "📘", colors: [C.navy], details: { Format: "Hardcover", Pages: "288", Language: "English", Genre: "Design" } },
  { slug: "midnight-recipes", name: "Midnight Recipes", brand: "Saffron Books", price: 699, shortDesc: "Paperback · Cooking", description: "Seventy quick, comforting recipes for when it's late and you're hungry.", rating: 4.4, reviews: 612, addedAt: "2026-02-09", material: "Paperback", stockLeft: 27, emoji: "📙", colors: [C.orange], details: { Format: "Paperback", Pages: "224", Language: "English", Genre: "Cooking" } },
  { slug: "small-habits-big-life", name: "Small Habits, Big Life", brand: "Northbound", price: 399, shortDesc: "Paperback · Self-help", description: "Practical, science-backed habits that add up to a calmer, more focused life.", rating: 4.2, reviews: 2380, addedAt: "2026-09-03", material: "Paperback", offer: "50% Off", stockLeft: 55, emoji: "📕", colors: [C.crimson], details: { Format: "Paperback", Pages: "196", Language: "English", Genre: "Self-help" } },
]);

const SNEAKERS = build("Sneakers", [
  { slug: "cloudstep-runner", name: "Cloudstep Runner", brand: "Stride Lab", price: 7999, shortDesc: "Lightweight foam, breathable knit", description: "A daily running shoe with responsive foam and a breathable knit upper.", rating: 4.7, reviews: 3015, addedAt: "2026-11-12", material: "Knit Mesh", offer: "New Arrival", stockLeft: 13, emoji: "👟", colors: [C.white, C.black, C.sky], details: { Use: "Running", Drop: "8 mm", Weight: "240 g", Sizes: "UK 5–12" } },
  { slug: "court-classic-low", name: "Court Classic Low", brand: "Stride Lab", price: 4499, shortDesc: "Leather upper, cupsole", description: "Timeless low-top court sneaker in smooth leather.", rating: 4.5, reviews: 1844, addedAt: "2026-03-22", material: "Leather", offer: "20% Off", stockLeft: 20, emoji: "👞", colors: [C.white, C.tan], details: { Use: "Casual", Sole: "Rubber cupsole", Sizes: "UK 4–12" } },
  { slug: "trail-blazer-hiker", name: "Trail Blazer Hiker", brand: "Ridgeway", price: 8999, shortDesc: "Waterproof, grippy outsole", description: "Waterproof hiking sneaker with an aggressive lug outsole for muddy trails.", rating: 4.6, reviews: 702, addedAt: "2026-08-27", material: "Suede & Mesh", offer: "Free Shipping", stockLeft: 7, emoji: "🥾", colors: [C.olive, C.charcoal], details: { Use: "Hiking", Waterproof: "Yes", Sizes: "UK 5–13" } },
  { slug: "slip-on-canvas", name: "Slip-On Canvas", brand: "Stride Lab", price: 1999, shortDesc: "Easy on, easy off", description: "A laceless canvas slip-on for everyday errands.", rating: 4.1, reviews: 455, addedAt: "2026-05-05", material: "Canvas", offer: "30% Off", stockLeft: 31, emoji: "🩴", colors: [C.navy, C.black, C.sand], details: { Use: "Casual", Closure: "Slip-on", Sizes: "UK 3–11" } },
]);

const TRAVEL = build("Travel", [
  { slug: "carry-on-spinner", name: "Carry-On Spinner", brand: "Wayfarer", price: 11999, shortDesc: "Cabin size, 360° wheels", description: "Polycarbonate cabin case with silent 360° spinner wheels and a TSA lock.", rating: 4.8, reviews: 2760, addedAt: "2026-10-05", material: "Polycarbonate", offer: "20% Off", stockLeft: 10, emoji: "🧳", colors: [C.charcoal, C.sky, C.blush], details: { Size: "55 × 40 × 23 cm", Capacity: "40 L", Lock: "TSA approved", Warranty: "10 years" } },
  { slug: "packing-cubes-set", name: "Packing Cubes (Set of 4)", brand: "Wayfarer", price: 1299, shortDesc: "Compression zips", description: "Four compression packing cubes that keep your case organised.", rating: 4.6, reviews: 1980, addedAt: "2026-07-26", material: "Recycled Nylon", offer: "Free Shipping", stockLeft: 45, emoji: "📦", colors: [C.navy, C.olive], details: { Pieces: "4", Compression: "Yes", Material: "Recycled nylon" } },
  { slug: "memory-foam-neck-pillow", name: "Memory Foam Neck Pillow", brand: "Driftwell", price: 899, shortDesc: "Washable cover", description: "Ergonomic memory foam travel pillow with a washable cover and snap strap.", rating: 4.3, reviews: 860, addedAt: "2026-11-15", material: "Memory Foam", offer: "New Arrival", stockLeft: 38, emoji: "😴", colors: [C.charcoal, C.sand], details: { Fill: "Memory foam", "Washable Cover": "Yes" } },
  { slug: "passport-travel-wallet", name: "Passport Travel Wallet", brand: "Marlowe", price: 1499, shortDesc: "RFID blocking", description: "Slim leather travel wallet for passport, cards, boarding pass and a pen.", rating: 4.5, reviews: 540, addedAt: "2026-01-30", material: "Leather", offer: "50% Off", stockLeft: 19, emoji: "🛂", colors: [C.tan, C.black], details: { "RFID Blocking": "Yes", Slots: "6 cards + passport" } },
]);

export const MORE_PRODUCTS: Product[] = [
  ...FURNITURE,
  ...HAND_BAGS,
  ...BOOKS,
  ...SNEAKERS,
  ...TRAVEL,
];
