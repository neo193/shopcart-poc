"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { deliveryWindow, formatDate } from "@/lib/pricing";

const STORAGE_KEY = "shopcart:pin";

/**
 * Mock serviceability check. Any 5–6 digit code is serviceable except ones
 * starting with 9 (so the demo can show the "not available" state).
 * Later this calls a courier/serviceability API.
 */
function checkCode(code: string) {
  if (!/^\d{5,6}$/.test(code)) return { ok: false as const, msg: "Enter a valid 5 or 6 digit code" };
  if (code.startsWith("9")) return { ok: false as const, msg: `Sorry, we don't deliver to ${code} yet` };
  const std = deliveryWindow("standard");
  const exp = deliveryWindow("express");
  return {
    ok: true as const,
    msg: `Delivery to ${code} by ${formatDate(std.latest)}. Express by ${formatDate(exp.latest)}.`,
  };
}

export function DeliveryCheck() {
  const [code, setCode] = useState("");
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof checkCode> | null>(null);

  // Remember the shopper's code across product pages.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCode(saved);
        setResult(checkCode(saved));
      }
    } catch {}
  }, []);

  const submit = () => {
    const r = checkCode(code.trim());
    setResult(r);
    if (r.ok) {
      setEditing(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, code.trim());
      } catch {}
    }
  };

  if (!editing && !result) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-0.5 text-xs text-gray-500 underline underline-offset-2 hover:text-brand-green"
      >
        Enter your Postal code for Delivery Availability
      </button>
    );
  }

  if (!editing && result?.ok) {
    return (
      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-emerald-700">
        <MapPin className="h-3.5 w-3.5" />
        {result.msg}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="font-semibold text-gray-500 underline hover:text-brand-green"
        >
          Change
        </button>
      </p>
    );
  }

  return (
    <div className="mt-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex max-w-xs items-center rounded-full bg-brand-surface p-1"
      >
        <label htmlFor="pin" className="sr-only">
          Postal code
        </label>
        <input
          id="pin"
          autoFocus
          inputMode="numeric"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setResult(null);
          }}
          placeholder="Zip / PIN code"
          className="min-w-0 flex-1 bg-transparent px-3 text-xs outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-brand-green px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-greenHover"
        >
          Check
        </button>
      </form>
      {result && !result.ok && <p className="mt-1 text-xs text-rose-600">{result.msg}</p>}
    </div>
  );
}
