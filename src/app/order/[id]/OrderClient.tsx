"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Package, Truck, Home, ClipboardCheck, Printer, Bike } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { formatDate, formatPrice, SHIPPING_OPTIONS, GST_RATE } from "@/lib/pricing";
import { PAYMENT_LABELS, ORDER_STAGES, orderProgress } from "@/lib/orders";
import { getProductBySlug } from "@/data/products";
import { CartItemThumb } from "@/components/cart/CartLine";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { hydrated, getOrder } = useStore();
  const { user } = useAuth();
  // Re-render every 15s so the simulated tracking moves while the page is open.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(t);
  }, []);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="h-40 rounded-2xl skeleton-shimmer" />
        <div className="mt-6 h-72 rounded-2xl skeleton-shimmer" />
      </div>
    );
  }

  const order = getOrder(decodeURIComponent(id));

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">Order not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          We couldn&apos;t find order {decodeURIComponent(id)} in this browser.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white hover:bg-brand-greenHover transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const t = order.totals;
  const progress = orderProgress(order, now);
  const icons = [ClipboardCheck, Package, Truck, Bike, Home];
  const steps = ORDER_STAGES.map((label, i) => ({ label, icon: icons[i], done: i <= progress.index }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 animate-fadeUp">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-sky-50 to-white p-8 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-100 via-sky-100 to-rose-100 animate-checkPulse">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Thank you, {order.address.firstName}!
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Your order has been placed. A confirmation would be sent to{" "}
          <span className="font-semibold">{order.address.email}</span>.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-500">
          <span>
            Order ID: <span className="font-bold text-gray-900">{order.id}</span>
          </span>
          {order.transactionId !== "—" && (
            <span>
              Transaction ID:{" "}
              <span className="font-bold text-gray-900">{order.transactionId}</span>
            </span>
          )}
          <span>
            Placed on{" "}
            <span className="font-bold text-gray-900">
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </span>
        </div>
      </div>

      {/* Tracking */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-gray-900">
            Delivery <span className="ml-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">{progress.stage}</span>
          </h2>
          <p className="text-sm text-gray-600">
            {progress.delivered ? "Delivered · was estimated" : "Estimated"}{" "}
            <span className="font-bold text-brand-green">
              {formatDate(order.estimatedDelivery.earliest)} –{" "}
              {formatDate(order.estimatedDelivery.latest)}
            </span>
          </p>
        </div>
        <ol className="mt-6 grid grid-cols-5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.label} className="relative flex flex-col items-center text-center">
                {i > 0 && (
                  <span
                    className={`absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2 ${s.done ? "bg-brand-green" : "bg-gray-200"}`}
                  />
                )}
                <span
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                    s.done ? "bg-brand-green text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`mt-2 text-[11px] font-semibold sm:text-xs ${
                    s.done ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 text-center text-[11px] text-gray-400">
          Demo tracking: the order moves to the next stage every few minutes.
        </p>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Items */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:col-span-3">
          <h2 className="text-lg font-bold text-gray-900">Items ({t.itemCount})</h2>
          <ul className="mt-2 divide-y divide-gray-100">
            {order.lines.map((l) => {
              const product = getProductBySlug(l.productId);
              return (
                <li key={`${l.productId}-${l.color}`} className="flex items-center gap-4 py-3">
                  {product && (
                    <CartItemThumb item={{ product, color: l.color, quantity: l.quantity }} size="sm" />
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${l.slug}`}
                      className="block truncate text-sm font-bold text-gray-900 hover:text-brand-green"
                    >
                      {l.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {l.color} · Qty {l.quantity} × {formatPrice(l.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {formatPrice(l.unitPrice * l.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(t.subtotal)} />
            {t.discount > 0 && (
              <Row
                label={`Coupon (${order.couponCode})`}
                value={`−${formatPrice(t.discount)}`}
                className="text-emerald-700"
              />
            )}
            <Row
              label={`Shipping (${SHIPPING_OPTIONS[order.shippingMethod].label})`}
              value={t.shippingFee === 0 ? "Free" : formatPrice(t.shippingFee)}
            />
            <div className="flex justify-between border-t border-gray-100 pt-2.5 text-base font-bold text-gray-900">
              <dt>{order.paymentMethod === "cod" ? "To pay on delivery" : "Total paid"}</dt>
              <dd>{formatPrice(t.total)}</dd>
            </div>
            <Row label={`Includes GST (${Math.round(GST_RATE * 100)}%)`} value={formatPrice(t.tax)} className="text-xs" />
          </dl>
        </section>

        {/* Address & payment */}
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            <h2 className="mb-3 text-lg font-bold text-gray-900">Shipping to</h2>
            <p className="font-bold text-gray-900">
              {order.address.firstName} {order.address.lastName}
            </p>
            <p>{order.address.address}</p>
            <p>
              {order.address.city}, {order.address.state} {order.address.zip}
            </p>
            <p className="mt-1">{order.address.mobile}</p>
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            <h2 className="mb-3 text-lg font-bold text-gray-900">Payment</h2>
            <p className="font-semibold text-gray-900">{PAYMENT_LABELS[order.paymentMethod]}</p>
            <p>{order.paymentSummary}</p>
          </section>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
        <Link
          href="/"
          className="rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-95"
        >
          Continue Shopping
        </Link>
        {user && order.userEmail === user.email && (
          <Link
            href="/account/orders"
            className="rounded-full border border-brand-green px-6 py-3 text-sm font-bold text-brand-green hover:bg-brand-surface transition"
          >
            My Orders
          </Link>
        )}
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-brand-surface transition"
        >
          <Printer className="h-4 w-4" /> Print receipt
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex justify-between text-gray-600 ${className}`}>
      <dt>{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
