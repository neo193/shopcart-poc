"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal, ChevronRight } from "lucide-react";
import { HEADPHONES_PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ListingSkeleton } from "@/components/Skeletons";
import { ProductVisual } from "@/components/ProductVisual";

export default function HeadphonesPage() {
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high">("featured");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ListingSkeleton />;
  }

  const filtered = HEADPHONES_PRODUCTS.filter((p) => {
    if (typeFilter === "All") return true;
    return p.headphoneType === typeFilter;
  }).sort((a, b) => {
    if (sortBy === "low") return a.price - b.price;
    if (sortBy === "high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      {/* Promotional Banner */}
      <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-brand-cream px-8 py-10 sm:flex-row sm:items-center sm:px-14">
        <div className="z-10 max-w-lg space-y-5">
          <h1 className="text-3xl font-extrabold leading-tight text-brand-green sm:text-4xl">
            Grab Upto 50% Off On
            <br />
            Selected Headphone
          </h1>
          <Link
            href="/product/airpods-max"
            className="inline-flex items-center justify-center rounded-full bg-brand-green px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-greenHover active:scale-95"
          >
            Buy Now
          </Link>
        </div>

        <div className="relative flex items-center justify-center sm:pr-6">
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-amber-200/50">
            <ProductVisual
              type="over-ear"
              color="#7C3AED"
              secondaryColor="#C4B5FD"
              className="h-36 w-36"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none rounded-full bg-brand-surface pl-4 pr-9 py-2 text-xs font-semibold text-gray-800 outline-none cursor-pointer hover:bg-gray-200/70 transition"
            >
              <option value="All">Headphone Type</option>
              <option value="Over-Ear">Over-Ear</option>
              <option value="In-Ear">In-Ear</option>
              <option value="On-Ear">On-Ear</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-600" />
          </div>

          {["Price", "Review", "Color", "Material", "Offer"].map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => setTypeFilter("All")}
              className="flex items-center gap-1.5 rounded-full bg-brand-surface px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-200/70 transition"
            >
              <span>{pill}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
            </button>
          ))}

          <button
            type="button"
            onClick={() => setTypeFilter("All")}
            className="flex items-center gap-1.5 rounded-full bg-brand-surface px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-200/70 transition"
          >
            <span>All Filters</span>
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "featured" | "low" | "high")
            }
            className="appearance-none rounded-full border border-gray-200 bg-white pl-4 pr-9 py-2 text-xs font-semibold text-gray-800 outline-none cursor-pointer hover:border-gray-300 transition"
          >
            <option value="featured">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-600" />
        </div>
      </div>

      {/* Product Grid */}
      <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
        Headphones For You!
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-center gap-2.5">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setPage(num)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
              page === num
                ? "bg-brand-green text-white shadow-sm"
                : "border border-gray-200 text-gray-700 hover:bg-brand-surface"
            }`}
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPage((p) => (p < 3 ? p + 1 : 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-brand-surface transition"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
