"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductVisual } from "@/components/ProductVisual";

export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutItem } = useStore();

  const [returningCustomer, setReturningCustomer] = useState(false);
  const [editingInfo, setEditingInfo] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    mobile: "",
    email: "",
  });

  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(true); // 10% default matching $549 -> $494.10
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderAccepted, setOrderAccepted] = useState(false);

  const handleReturningToggle = (checked: boolean) => {
    setReturningCustomer(checked);
    if (checked) {
      setForm({
        firstName: "Wade",
        lastName: "Warren",
        address: "4140 Parker Rd. Allentown, New Mexico 31134",
        city: "Allentown",
        zip: "31134",
        mobile: "+447700960054",
        email: "Warren@gmail.com",
      });
      setEditingInfo(false);
    } else {
      setEditingInfo(true);
    }
  };

  const subtotal = checkoutItem.product.price * checkoutItem.quantity;
  const tax = subtotal * 0.1;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + tax - discount;

  const activeColor =
    checkoutItem.product.colors.find((c) => c.name === checkoutItem.color) ||
    checkoutItem.product.colors[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Checkout</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-7">
          {/* Review Item And Shipping */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Review Item And Shipping
            </h2>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-brand-surface">
                  <ProductVisual
                    type={checkoutItem.product.visualType}
                    color={
                      activeColor?.hex || checkoutItem.product.defaultColor
                    }
                    secondaryColor={activeColor?.secondaryHex || "#E5E7EB"}
                    className="h-20 w-20"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {checkoutItem.product.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Color: {checkoutItem.color}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-base font-bold text-gray-900">
                  ${subtotal.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Quantity: {String(checkoutItem.quantity).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>

          {/* Returning Customer Toggle */}
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700 select-none">
            <input
              type="checkbox"
              checked={returningCustomer}
              onChange={(e) => handleReturningToggle(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-brand-green"
            />
            <span>Returning Customer?</span>
          </label>

          {/* Delivery Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Delivery Information
              </h2>
              {!editingInfo ? (
                <button
                  type="button"
                  onClick={() => setEditingInfo(true)}
                  className="rounded-full bg-brand-surface px-4 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition"
                >
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingInfo(false)}
                  className="rounded-full bg-brand-surface px-4 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition"
                >
                  Save Information
                </button>
              )}
            </div>

            {!editingInfo && form.firstName ? (
              <div className="mt-5 space-y-1.5 text-xs sm:text-sm text-gray-600 animate-fadeUp">
                <p className="font-bold text-gray-900">
                  {form.firstName} {form.lastName}
                </p>
                <p>{form.address}</p>
                <p>{form.mobile}</p>
                <p>{form.email}</p>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fadeUp">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    First Name*
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    placeholder="Type here..."
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    placeholder="Type here..."
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Address*
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Type here..."
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    City/Town*
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Type here..."
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Zip Code*
                  </label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    placeholder="Type here..."
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mobile*
                  </label>
                  <input
                    type="text"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                    placeholder="Type here..."
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email*
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Type here..."
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            {/* Coupon Input */}
            <div className="mt-4 flex items-center rounded-full bg-brand-surface p-1.5">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter Coupon Code"
                className="flex-1 bg-transparent px-3.5 text-xs sm:text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setCouponApplied(true)}
                className="rounded-full bg-brand-green px-5 py-2 text-xs font-semibold text-white hover:bg-brand-greenHover transition"
              >
                Apply coupon
              </button>
            </div>

            {/* Payment Details */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h3 className="text-sm font-bold text-gray-900">
                Payment Details
              </h3>
              <div className="mt-3 space-y-2.5 text-xs sm:text-sm text-gray-700">
                {[
                  { id: "cod", label: "Cash on Delivery" },
                  { id: "shopcart", label: "Shopcart Card" },
                  { id: "paypal", label: "Paypal" },
                  { id: "card", label: "Credit or Debit Card" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center gap-2.5"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="h-4 w-4 accent-brand-green"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Payment Badges */}
              <div className="mt-4 flex items-center gap-2">
                {["amazon", "Mastercard", "VISA"].map((badge) => (
                  <span
                    key={badge}
                    className="rounded-md bg-brand-surface px-3 py-1 text-[11px] font-bold text-gray-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Card Fields */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    defaultValue={form.email}
                    placeholder="Type here..."
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-xs sm:text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Card Holder Name*
                  </label>
                  <input
                    type="text"
                    placeholder="Type here..."
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-xs sm:text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Card Number*
                  </label>
                  <input
                    type="text"
                    placeholder="0000******1245"
                    className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-xs sm:text-sm outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-xs sm:text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="000"
                      className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-4 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sub Total</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax(10%)</span>
                  <span className="font-semibold text-gray-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Coupon Discount</span>
                  <span className="font-semibold text-gray-900">
                    -${discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-gray-900">-$0.00</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>=${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOrderAccepted(true)}
                className="mt-6 w-full rounded-full bg-brand-green py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-greenHover active:scale-[0.98]"
              >
                Pay ${total.toFixed(2)}
              </button>
            </div>
          </div>

          {/* Cashback Banner */}
          <div className="flex items-center gap-4 rounded-2xl bg-brand-surface p-4">
            <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-green to-emerald-700 text-[10px] font-bold text-white">
              Shopcart
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">
                Earn 5% cash back on Shopcart
              </p>
              <p className="text-[11px] text-gray-500 underline mt-0.5">
                Learn More
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Accepted Modal */}
      {orderAccepted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl animate-popIn">
            {/* Soft Confetti Glow */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-100 via-sky-100 to-rose-100 animate-checkPulse">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <Check className="h-9 w-9 stroke-[3]" />
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 leading-snug">
              Your order has been
              <br />
              accepted
            </h3>
            <p className="mt-2.5 text-xs font-medium text-gray-500">
              Transaction ID: 8960294820
            </p>

            <button
              type="button"
              onClick={() => {
                setOrderAccepted(false);
                router.push("/");
              }}
              className="mt-7 rounded-full bg-brand-orange px-8 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
