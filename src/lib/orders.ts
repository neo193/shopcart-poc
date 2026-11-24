import type { ShippingMethod, Totals } from "./pricing";

export type PaymentMethod = "card" | "upi" | "netbanking" | "cod";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: "Credit / Debit Card",
  upi: "UPI",
  netbanking: "Net Banking",
  cod: "Cash on Delivery",
};

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  mobile: string;
  email: string;
}

export interface OrderLine {
  productId: string;
  slug: string;
  name: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  transactionId: string;
  createdAt: string;
  status: "Confirmed" | "Pending payment";
  lines: OrderLine[];
  couponCode: string | null;
  totals: Omit<Totals, "coupon">;
  shippingMethod: ShippingMethod;
  estimatedDelivery: { earliest: string; latest: string };
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  paymentSummary: string;
  /** Set when the shopper was signed in; links the order to their account. */
  userEmail?: string;
}

export const ORDER_STAGES = ["Order confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"] as const;
export type OrderStage = (typeof ORDER_STAGES)[number];

/**
 * Simulated tracking so the demo shows an order moving along. Stage changes
 * happen minutes apart instead of days. A courier webhook replaces this later.
 */
const STAGE_AFTER_MINUTES = [0, 1, 3, 6, 10];

export function orderProgress(order: Order, now = Date.now()) {
  const mins = (now - new Date(order.createdAt).getTime()) / 60_000;
  let index = 0;
  STAGE_AFTER_MINUTES.forEach((m, i) => {
    if (mins >= m) index = i;
  });
  return { index, stage: ORDER_STAGES[index], delivered: index === ORDER_STAGES.length - 1 };
}

function randomDigits(n: number) {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export function newOrderId() {
  return `SC-${new Date().getFullYear()}-${randomDigits(6)}`;
}

export function newTransactionId() {
  return `TXN${randomDigits(10)}`;
}
