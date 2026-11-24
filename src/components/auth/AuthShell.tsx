"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, ShieldCheck, Truck, RotateCcw } from "lucide-react";

/** Two-column frame for sign-in / sign-up. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8 animate-fadeUp">
      <div className="hidden flex-col justify-between rounded-3xl bg-gradient-to-br from-brand-green to-emerald-700 p-10 text-white md:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
            <ShoppingCart className="h-5 w-5 text-brand-green" />
          </span>
          <span className="text-xl font-extrabold">Shopcart</span>
        </Link>
        <div>
          <p className="text-3xl font-extrabold leading-tight">
            Everything you love,
            <br />
            delivered.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-emerald-50">
            <li className="flex items-center gap-2.5">
              <Truck className="h-4 w-4" /> Free delivery on orders over ₹999
            </li>
            <li className="flex items-center gap-2.5">
              <RotateCcw className="h-4 w-4" /> 30-day free returns
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4" /> Secure checkout
            </li>
          </ul>
        </div>
        <p className="text-xs text-emerald-100/80">Track orders, save addresses and keep a wishlist.</p>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

/** Only allow internal redirects after sign-in. */
export function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}
