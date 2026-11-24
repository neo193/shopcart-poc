/**
 * Currency formatting for the whole store. Prices are stored in rupees and
 * are GST-inclusive, as is standard for Indian retail (and what Razorpay
 * will charge).
 */
const whole = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const withPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return Number.isInteger(rounded) ? whole.format(rounded) : withPaise.format(rounded);
}
