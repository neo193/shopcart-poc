"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  Lock,
  UserCircle,
  Truck,
  Zap,
  Info,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { AddressFields, EMPTY_ADDRESS } from "@/components/account/AddressForm";
import {
  calcTotals,
  deliveryWindow,
  formatDate,
  formatPrice,
  lineId,
  ShippingMethod,
  SHIPPING_OPTIONS,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/pricing";
import {
  DeliveryAddress,
  Order,
  PaymentMethod,
  PAYMENT_LABELS,
  newOrderId,
  newTransactionId,
} from "@/lib/orders";
import { CartItemThumb } from "@/components/cart/CartLine";
import { CouponBox } from "@/components/cart/CouponBox";
import { TotalsRows } from "@/components/cart/TotalsRows";
import { PaymentModal, PaymentPhase } from "@/components/checkout/PaymentModal";
import {
  Field,
  validateAddress,
  validatePayment,
  PaymentForm,
  Errors,
  BANKS,
  formatCardNumber,
  formatExpiry,
} from "@/components/checkout/forms";

const PAYMENT_ICONS: Record<PaymentMethod, React.ElementType> = {
  card: CreditCard,
  upi: Smartphone,
  netbanking: Landmark,
  cod: Banknote,
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <Checkout />
    </Suspense>
  );
}

function Checkout() {
  const router = useRouter();
  const params = useSearchParams();
  const isBuyNow = params.get("mode") === "buy-now";
  const {
    hydrated,
    cart,
    buyNowItem,
    setBuyNowItem,
    couponCode,
    removeCoupon,
    orders,
    addOrder,
    clearCart,
  } = useStore();

  const auth = useAuth();
  const items = isBuyNow && buyNowItem ? [buyNowItem] : cart;

  // New-address form state, plus which saved address (if any) is selected.
  const [address, setAddress] = useState<DeliveryAddress>(EMPTY_ADDRESS);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [saveToAccount, setSaveToAccount] = useState(true);
  const prefilledFor = useRef<string | null>(null);
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [payment, setPayment] = useState<PaymentForm>({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    upiId: "",
    bank: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [phase, setPhase] = useState<PaymentPhase>("idle");
  const placingRef = useRef(false);

  const totals = calcTotals(items, couponCode, shipping, orders.length);

  // Once auth is loaded: preselect the default address, or prefill the
  // new-address form from the profile. Re-runs if the shopper signs in.
  useEffect(() => {
    if (!auth.hydrated) return;
    const key = auth.user?.email ?? "guest";
    if (prefilledFor.current === key) return;
    prefilledFor.current = key;
    if (auth.defaultAddress) setSelectedAddressId(auth.defaultAddress.id);
    else {
      setSelectedAddressId("new");
      const u = auth.user;
      if (u)
        setAddress((a) => ({
          ...a,
          firstName: a.firstName || u.firstName,
          lastName: a.lastName || u.lastName,
          mobile: a.mobile || u.phone,
          email: a.email || u.email,
        }));
    }
  }, [auth.hydrated, auth.user, auth.defaultAddress]);

  const savedSelected = auth.addresses.find((a) => a.id === selectedAddressId);
  const effectiveAddress: DeliveryAddress = savedSelected ?? address;

  // Buy Now link opened without a pending item (e.g. after refresh): fall back to cart.
  useEffect(() => {
    if (hydrated && isBuyNow && !buyNowItem && !placingRef.current)
      router.replace("/checkout");
  }, [hydrated, isBuyNow, buyNowItem, router]);

  if (!hydrated || !auth.hydrated) return <CheckoutSkeleton />;

  if (items.length === 0 && phase === "idle") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">Nothing to check out</h1>
        <p className="mt-2 text-sm text-gray-500">Your cart is empty.</p>
        <Link
          href="/deals"
          className="mt-6 inline-block rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white hover:bg-brand-greenHover transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const setField = (k: keyof DeliveryAddress, v: string) => {
    setAddress((a) => ({ ...a, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const setPay = (k: keyof PaymentForm, v: string) => {
    setPayment((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const window_ = deliveryWindow(shipping);

  const startPayment = (fail = simulateFailure) => {
    const addrErrors = validateAddress(effectiveAddress);
    const payErrors = validatePayment(paymentMethod, payment);
    const all = { ...addrErrors, ...payErrors };
    setErrors(all);
    const firstKey = Object.keys(all)[0];
    if (firstKey) {
      if (firstKey in addrErrors && savedSelected) {
        // A saved address is incomplete: open it in the form to fix.
        setAddress(savedSelected);
        setSelectedAddressId("new");
      }
      // Wait for the address form to render before focusing.
      setTimeout(() => {
        const el = document.getElementById(`f-${firstKey}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
      }, 50);
      return;
    }
    setPhase("processing");
    window.setTimeout(
      () => (fail ? setPhase("failed") : completeOrder()),
      paymentMethod === "upi" ? 3200 : 2200
    );
  };

  const completeOrder = () => {
    placingRef.current = true;
    const paymentSummary =
      paymentMethod === "card"
        ? `Card ending ${payment.cardNumber.replace(/\s/g, "").slice(-4)}`
        : paymentMethod === "upi"
          ? payment.upiId
          : paymentMethod === "netbanking"
            ? payment.bank
            : "Pay on delivery";
    const { coupon: _ignored, ...plainTotals } = totals;
    const order: Order = {
      id: newOrderId(),
      transactionId: paymentMethod === "cod" ? "—" : newTransactionId(),
      createdAt: new Date().toISOString(),
      status: "Confirmed",
      lines: items.map((i) => ({
        productId: i.product.id,
        slug: i.product.slug,
        name: i.product.name,
        color: i.color,
        quantity: i.quantity,
        unitPrice: i.product.price,
      })),
      couponCode: totals.coupon?.valid ? totals.coupon.coupon.code : null,
      totals: plainTotals,
      shippingMethod: shipping,
      estimatedDelivery: {
        earliest: window_.earliest.toISOString(),
        latest: window_.latest.toISOString(),
      },
      address: effectiveAddress,
      paymentMethod,
      paymentSummary,
      userEmail: auth.user?.email,
    };
    addOrder(order);
    if (auth.user && !savedSelected && saveToAccount) {
      auth.saveAddress({ ...effectiveAddress, label: auth.addresses.length ? "Other" : "Home" });
    }
    if (isBuyNow) {
      setBuyNowItem(null);
      removeCoupon();
    } else clearCart();
    setPhase("success");
    router.replace(`/order/${order.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      <nav className="mb-6 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        {!isBuyNow && (
          <>
            <Link href="/cart" className="hover:text-brand-green">
              Cart
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-semibold text-gray-900">Checkout</span>
      </nav>

      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <span className="font-semibold">Demo checkout.</span> No real payment is
          taken and nothing leaves your browser. Use any test details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {/* 1. Review items */}
          <Section
            step={1}
            title="Review Items"
            action={
              isBuyNow ? (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800">
                  Buy Now
                </span>
              ) : (
                <Link
                  href="/cart"
                  className="text-xs font-semibold text-brand-green hover:underline"
                >
                  Edit cart
                </Link>
              )
            }
          >
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={lineId(item)} className="flex items-center gap-4 py-3">
                  <CartItemThumb item={item} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {item.product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Color: {item.color} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          {/* 2. Delivery information */}
          <Section step={2} title="Delivery Address">
            {!auth.user && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-surface px-4 py-3">
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <UserCircle className="h-5 w-5 text-brand-green" />
                  Have an account? Sign in to use your saved addresses.
                </p>
                <Link
                  href={`/login?next=${encodeURIComponent(isBuyNow ? "/checkout?mode=buy-now" : "/checkout")}`}
                  className="rounded-full bg-brand-green px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-greenHover"
                >
                  Sign in
                </Link>
              </div>
            )}

            {auth.addresses.length > 0 && (
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Saved addresses">
                {auth.addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 text-sm transition ${
                      selectedAddressId === a.id
                        ? "border-brand-green bg-emerald-50/50 ring-1 ring-brand-green"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="saved-address"
                      checked={selectedAddressId === a.id}
                      onChange={() => {
                        setSelectedAddressId(a.id);
                        setErrors({});
                      }}
                      className="mt-1 h-4 w-4 accent-brand-green"
                    />
                    <span className="text-gray-600">
                      <span className="mb-1 flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          {a.firstName} {a.lastName}
                        </span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-600 ring-1 ring-gray-200">
                          {a.label}
                        </span>
                      </span>
                      <span className="block">{a.address}</span>
                      <span className="block">
                        {a.city}, {a.state} {a.zip}
                      </span>
                      <span className="block">{a.mobile}</span>
                    </span>
                  </label>
                ))}
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-4 text-sm font-semibold transition ${
                    selectedAddressId === "new"
                      ? "border-brand-green text-brand-green"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="saved-address"
                    checked={selectedAddressId === "new"}
                    onChange={() => setSelectedAddressId("new")}
                    className="h-4 w-4 accent-brand-green"
                  />
                  + Deliver to a new address
                </label>
              </div>
            )}

            {selectedAddressId === "new" && (
              <div className="animate-fadeUp">
                <AddressFields value={address} errors={errors} onChange={setField} />
                {auth.user && (
                  <label className="mt-4 flex w-fit cursor-pointer items-center gap-2.5 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={saveToAccount}
                      onChange={(e) => setSaveToAccount(e.target.checked)}
                      className="h-4 w-4 accent-brand-green"
                    />
                    Save this address to my account
                  </label>
                )}
              </div>
            )}
          </Section>

          {/* 3. Delivery method */}
          <Section step={3} title="Delivery Method">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(Object.keys(SHIPPING_OPTIONS) as ShippingMethod[]).map((m) => {
                const opt = SHIPPING_OPTIONS[m];
                const w = deliveryWindow(m);
                const fee = calcTotals(items, couponCode, m, orders.length).shippingFee;
                const Icon = m === "express" ? Zap : Truck;
                return (
                  <label
                    key={m}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                      shipping === m
                        ? "border-brand-green bg-emerald-50/50 ring-1 ring-brand-green"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping === m}
                      onChange={() => setShipping(m)}
                      className="mt-1 h-4 w-4 accent-brand-green"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                          <Icon className="h-4 w-4 text-brand-orange" /> {opt.label}
                        </span>
                        <span className={`text-sm font-bold ${fee === 0 ? "text-emerald-700" : "text-gray-900"}`}>
                          {fee === 0 ? "Free" : formatPrice(fee)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Arrives {formatDate(w.earliest)} – {formatDate(w.latest)}
                      </p>
                      {m === "standard" && fee > 0 && (
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          Free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </Section>

          {/* 4. Payment */}
          <Section step={4} title="Payment Method">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((m) => {
                const Icon = PAYMENT_ICONS[m];
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m);
                      setErrors((e) => ({
                        ...e,
                        cardName: undefined,
                        cardNumber: undefined,
                        expiry: undefined,
                        cvc: undefined,
                        upiId: undefined,
                        bank: undefined,
                      }));
                    }}
                    aria-pressed={paymentMethod === m}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center text-xs font-semibold transition ${
                      paymentMethod === m
                        ? "border-brand-green bg-emerald-50/50 text-brand-green ring-1 ring-brand-green"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {PAYMENT_LABELS[m]}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 animate-fadeUp" key={paymentMethod}>
              {paymentMethod === "card" && (
                <div className="grid grid-cols-2 gap-4">
                  <Field id="cardName" label="Card Holder Name" value={payment.cardName} error={errors.cardName} onChange={(v) => setPay("cardName", v)} autoComplete="off" className="col-span-2" />
                  <Field id="cardNumber" label="Card Number" value={payment.cardNumber} error={errors.cardNumber} onChange={(v) => setPay("cardNumber", formatCardNumber(v))} inputMode="numeric" placeholder="4111 1111 1111 1111" autoComplete="off" className="col-span-2" />
                  <Field id="expiry" label="Expiry" value={payment.expiry} error={errors.expiry} onChange={(v) => setPay("expiry", formatExpiry(v))} inputMode="numeric" placeholder="MM/YY" autoComplete="off" />
                  <Field id="cvc" label="CVC" value={payment.cvc} error={errors.cvc} onChange={(v) => setPay("cvc", v.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="123" autoComplete="off" />
                  <p className="col-span-2 text-[11px] text-gray-400">
                    Demo only. Use a test number like 4111 1111 1111 1111, never a real card.
                  </p>
                </div>
              )}
              {paymentMethod === "upi" && (
                <Field id="upiId" label="UPI ID" value={payment.upiId} error={errors.upiId} onChange={(v) => setPay("upiId", v.trim())} placeholder="name@bank" autoComplete="off" hint="You'll approve the request in your UPI app." />
              )}
              {paymentMethod === "netbanking" && (
                <div>
                  <label htmlFor="f-bank" className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Select your bank*
                  </label>
                  <select
                    id="f-bank"
                    value={payment.bank}
                    onChange={(e) => setPay("bank", e.target.value)}
                    aria-invalid={!!errors.bank}
                    className={`w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30 ${
                      errors.bank ? "ring-2 ring-rose-400" : ""
                    }`}
                  >
                    <option value="">Choose a bank…</option>
                    {BANKS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                  {errors.bank && <p className="mt-1 text-xs text-rose-600">{errors.bank}</p>}
                </div>
              )}
              {paymentMethod === "cod" && (
                <p className="rounded-xl bg-brand-surface p-4 text-sm text-gray-600">
                  Pay with cash or UPI when your order arrives. Please keep{" "}
                  <span className="font-bold text-gray-900">{formatPrice(totals.total)}</span> ready.
                </p>
              )}
            </div>
          </Section>
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-5">
          <div className="sticky top-32 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="mt-4">
                <CouponBox items={items} totals={totals} />
              </div>
              <div className="mt-5 border-t border-gray-100 pt-4">
                <TotalsRows totals={totals} />
              </div>

              <button
                type="button"
                onClick={() => startPayment()}
                disabled={phase !== "idle"}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-green py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-greenHover active:scale-[0.98] disabled:opacity-60"
              >
                <Lock className="h-4 w-4" />
                {paymentMethod === "cod"
                  ? `Place Order · ${formatPrice(totals.total)}`
                  : `Pay ${formatPrice(totals.total)}`}
              </button>

              <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-[11px] text-gray-500 select-none">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="h-3.5 w-3.5 accent-rose-500"
                />
                Demo: simulate a failed payment
              </label>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-brand-surface p-4">
              <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-green to-emerald-700 text-[10px] font-bold text-white">
                Shopcart
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Earn 5% cash back on Shopcart</p>
                <p className="mt-0.5 text-[11px] text-gray-500">With the Shopcart Card (coming soon)</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <PaymentModal
        phase={phase}
        method={paymentMethod}
        amount={totals.total}
        upiId={payment.upiId}
        onRetry={() => {
          // Retry succeeds so the demo can continue.
          setSimulateFailure(false);
          startPayment(false);
        }}
        onChangeMethod={() => setPhase("idle")}
      />
    </div>
  );
}

function Section({
  step,
  title,
  action,
  children,
}: {
  step: number;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-lg font-bold text-gray-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
            {step}
          </span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-4 w-40 rounded skeleton-shimmer" />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-48 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
        <div className="h-96 rounded-2xl skeleton-shimmer lg:col-span-5" />
      </div>
    </div>
  );
}
