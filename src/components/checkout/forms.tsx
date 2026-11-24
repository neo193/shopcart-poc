"use client";

import React from "react";
import { DeliveryAddress, PaymentMethod } from "@/lib/orders";

export interface PaymentForm {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  upiId: string;
  bank: string;
}

export type Errors = Partial<Record<keyof DeliveryAddress | keyof PaymentForm, string>>;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Bank of Baroda",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UPI_RE = /^[\w.-]{2,}@[a-zA-Z]{2,}$/;

export function validateAddress(a: DeliveryAddress): Errors {
  const e: Errors = {};
  if (!a.firstName.trim()) e.firstName = "First name is required";
  if (!a.lastName.trim()) e.lastName = "Last name is required";
  if (a.address.trim().length < 5) e.address = "Enter your full street address";
  if (!a.city.trim()) e.city = "City is required";
  if (!a.state.trim()) e.state = "State is required";
  if (!/^\d{6}$/.test(a.zip)) e.zip = "Enter a 6-digit PIN code";
  const digits = a.mobile.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) e.mobile = "Enter a valid 10-digit mobile number";
  if (!EMAIL_RE.test(a.email.trim())) e.email = "Enter a valid email address";
  return e;
}

function luhnOk(num: string) {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

export function validatePayment(method: PaymentMethod, p: PaymentForm): Errors {
  const e: Errors = {};
  if (method === "card") {
    if (!p.cardName.trim()) e.cardName = "Name on card is required";
    const num = p.cardNumber.replace(/\s/g, "");
    if (num.length < 13 || !luhnOk(num)) e.cardNumber = "Enter a valid card number";
    const m = p.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.expiry = "Use MM/YY";
    else {
      const exp = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59);
      if (exp < new Date()) e.expiry = "Card has expired";
    }
    if (!/^\d{3,4}$/.test(p.cvc)) e.cvc = "3 or 4 digits";
  }
  if (method === "upi" && !UPI_RE.test(p.upiId)) e.upiId = "Enter a valid UPI ID, e.g. name@bank";
  if (method === "netbanking" && !p.bank) e.bank = "Choose your bank";
  return e;
}

export function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  className = "",
  required = true,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  className?: string;
  required?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  const inputId = `f-${id}`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-gray-700">
        {label}
        {required && "*"}
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-err` : undefined}
        placeholder={rest.placeholder ?? "Type here..."}
        className={`w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-brand-green/30 ${
          error ? "ring-2 ring-rose-400" : ""
        }`}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-err`} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
}
