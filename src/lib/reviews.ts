import { Product } from "@/data/products";

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string; // ISO
  verified: boolean;
  helpful: number;
  /** Written in this browser via the review form. */
  mine?: boolean;
}

/** Tiny seeded PRNG so each product always gets the same mock reviews. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = ["Priya S.", "Rahul M.", "Ananya K.", "Vikram R.", "Sneha P.", "Arjun T.", "Kavya N.", "Rohan D.", "Meera J.", "Aditya V.", "Ishita G.", "Karan B."];

const BY_RATING: Record<number, { title: string; body: string }[]> = {
  5: [
    { title: "Exceeded my expectations", body: "Quality is excellent and it looks even better in person. Delivery was quick and the packaging was great." },
    { title: "Worth every rupee", body: "I compared a lot of options before buying this one and I'm really glad I did. Would happily buy again." },
    { title: "Absolutely love it", body: "Using it every day since it arrived. The finish feels premium and it was exactly as described." },
  ],
  4: [
    { title: "Very good, minor nitpicks", body: "Does everything I wanted. Took a day longer to arrive than estimated, but the product itself is great." },
    { title: "Great value", body: "Solid build and good quality for the price. The colour is slightly darker than the photos." },
  ],
  3: [{ title: "Decent, but not perfect", body: "It's okay for the price. A few things could be better, but it does the job." }],
  2: [{ title: "Expected more", body: "Quality felt a bit below what I expected. Customer support was helpful with the return though." }],
  1: [{ title: "Not for me", body: "Didn't suit my needs, so I returned it. The return pickup was easy." }],
};

/** Share of reviews per star (5..1), shaped so the average is close to the product rating. */
export function ratingBreakdown(avg: number): number[] {
  const w = [5, 4, 3, 2, 1].map((k) => Math.exp(-Math.pow(k - avg, 2) / 0.9) * (k === 5 ? 1.25 : 1));
  const sum = w.reduce((a, b) => a + b, 0);
  return w.map((x) => x / sum);
}

export function mockReviews(p: Product, count = 6): Review[] {
  const rand = rng(p.id);
  const dist = ratingBreakdown(p.rating);
  const pickRating = () => {
    let r = rand();
    for (let i = 0; i < 5; i++) {
      r -= dist[i];
      if (r <= 0) return 5 - i;
    }
    return 5;
  };
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const rating = pickRating();
    const pool = BY_RATING[rating];
    const tpl = pool[Math.floor(rand() * pool.length)];
    return {
      id: `${p.id}-mock-${i}`,
      productId: p.id,
      author: NAMES[Math.floor(rand() * NAMES.length)],
      rating,
      title: tpl.title,
      body: tpl.body,
      date: new Date(now - Math.floor(rand() * 180) * 86_400_000).toISOString(),
      verified: rand() > 0.2,
      helpful: Math.floor(rand() * 60),
    };
  });
}

// ---- Reviews written in this browser (Supabase table later) ----

const KEY = "shopcart:reviews:v1";

export function loadMyReviews(productId: string): Review[] {
  try {
    const all = JSON.parse(window.localStorage.getItem(KEY) || "{}") as Record<string, Review[]>;
    return Array.isArray(all[productId]) ? all[productId] : [];
  } catch {
    return [];
  }
}

export function saveMyReview(review: Review) {
  try {
    const all = JSON.parse(window.localStorage.getItem(KEY) || "{}") as Record<string, Review[]>;
    all[review.productId] = [review, ...(all[review.productId] ?? [])];
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

// ---- Recently viewed ----

const RECENT_KEY = "shopcart:recent:v1";

export function recordView(productId: string) {
  try {
    const list = JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]") as string[];
    const next = [productId, ...list.filter((id) => id !== productId)].slice(0, 12);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

export function recentlyViewed(): string[] {
  try {
    const list = JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
