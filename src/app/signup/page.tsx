"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { Field } from "@/components/checkout/forms";
import { AuthShell, safeNext } from "@/components/auth/AuthShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <Signup />
    </Suspense>
  );
}

function Signup() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { user, hydrated, signUp } = useAuth();
  const { showToast } = useStore();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && user) router.replace(next);
  }, [hydrated, user, next, router]);

  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setFormError(null);
  };

  const submit = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit mobile number";
    if (form.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    if (Object.keys(e).length) return;
    const r = signUp({ ...form, firstName: form.firstName.trim(), lastName: form.lastName.trim() });
    if (!r.ok) setFormError(r.error);
    else showToast(`Welcome to Shopcart, ${form.firstName.trim()}!`);
  };

  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute.">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="grid grid-cols-2 gap-4"
      >
        <Field id="su-first" label="First Name" value={form.firstName} error={errors.firstName} onChange={set("firstName")} autoComplete="given-name" />
        <Field id="su-last" label="Last Name" value={form.lastName} error={errors.lastName} onChange={set("lastName")} autoComplete="family-name" />
        <Field id="su-email" label="Email" type="email" value={form.email} error={errors.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" className="col-span-2" />
        <Field id="su-phone" label="Mobile" type="tel" value={form.phone} error={errors.phone} onChange={set("phone")} autoComplete="tel" placeholder="+91 98765 43210" className="col-span-2" />
        <Field id="su-password" label="Password" type="password" value={form.password} error={errors.password} onChange={set("password")} autoComplete="new-password" placeholder="At least 6 characters" className="col-span-2" />
        {formError && (
          <p role="alert" className="col-span-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
            {formError}
          </p>
        )}
        <button
          type="submit"
          className="col-span-2 w-full rounded-full bg-brand-green py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-greenHover active:scale-[0.98]"
        >
          Create Account
        </button>
        <p className="col-span-2 text-center text-[11px] text-gray-400">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> and{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>. Demo only: nothing leaves this browser.
        </p>
      </form>
      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-green hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
