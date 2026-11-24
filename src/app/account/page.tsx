"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, MapPin, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { Field } from "@/components/checkout/forms";

export default function ProfilePage() {
  const { user, addresses, updateProfile } = useAuth();
  const { orders, wishlist, showToast } = useStore();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  if (!user) return null;

  const myOrders = orders.filter((o) => o.userEmail === user.email);
  const stats = [
    { label: "Orders", value: myOrders.length, href: "/account/orders", icon: Package },
    { label: "Saved addresses", value: addresses.length, href: "/account/addresses", icon: MapPin },
    { label: "Wishlist items", value: wishlist.length, href: "/wishlist", icon: Heart },
  ];
  const dirty =
    form.firstName !== user.firstName || form.lastName !== user.lastName || form.phone !== user.phone;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Hello, {user.firstName}!</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="group rounded-2xl border border-gray-200 p-5 transition hover:border-brand-green/40 hover:shadow-sm">
            <Icon className="h-5 w-5 text-brand-orange" />
            <p className="mt-3 text-2xl font-extrabold text-gray-900">{value}</p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-brand-green">{label} →</p>
          </Link>
        ))}
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const errs: typeof errors = {};
          if (!form.firstName.trim()) errs.firstName = "Required";
          if (!form.lastName.trim()) errs.lastName = "Required";
          if (form.phone.replace(/\D/g, "").length < 10) errs.phone = "Enter a 10-digit mobile number";
          setErrors(errs);
          if (Object.keys(errs).length) return;
          updateProfile({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), phone: form.phone.trim() });
          showToast("Profile updated");
        }}
        className="rounded-2xl border border-gray-200 p-6"
      >
        <h2 className="text-lg font-bold text-gray-900">Personal details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="p-first" label="First Name" value={form.firstName} error={errors.firstName} onChange={(v) => setForm((f) => ({ ...f, firstName: v }))} />
          <Field id="p-last" label="Last Name" value={form.lastName} error={errors.lastName} onChange={(v) => setForm((f) => ({ ...f, lastName: v }))} />
          <Field id="p-phone" label="Mobile" type="tel" value={form.phone} error={errors.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
          <div>
            <label htmlFor="f-p-email" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Email
            </label>
            <input
              id="f-p-email"
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-lg bg-gray-100 px-3.5 py-2.5 text-sm text-gray-500"
            />
            <p className="mt-1 text-[11px] text-gray-400">Email can&apos;t be changed in the demo.</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={!dirty}
          className="mt-5 rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-greenHover disabled:opacity-40"
        >
          Save Changes
        </button>
      </form>

      <p className="text-xs text-gray-400">
        Member since{" "}
        {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
