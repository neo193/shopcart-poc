import Link from "next/link";
import { Truck, Zap, RotateCcw, PackageCheck } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_OPTIONS, formatPrice } from "@/lib/pricing";

export const metadata = { title: "Delivery & Returns — Shopcart" };

export default function DeliveryPage() {
  const std = SHIPPING_OPTIONS.standard;
  const exp = SHIPPING_OPTIONS.express;
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Delivery &amp; Returns</span>
      </nav>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Delivery &amp; Returns</h1>
      <p className="mt-2 text-sm text-gray-600">
        Everything you need to know about getting your order and sending it back.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-surface p-6">
          <Truck className="h-6 w-6 text-brand-orange" />
          <h2 className="mt-3 text-lg font-bold text-gray-900">{std.label}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {std.minDays}–{std.maxDays} business days. {formatPrice(std.fee)}, or{" "}
            <span className="font-semibold text-brand-green">free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>.
          </p>
        </div>
        <div className="rounded-2xl bg-brand-surface p-6">
          <Zap className="h-6 w-6 text-brand-orange" />
          <h2 className="mt-3 text-lg font-bold text-gray-900">{exp.label}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {exp.minDays}–{exp.maxDays} business days for {formatPrice(exp.fee)}. Order before 2 PM for same-day dispatch.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <PackageCheck className="h-5 w-5 text-brand-green" /> Tracking your order
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Once your order ships you&apos;ll get a tracking link by email and SMS. You can also
          follow each step (confirmed, packed, shipped, delivered) from your order page.
        </p>
      </section>

      <section id="returns" className="mt-10 scroll-mt-32">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <RotateCcw className="h-5 w-5 text-brand-green" /> Free 30-day returns
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-600">
          <li>Return most items within 30 days of delivery, free of charge.</li>
          <li>Items must be unused and in their original packaging.</li>
          <li>Refunds go back to your original payment method within 5–7 business days of pickup.</li>
          <li>Cash on Delivery orders are refunded to your bank account or as store credit.</li>
        </ul>
      </section>

      <p className="mt-10 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500">
        Placeholder policy for the proof of concept. Final terms to be provided by the client.
      </p>
    </div>
  );
}
