"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { formatDate, formatPrice } from "@/lib/pricing";
import { orderProgress } from "@/lib/orders";
import { getProductBySlug } from "@/data/products";
import { CartItemThumb } from "@/components/cart/CartLine";

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useStore();
  if (!user) return null;
  const mine = orders.filter((o) => o.userEmail === user.email);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">My Orders</h1>
      {mine.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-brand-surface px-6 py-16 text-center">
          <Package className="h-10 w-10 text-gray-400" />
          <p className="text-lg font-bold text-gray-900">No orders yet</p>
          <p className="text-sm text-gray-500">Orders you place while signed in will show up here.</p>
          <Link href="/deals" className="mt-2 rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-greenHover">
            Start Shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {mine.map((o) => {
            const p = orderProgress(o);
            return (
              <li key={o.id} className="rounded-2xl border border-gray-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4 text-xs text-gray-500">
                  <div className="flex flex-wrap gap-x-8 gap-y-1">
                    <span>
                      Order <span className="font-bold text-gray-900">{o.id}</span>
                    </span>
                    <span>
                      Placed{" "}
                      <span className="font-semibold text-gray-900">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </span>
                    <span>
                      Total <span className="font-semibold text-gray-900">{formatPrice(o.totals.total)}</span>
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      p.delivered ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.stage}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {o.lines.slice(0, 3).map((l) => {
                        const product = getProductBySlug(l.productId);
                        return product ? (
                          <div key={`${l.productId}-${l.color}`} className="rounded-xl ring-2 ring-white">
                            <CartItemThumb item={{ product, color: l.color, quantity: l.quantity }} size="sm" />
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {o.lines[0].name}
                        {o.lines.length > 1 && <span className="text-gray-500"> + {o.lines.length - 1} more</span>}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.delivered
                          ? "Delivered"
                          : `Arriving ${formatDate(o.estimatedDelivery.earliest)} – ${formatDate(o.estimatedDelivery.latest)}`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/order/${o.id}`}
                    className="rounded-full border border-brand-green px-5 py-2 text-xs font-bold text-brand-green transition hover:bg-brand-green hover:text-white"
                  >
                    View & Track
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
