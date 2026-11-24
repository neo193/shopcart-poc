import type { CartItem } from "@/lib/pricing";
import { formatPrice } from "@/lib/money";

export interface Coupon {
  code: string;
  title: string;
  description: string;
  type: "percent" | "flat" | "freeship";
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  /** Only items in this category count towards the discount. */
  category?: string;
  firstOrderOnly?: boolean;
  expiresAt?: string; // ISO date
  /** Hidden codes still work but aren't listed under "Available offers". */
  hidden?: boolean;
}

// Mock coupon table. Later this becomes a Supabase table with the same shape.
export const COUPONS: Coupon[] = [
  {
    code: "SAVE10",
    title: "10% off your order",
    description: "Up to ₹1,000 off. No minimum order.",
    type: "percent",
    value: 10,
    maxDiscount: 1000,
    expiresAt: "2027-12-31",
  },
  {
    code: "FLAT500",
    title: "₹500 off orders above ₹4,999",
    description: "Flat discount on orders of ₹4,999 or more.",
    type: "flat",
    value: 500,
    minOrder: 4999,
    expiresAt: "2027-12-31",
  },
  {
    code: "AUDIO15",
    title: "15% off headphones",
    description: "Applies to headphones in your cart only. Up to ₹2,000 off.",
    type: "percent",
    value: 15,
    maxDiscount: 2000,
    category: "Headphones",
    expiresAt: "2027-12-31",
  },
  {
    code: "WELCOME20",
    title: "20% off your first order",
    description: "First order only. Minimum ₹1,999, up to ₹1,500 off.",
    type: "percent",
    value: 20,
    minOrder: 1999,
    maxDiscount: 1500,
    firstOrderOnly: true,
    expiresAt: "2027-12-31",
  },
  {
    code: "FREESHIP",
    title: "Free shipping",
    description: "Free standard or express delivery on any order.",
    type: "freeship",
    value: 0,
    expiresAt: "2027-12-31",
  },
  {
    // Kept so the demo can show the "expired" error.
    code: "SUMMER25",
    title: "25% off summer sale",
    description: "Summer sale code.",
    type: "percent",
    value: 25,
    expiresAt: "2026-08-31",
    hidden: true,
  },
];

export type CouponResult =
  | {
      valid: true;
      coupon: Coupon;
      discount: number;
      freeShipping: boolean;
      message: string;
    }
  | { valid: false; code: string; message: string };

export function findCoupon(code: string): Coupon | undefined {
  const c = code.trim().toUpperCase();
  return COUPONS.find((x) => x.code === c);
}

export function evaluateCoupon(
  rawCode: string,
  items: CartItem[],
  subtotal: number,
  ordersPlaced = 0,
  now = new Date()
): CouponResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, code, message: "Enter a coupon code." };

  const coupon = findCoupon(code);
  if (!coupon)
    return { valid: false, code, message: `"${code}" is not a valid coupon code.` };

  if (coupon.expiresAt && now > new Date(`${coupon.expiresAt}T23:59:59`))
    return { valid: false, code, message: `${code} expired on ${coupon.expiresAt}.` };

  if (coupon.firstOrderOnly && ordersPlaced > 0)
    return { valid: false, code, message: `${code} is only valid on your first order.` };

  if (coupon.minOrder && subtotal < coupon.minOrder)
    return {
      valid: false,
      code,
      message: `Add ${formatPrice(coupon.minOrder - subtotal)} more to use ${code} (min. order ${formatPrice(coupon.minOrder)}).`,
    };

  const eligibleSubtotal = coupon.category
    ? items
        .filter((i) => i.product.category === coupon.category)
        .reduce((s, i) => s + i.product.price * i.quantity, 0)
    : subtotal;

  if (coupon.category && eligibleSubtotal === 0)
    return {
      valid: false,
      code,
      message: `${code} only applies to ${coupon.category}. None in your cart.`,
    };

  let discount = 0;
  if (coupon.type === "percent") discount = (eligibleSubtotal * coupon.value) / 100;
  if (coupon.type === "flat") discount = coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, eligibleSubtotal);

  return {
    valid: true,
    coupon,
    discount,
    freeShipping: coupon.type === "freeship",
    message:
      coupon.type === "freeship"
        ? `${code} applied: free shipping!`
        : `${code} applied: you save ${formatPrice(Math.round(discount))}.`,
  };
}
