"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export function Newsletter() {
  const { showToast } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-sm font-semibold text-brand-green">✓ You&apos;re subscribed. Watch your inbox for offers!</p>;
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError(true);
        setDone(true);
        showToast("Subscribed to Shopcart offers");
      }}
      className="max-w-sm"
    >
      <label htmlFor="newsletter" className="mb-2 block text-xs font-bold text-gray-900">
        Get offers in your inbox
      </label>
      <div className={`flex items-center rounded-full bg-brand-surface p-1 ${error ? "ring-2 ring-rose-300" : ""}`}>
        <input
          id="newsletter"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          placeholder="you@example.com"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-3.5 text-sm outline-none"
        />
        <button type="submit" className="rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-white hover:bg-brand-greenHover">
          Subscribe
        </button>
      </div>
      {error && <p className="mt-1 px-2 text-xs text-rose-600">Enter a valid email address</p>}
    </form>
  );
}
