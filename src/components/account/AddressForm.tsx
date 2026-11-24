"use client";

import { useState } from "react";
import { DeliveryAddress } from "@/lib/orders";
import { Field, validateAddress, Errors, INDIAN_STATES } from "@/components/checkout/forms";

export const EMPTY_ADDRESS: DeliveryAddress = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  mobile: "",
  email: "",
};

/** Address fields shared by checkout and the account address book. */
export function AddressFields({
  value,
  onChange,
  errors,
  idPrefix = "",
}: {
  value: DeliveryAddress;
  onChange: (k: keyof DeliveryAddress, v: string) => void;
  errors: Errors;
  idPrefix?: string;
}) {
  const id = (k: string) => `${idPrefix}${k}`;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field id={id("firstName")} label="First Name" value={value.firstName} error={errors.firstName} onChange={(v) => onChange("firstName", v)} autoComplete="given-name" />
      <Field id={id("lastName")} label="Last Name" value={value.lastName} error={errors.lastName} onChange={(v) => onChange("lastName", v)} autoComplete="family-name" />
      <Field id={id("address")} label="Flat, House no., Street, Area" value={value.address} error={errors.address} onChange={(v) => onChange("address", v)} autoComplete="street-address" className="sm:col-span-2" />
      <Field id={id("city")} label="City/Town" value={value.city} error={errors.city} onChange={(v) => onChange("city", v)} autoComplete="address-level2" />
      <div>
        <label htmlFor={`f-${id("state")}`} className="mb-1.5 block text-xs font-semibold text-gray-700">
          State*
        </label>
        <select
          id={`f-${id("state")}`}
          value={value.state}
          onChange={(e) => onChange("state", e.target.value)}
          aria-invalid={!!errors.state}
          autoComplete="address-level1"
          className={`w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30 ${
            errors.state ? "ring-2 ring-rose-400" : ""
          }`}
        >
          <option value="">Select state…</option>
          {/* Keep a pre-filled value even if it isn't in the list. */}
          {value.state && !INDIAN_STATES.includes(value.state) && <option>{value.state}</option>}
          {INDIAN_STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {errors.state && <p className="mt-1 text-xs text-rose-600">{errors.state}</p>}
      </div>
      <Field id={id("zip")} label="PIN Code" value={value.zip} error={errors.zip} onChange={(v) => onChange("zip", v.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="postal-code" placeholder="560001" />
      <Field id={id("mobile")} label="Mobile" value={value.mobile} error={errors.mobile} onChange={(v) => onChange("mobile", v)} type="tel" autoComplete="tel" placeholder="+91 98765 43210" />
      <Field id={id("email")} label="Email" value={value.email} error={errors.email} onChange={(v) => onChange("email", v)} type="email" autoComplete="email" className="sm:col-span-2" />
    </div>
  );
}

/** Self-contained add/edit form for the address book. */
export function AddressEditor({
  initial,
  initialLabel = "Home",
  initialDefault = false,
  onSave,
  onCancel,
}: {
  initial: DeliveryAddress;
  initialLabel?: string;
  initialDefault?: boolean;
  onSave: (addr: DeliveryAddress, label: string, isDefault: boolean) => void;
  onCancel: () => void;
}) {
  const [addr, setAddr] = useState(initial);
  const [label, setLabel] = useState(initialLabel);
  const [isDefault, setIsDefault] = useState(initialDefault);
  const [errors, setErrors] = useState<Errors>({});

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const errs = validateAddress(addr);
        setErrors(errs);
        if (Object.keys(errs).length === 0) onSave(addr, label, isDefault);
      }}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 animate-fadeUp"
    >
      <AddressFields
        idPrefix="ab-"
        value={addr}
        errors={errors}
        onChange={(k, v) => {
          setAddr((a) => ({ ...a, [k]: v }));
          setErrors((e) => ({ ...e, [k]: undefined }));
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-700">Save as:</span>
        {["Home", "Work", "Other"].map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLabel(l)}
            aria-pressed={label === l}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              label === l ? "bg-brand-green text-white" : "bg-brand-surface text-gray-700 hover:bg-gray-200"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="h-4 w-4 accent-brand-green"
        />
        Make this my default address
      </label>
      <div className="flex gap-3">
        <button type="submit" className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-greenHover transition">
          Save Address
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-brand-surface transition">
          Cancel
        </button>
      </div>
    </form>
  );
}
