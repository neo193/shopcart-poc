"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { ListingSkeleton } from "@/components/Skeletons";
import { ProductListing } from "./ProductListing";

/** Page frame shared by category, deals, what's new and search pages. */
export function ListingPage({
  crumbs,
  banner,
  heading,
  products,
  emptyState,
}: {
  crumbs: { label: string; href?: string }[];
  banner?: React.ReactNode;
  heading?: React.ReactNode;
  products: Product[];
  emptyState?: React.ReactNode;
}) {
  // Brief shimmer on first load keeps the POC's loading transition.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);
  if (!ready) return <ListingSkeleton />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        {crumbs.map((c) => (
          <React.Fragment key={c.label}>
            <span>/</span>
            {c.href ? (
              <Link href={c.href} className="hover:text-brand-green">
                {c.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-900">{c.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
      {banner && <div className="mb-8">{banner}</div>}
      <Suspense fallback={null}>
        <ProductListing products={products} heading={heading} emptyState={emptyState} />
      </Suspense>
    </div>
  );
}

export function PromoBanner({
  title,
  subtitle,
  bg,
  emoji,
  cta,
}: {
  title: string;
  subtitle?: string;
  bg: string;
  emoji: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div
      className={`relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl ${bg} px-8 py-10 sm:flex-row sm:items-center sm:px-14`}
    >
      <div className="z-10 max-w-lg space-y-4">
        <h1 className="text-3xl font-extrabold leading-tight text-brand-green sm:text-4xl">{title}</h1>
        {subtitle && <p className="text-sm text-gray-700">{subtitle}</p>}
        {cta && (
          <Link
            href={cta.href}
            className="inline-flex items-center justify-center rounded-full bg-brand-green px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-greenHover active:scale-95"
          >
            {cta.label}
          </Link>
        )}
      </div>
      <div className="flex h-36 w-36 items-center justify-center rounded-full bg-white/60 text-7xl shadow-inner sm:mr-6 sm:h-44 sm:w-44 sm:text-8xl">
        <span aria-hidden>{emoji}</span>
      </div>
    </div>
  );
}
