"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { calcTotals, formatPrice } from "@/lib/pricing";
import { CartLine } from "./CartLine";
import { FreeShippingBar } from "./TotalsRows";

export function CartDrawer() {
  const router = useRouter();
  const { cart, cartOpen, closeCart, cartCount, couponCode, orders } = useStore();
  const totals = calcTotals(cart, couponCode, "standard", orders.length);

  // Close on Escape and lock page scroll while open.
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [cartOpen, closeCart]);

  return (
    // `invisible` (applied after the slide-out) keeps a closed drawer out of the tab order.
    <div
      className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${
        cartOpen ? "visible" : "invisible pointer-events-none"
      }`}
      aria-hidden={!cartOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Your Cart{" "}
            <span className="text-sm font-medium text-gray-500">
              ({cartCount} item{cartCount === 1 ? "" : "s"})
            </span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 text-gray-600 hover:bg-brand-surface transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-surface">
              <ShoppingBag className="h-9 w-9 text-gray-400" />
            </div>
            <p className="text-base font-bold text-gray-900">Your cart is empty</p>
            <p className="text-sm text-gray-500">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              href="/deals"
              onClick={closeCart}
              className="rounded-full bg-brand-green px-7 py-3 text-sm font-semibold text-white hover:bg-brand-greenHover transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="px-6 pt-4">
              <FreeShippingBar remaining={totals.freeShippingRemaining} />
            </div>
            <div className="flex-1 divide-y divide-gray-100 overflow-y-auto px-6">
              {cart.map((item) => (
                <CartLine
                  key={`${item.product.id}-${item.color}`}
                  item={item}
                  compact
                  onNavigate={closeCart}
                />
              ))}
            </div>
            <div className="space-y-3 border-t border-gray-100 px-6 py-5">
              {totals.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-700">
                  <span>Coupon savings</span>
                  <span className="font-semibold">−{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal - totals.discount)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Shipping, taxes and coupons are finalised at checkout.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="rounded-full border border-brand-green py-3 text-center text-sm font-bold text-brand-green hover:bg-brand-surface transition"
                >
                  View Cart
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    router.push("/checkout");
                  }}
                  className="rounded-full bg-brand-green py-3 text-sm font-bold text-white hover:bg-brand-greenHover transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
