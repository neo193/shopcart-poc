"use client";

import { useState } from "react";
import { Tag, X, ChevronDown } from "lucide-react";
import { COUPONS } from "@/data/coupons";
import { CartItem, Totals } from "@/lib/pricing";
import { useStore } from "@/context/StoreContext";

/**
 * Coupon input + applied state + "available offers" list.
 * `items` lets checkout validate against a Buy Now item instead of the cart.
 */
export function CouponBox({
  items,
  totals,
}: {
  items: CartItem[];
  totals: Totals;
}) {
  const { applyCoupon, removeCoupon } = useStore();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showOffers, setShowOffers] = useState(false);

  const apply = (code: string) => {
    const res = applyCoupon(code, items);
    if (res.valid) {
      setError(null);
      setInput("");
      setShowOffers(false);
    } else setError(res.message);
  };

  const applied = totals.coupon;
  const offers = COUPONS.filter((c) => !c.hidden);

  return (
    <div>
      {applied?.valid ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Tag className="h-4 w-4 shrink-0 text-brand-green" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-brand-green">
                {applied.coupon.code}
              </p>
              <p className="text-xs text-emerald-800">{applied.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            aria-label="Remove coupon"
            className="rounded-full p-1.5 text-emerald-800 hover:bg-emerald-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          {applied && !applied.valid && (
            // A coupon was applied earlier but the cart no longer qualifies.
            <div className="mb-2 flex items-start justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
              <span>{applied.message}</span>
              <button
                type="button"
                onClick={removeCoupon}
                className="shrink-0 font-semibold underline"
              >
                Remove
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply(input);
            }}
            className="flex items-center rounded-full bg-brand-surface p-1.5"
          >
            <label htmlFor="coupon" className="sr-only">
              Coupon code
            </label>
            <input
              id="coupon"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              placeholder="Enter Coupon Code"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-3.5 text-sm uppercase placeholder:normal-case outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-full bg-brand-green px-5 py-2 text-xs font-semibold text-white hover:bg-brand-greenHover transition disabled:opacity-40"
            >
              Apply
            </button>
          </form>
          {error && (
            <p role="alert" className="mt-2 px-2 text-xs font-medium text-rose-600">
              {error}
            </p>
          )}
        </>
      )}

      <button
        type="button"
        onClick={() => setShowOffers((s) => !s)}
        className="mt-3 flex items-center gap-1 px-1 text-xs font-semibold text-brand-green hover:underline"
      >
        {showOffers ? "Hide" : "View"} available offers ({offers.length})
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${showOffers ? "rotate-180" : ""}`}
        />
      </button>

      {showOffers && (
        <ul className="mt-2 space-y-2 animate-fadeUp">
          {offers.map((c) => {
            const isApplied = applied?.valid && applied.coupon.code === c.code;
            return (
              <li
                key={c.code}
                className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-300 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold tracking-wide text-gray-900">
                    {c.code}
                  </p>
                  <p className="text-xs font-semibold text-gray-700">{c.title}</p>
                  <p className="text-[11px] text-gray-500">{c.description}</p>
                </div>
                <button
                  type="button"
                  disabled={isApplied}
                  onClick={() => apply(c.code)}
                  className="shrink-0 rounded-full border border-brand-green px-3.5 py-1.5 text-[11px] font-bold text-brand-green hover:bg-brand-green hover:text-white transition disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  {isApplied ? "Applied" : "Apply"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
