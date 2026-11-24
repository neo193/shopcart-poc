import { Totals, GST_RATE, formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

export function TotalsRows({
  totals,
  showShipping = true,
}: {
  totals: Totals;
  showShipping?: boolean;
}) {
  return (
    <dl className="space-y-2.5 text-sm">
      <Row
        label={`Subtotal (${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"})`}
        value={formatPrice(totals.subtotal)}
      />
      {totals.discount > 0 && totals.coupon?.valid && (
        <Row
          label={`Coupon (${totals.coupon.coupon.code})`}
          value={`−${formatPrice(totals.discount)}`}
          valueClass="text-emerald-700"
        />
      )}
      {showShipping && (
        <Row
          label="Shipping"
          value={totals.shippingFee === 0 ? "Free" : formatPrice(totals.shippingFee)}
          valueClass={totals.shippingFee === 0 ? "text-emerald-700" : undefined}
        />
      )}
      <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
        <dt>Total</dt>
        <dd>{formatPrice(totals.total)}</dd>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <dt>Includes GST ({Math.round(GST_RATE * 100)}%)</dt>
        <dd>{formatPrice(totals.tax)}</dd>
      </div>
    </dl>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between gap-4 text-gray-600">
      <dt>{label}</dt>
      <dd className={`font-semibold text-gray-900 ${valueClass ?? ""}`}>{value}</dd>
    </div>
  );
}

export function FreeShippingBar({ remaining }: { remaining: number }) {
  const pct = Math.min(
    100,
    ((FREE_SHIPPING_THRESHOLD - remaining) / FREE_SHIPPING_THRESHOLD) * 100
  );
  return (
    <div className="rounded-xl bg-brand-surface px-4 py-3">
      <p className="text-xs font-medium text-gray-700">
        {remaining > 0 ? (
          <>
            Add <span className="font-bold text-brand-green">{formatPrice(remaining)}</span>{" "}
            more for <span className="font-bold">free standard delivery</span>
          </>
        ) : (
          <span className="font-semibold text-brand-green">
            🎉 You&apos;ve unlocked free standard delivery
          </span>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-brand-green transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
