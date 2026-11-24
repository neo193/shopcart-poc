import { Product } from "@/data/products";
import { evaluateCoupon, CouponResult } from "@/data/coupons";
import { formatPrice } from "./money";

export { formatPrice };

export interface CartItem {
  product: Product;
  color: string;
  quantity: number;
}

export type ShippingMethod = "standard" | "express";

/** GST is included in all listed prices; totals show the included amount. */
export const GST_RATE = 0.18;
export const FREE_SHIPPING_THRESHOLD = 999;
export const DEFAULT_STOCK = 12;

export const SHIPPING_OPTIONS: Record<
  ShippingMethod,
  { label: string; fee: number; minDays: number; maxDays: number }
> = {
  standard: { label: "Standard Delivery", fee: 49, minDays: 3, maxDays: 5 },
  express: { label: "Express Delivery", fee: 149, minDays: 1, maxDays: 2 },
};

export function lineId(item: { product: Product; color: string }): string {
  return `${item.product.id}::${item.color}`;
}

export function getStock(product: Product): number {
  return product.stockLeft ?? DEFAULT_STOCK;
}

export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

export function deliveryWindow(method: ShippingMethod, from = new Date()) {
  const opt = SHIPPING_OPTIONS[method];
  return {
    earliest: addBusinessDays(from, opt.minDays),
    latest: addBusinessDays(from, opt.maxDays),
  };
}

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export interface Totals {
  itemCount: number;
  subtotal: number;
  coupon: CouponResult | null;
  discount: number;
  shippingFee: number;
  freeShippingRemaining: number;
  /** GST already included in the total (not added on top). */
  tax: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * All price maths lives here so the cart drawer, cart page and checkout
 * always agree. Prices are GST-inclusive: subtotal -> coupon discount ->
 * shipping; `tax` is the GST contained in the discounted item amount.
 */
export function calcTotals(
  items: CartItem[],
  couponCode: string | null,
  shipping: ShippingMethod = "standard",
  ordersPlaced = 0
): Totals {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = round2(
    items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  );

  const coupon = couponCode
    ? evaluateCoupon(couponCode, items, subtotal, ordersPlaced)
    : null;
  const discount = coupon?.valid ? Math.round(coupon.discount) : 0;

  const qualifiesFreeStandard =
    subtotal >= FREE_SHIPPING_THRESHOLD || !!(coupon?.valid && coupon.freeShipping);
  let shippingFee = 0;
  if (items.length > 0) {
    if (coupon?.valid && coupon.freeShipping) shippingFee = 0;
    else if (shipping === "standard")
      shippingFee = qualifiesFreeStandard ? 0 : SHIPPING_OPTIONS.standard.fee;
    else shippingFee = SHIPPING_OPTIONS.express.fee;
  }

  const itemsTotal = Math.max(0, subtotal - discount);
  const tax = round2(itemsTotal - itemsTotal / (1 + GST_RATE));
  const total = round2(itemsTotal + shippingFee);

  return {
    itemCount,
    subtotal,
    coupon,
    discount,
    shippingFee,
    freeShippingRemaining: Math.max(0, round2(FREE_SHIPPING_THRESHOLD - subtotal)),
    tax,
    total,
  };
}
