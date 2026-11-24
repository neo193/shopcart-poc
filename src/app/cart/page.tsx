"use client";

import Link from "next/link";
import { ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { calcTotals, formatPrice, lineId } from "@/lib/pricing";
import { CartLine, CartItemThumb } from "@/components/cart/CartLine";
import { CouponBox } from "@/components/cart/CouponBox";
import { TotalsRows, FreeShippingBar } from "@/components/cart/TotalsRows";
import { ProductCard } from "@/components/ProductCard";
import { ALL_PRODUCTS } from "@/data/products";

export default function CartPage() {
  const {
    hydrated,
    cart,
    savedForLater,
    couponCode,
    orders,
    clearCart,
    moveToCart,
    removeSaved,
  } = useStore();
  const totals = calcTotals(cart, couponCode, "standard", orders.length);

  const inCart = new Set(cart.map((i) => i.product.id));
  const suggestions = ALL_PRODUCTS.filter((p) => !inCart.has(p.id)).slice(0, 4);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-48 rounded-lg skeleton-shimmer" />
        <div className="mt-8 h-64 rounded-2xl skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      <nav className="mb-6 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Cart</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Shopping Cart
        </h1>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Remove all items from your cart?")) clearCart();
            }}
            className="text-xs font-semibold text-gray-500 hover:text-rose-600 transition"
          >
            Clear cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-brand-surface px-6 py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
          <p className="text-lg font-bold text-gray-900">Your cart is empty</p>
          <p className="max-w-sm text-sm text-gray-500">
            Browse our best deals and add something you love.
          </p>
          <Link
            href="/deals"
            className="rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white hover:bg-brand-greenHover transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <FreeShippingBar remaining={totals.freeShippingRemaining} />
            <div className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white px-6">
              {cart.map((item) => (
                <CartLine key={lineId(item)} item={item} />
              ))}
            </div>
            <Link
              href="/deals"
              className="mt-4 inline-block text-sm font-semibold text-brand-green hover:underline"
            >
              ← Continue shopping
            </Link>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                <div className="mt-4">
                  <CouponBox items={cart} totals={totals} />
                </div>
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <TotalsRows totals={totals} />
                </div>
                {totals.discount > 0 && (
                  <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-semibold text-emerald-800">
                    You&apos;re saving {formatPrice(totals.discount)} on this order
                  </p>
                )}
                <Link
                  href="/checkout"
                  className="mt-5 block w-full rounded-full bg-brand-green py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-brand-greenHover active:scale-[0.98]"
                >
                  Proceed to Checkout
                </Link>
                <p className="mt-2 text-center text-[11px] text-gray-500">
                  Standard shipping shown. Express is available at checkout.
                </p>
              </div>
              <ul className="space-y-2.5 rounded-2xl bg-brand-surface p-5 text-xs text-gray-700">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-brand-green" /> Secure checkout
                </li>
                <li className="flex items-center gap-2.5">
                  <Truck className="h-4 w-4 text-brand-green" /> Free delivery over ₹999
                </li>
                <li className="flex items-center gap-2.5">
                  <RotateCcw className="h-4 w-4 text-brand-green" /> 30-day free returns
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}

      {savedForLater.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">
            Saved for later ({savedForLater.length})
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedForLater.map((item) => (
              <div
                key={lineId(item)}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4"
              >
                <CartItemThumb item={item} />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="block truncate text-sm font-bold text-gray-900 hover:text-brand-green"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {item.color} · {formatPrice(item.product.price)}
                  </p>
                  <div className="mt-2 flex gap-3 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => moveToCart(lineId(item))}
                      className="text-brand-green hover:underline"
                    >
                      Move to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSaved(lineId(item))}
                      className="text-gray-500 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          You Might Also Like
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
