"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, ThumbsUp, BadgeCheck, X } from "lucide-react";
import { Product } from "@/data/products";
import { Review, mockReviews, loadMyReviews, saveMyReview, ratingBreakdown } from "@/lib/reviews";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { Stars } from "./Stars";

type SortKey = "helpful" | "newest" | "high" | "low";

export function ProductReviews({ product }: { product: Product }) {
  const { user } = useAuth();
  const { showToast } = useStore();
  const [mine, setMine] = useState<Review[]>([]);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("helpful");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [writing, setWriting] = useState(false);

  useEffect(() => {
    setMine(loadMyReviews(product.id));
    setStarFilter(null);
    setShowAll(false);
    setWriting(false);
  }, [product.id]);

  const mock = useMemo(() => mockReviews(product), [product]);

  // Fold this browser's reviews into the headline numbers.
  const total = product.reviews + mine.length;
  const avg = (product.rating * product.reviews + mine.reduce((s, r) => s + r.rating, 0)) / total;
  const dist = ratingBreakdown(product.rating);

  const list = [...mine, ...mock]
    .filter((r) => !starFilter || r.rating === starFilter)
    .sort((a, b) => {
      if (a.mine !== b.mine) return a.mine ? -1 : 1; // your own reviews first
      if (sort === "newest") return b.date.localeCompare(a.date);
      if (sort === "high") return b.rating - a.rating;
      if (sort === "low") return a.rating - b.rating;
      return b.helpful - a.helpful;
    });
  const shown = showAll ? list : list.slice(0, 4);

  return (
    <section id="reviews" className="mt-16 scroll-mt-32 border-t border-gray-100 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Ratings &amp; Reviews</h2>
        {!writing && (
          <button
            type="button"
            onClick={() => setWriting(true)}
            className="rounded-full border border-brand-green px-5 py-2 text-sm font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
          >
            Write a Review
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-brand-surface p-6">
            <p className="text-5xl font-extrabold text-gray-900">{avg.toFixed(1)}</p>
            <div className="mt-2">
              <Stars rating={avg} size="h-5 w-5" />
            </div>
            <p className="mt-1 text-xs text-gray-500">Based on {total.toLocaleString("en-IN")} reviews</p>
            <ul className="mt-5 space-y-2">
              {[5, 4, 3, 2, 1].map((k, i) => {
                const pct = Math.round(dist[i] * 100);
                const active = starFilter === k;
                return (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => setStarFilter(active ? null : k)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1 text-xs transition ${
                        active ? "bg-white ring-1 ring-brand-green" : "hover:bg-white"
                      }`}
                    >
                      <span className="flex w-7 items-center gap-0.5 font-semibold text-gray-700">
                        {k} <Star className="h-3 w-3 fill-brand-star text-brand-star" />
                      </span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <span className="block h-full rounded-full bg-brand-star" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="w-8 text-right text-gray-500">{pct}%</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-8">
          {writing && (
            <ReviewForm
              defaultName={user ? `${user.firstName} ${user.lastName[0]}.` : ""}
              onCancel={() => setWriting(false)}
              onSubmit={(r) => {
                const review: Review = {
                  ...r,
                  id: `mine-${Date.now()}`,
                  productId: product.id,
                  date: new Date().toISOString(),
                  verified: false,
                  helpful: 0,
                  mine: true,
                };
                saveMyReview(review);
                setMine((m) => [review, ...m]);
                setWriting(false);
                setStarFilter(null);
                showToast("Thanks! Your review has been posted");
              }}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              {starFilter ? (
                <>
                  Showing {starFilter}★ reviews ·{" "}
                  <button type="button" onClick={() => setStarFilter(null)} className="font-semibold text-brand-green underline">
                    Show all
                  </button>
                </>
              ) : (
                "Top reviews"
              )}
            </p>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 outline-none"
              >
                <option value="helpful">Most helpful</option>
                <option value="newest">Newest</option>
                <option value="high">Highest rating</option>
                <option value="low">Lowest rating</option>
              </select>
            </label>
          </div>

          {list.length === 0 ? (
            <p className="mt-6 rounded-xl bg-brand-surface px-4 py-8 text-center text-sm text-gray-500">
              No {starFilter}★ reviews to show.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-gray-100">
              {shown.map((r) => {
                const hasVoted = voted.has(r.id);
                return (
                  <li key={r.id} className="py-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Stars rating={r.rating} />
                      <p className="text-sm font-bold text-gray-900">{r.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{r.body}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{r.author}</span>
                      <span>{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      {r.verified && (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                        </span>
                      )}
                      {r.mine && <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">Your review</span>}
                      {!r.mine && (
                        <button
                          type="button"
                          disabled={hasVoted}
                          onClick={() => setVoted((v) => new Set(v).add(r.id))}
                          className="ml-auto flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 hover:border-brand-green hover:text-brand-green disabled:border-brand-green disabled:text-brand-green"
                        >
                          <ThumbsUp className="h-3 w-3" /> Helpful ({r.helpful + (hasVoted ? 1 : 0)})
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {list.length > 4 && (
            <button
              type="button"
              onClick={() => setShowAll((s) => !s)}
              className="mt-2 text-sm font-semibold text-brand-green hover:underline"
            >
              {showAll ? "Show fewer reviews" : `Show all ${list.length} reviews`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewForm({
  defaultName,
  onSubmit,
  onCancel,
}: {
  defaultName: string;
  onSubmit: (r: { author: string; rating: number; title: string; body: string }) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState(defaultName);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!rating) return setError("Please choose a star rating.");
        if (!title.trim()) return setError("Add a short headline.");
        if (body.trim().length < 10) return setError("Tell us a little more (at least 10 characters).");
        if (!author.trim()) return setError("Add the name to show with your review.");
        onSubmit({ rating, title: title.trim(), body: body.trim(), author: author.trim() });
      }}
      className="mb-6 rounded-2xl border border-gray-200 p-5 animate-fadeUp"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-900">Write your review</p>
        <button type="button" onClick={onCancel} aria-label="Cancel review" className="rounded-full p-1 text-gray-500 hover:bg-brand-surface">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={rating === k}
            aria-label={`${k} star${k > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(k)}
            onClick={() => {
              setRating(k);
              setError(null);
            }}
            className="p-0.5"
          >
            <Star className={`h-7 w-7 transition ${(hover || rating) >= k ? "fill-brand-star text-brand-star" : "text-gray-300"}`} />
          </button>
        ))}
        {rating > 0 && <span className="ml-2 text-xs text-gray-500">{["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}</span>}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <label className="text-xs font-semibold text-gray-700">
          Headline
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="What stood out?" className="mt-1.5 w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-brand-green/30" />
        </label>
        <label className="text-xs font-semibold text-gray-700">
          Review
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={1000} placeholder="What did you like or dislike?" className="mt-1.5 w-full resize-y rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-brand-green/30" />
        </label>
        <label className="text-xs font-semibold text-gray-700">
          Display name
          <input value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={40} placeholder="e.g. Priya S." className="mt-1.5 w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-brand-green/30" />
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
      <button type="submit" className="mt-4 rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-greenHover">
        Submit Review
      </button>
    </form>
  );
}
