"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, Cookie } from "lucide-react";

const COOKIE_KEY = "shopcart:cookies";

/** Cookie consent banner. Essential-only is the default-safe choice. */
export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(COOKIE_KEY)) setShow(true);
    } catch {}
  }, []);

  const choose = (v: "all" | "essential") => {
    try {
      window.localStorage.setItem(COOKIE_KEY, v);
    } catch {}
    setShow(false);
  };

  if (!show) return null;
  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[55] mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl animate-fadeUp sm:left-6 sm:right-auto sm:mx-0"
    >
      <div className="flex gap-3">
        <Cookie className="h-6 w-6 shrink-0 text-brand-orange" />
        <div>
          <p className="text-sm font-bold text-gray-900">We use cookies</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Essential cookies keep your cart and sign-in working. With your OK we&apos;d also use analytics
            cookies to improve the store. <Link href="/privacy" className="font-semibold text-brand-green underline">Learn more</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => choose("essential")} className="rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-brand-surface">
              Essential only
            </button>
            <button type="button" onClick={() => choose("all")} className="rounded-full bg-brand-green px-4 py-2 text-xs font-bold text-white hover:bg-brand-greenHover">
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-20 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-green shadow-lg ring-1 ring-gray-200 transition hover:bg-brand-green hover:text-white animate-popIn print:hidden"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
