"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { Field } from "@/components/checkout/forms";
import { AuthShell, safeNext } from "@/components/auth/AuthShell";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}

function Login() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { user, hydrated, signIn, signInDemo } = useAuth();
  const { showToast } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Already signed in (or just signed in): continue.
  useEffect(() => {
    if (hydrated && user) router.replace(next);
  }, [hydrated, user, next, router]);

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track orders and check out faster.">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const r = signIn(email, password);
          if (!r.ok) setError(r.error);
          else showToast("Signed in");
        }}
        className="space-y-4"
      >
        <Field id="login-email" label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setError(null); }} autoComplete="email" placeholder="you@example.com" />
        <Field id="login-password" label="Password" type="password" value={password} onChange={(v) => { setPassword(v); setError(null); }} autoComplete="current-password" placeholder="••••••••" />
        {error && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-full bg-brand-green py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-greenHover active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" /> or <span className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={() => {
          signInDemo();
          showToast("Signed in as the demo customer");
        }}
        className="w-full rounded-full border border-brand-green py-3.5 text-sm font-bold text-brand-green transition hover:bg-brand-surface"
      >
        Continue with demo account
      </button>
      <p className="mt-2 text-center text-[11px] text-gray-400">
        Demo sign-in: accounts are saved in this browser only, and any password works.
      </p>

      <p className="mt-8 text-center text-sm text-gray-600">
        New to Shopcart?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-green hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
