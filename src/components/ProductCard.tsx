"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [justAdded, setJustAdded] = useState(false);
  const isWished = wishlist.includes(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.colors[0]?.name, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group flex flex-col animate-fadeUp">
      {/* Image Box */}
      <Link
        href={`/product/${product.slug}`}
        className="relative flex h-64 w-full items-center justify-center rounded-2xl bg-brand-surface p-6 overflow-hidden transition-colors group-hover:bg-[#eff1f2]"
      >
        <button
          type="button"
          aria-label="Toggle wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWished ? "fill-rose-500 text-rose-500" : "text-gray-700"
            }`}
          />
        </button>

        <div className="transition-transform duration-300 group-hover:scale-105">
          <ProductVisual
            type={product.visualType}
            color={product.defaultColor}
            secondaryColor={product.colors[0]?.secondaryHex}
            className="h-44 w-44"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="text-base font-bold text-gray-900 hover:text-brand-green transition line-clamp-1"
            >
              {product.name}
            </Link>
            <span className="text-base font-bold text-gray-900 shrink-0">
              ${product.price.toFixed(0)}
              <sup className="text-[11px] font-semibold">.00</sup>
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500 line-clamp-1">
            {product.shortDesc}
          </p>

          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-brand-star text-brand-star"
              />
            ))}
            <span className="ml-1 text-xs text-gray-600">
              ({product.reviews})
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`mt-4 w-fit rounded-full border px-5 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
            justAdded
              ? "border-brand-green bg-brand-green text-white"
              : "border-gray-900 bg-white text-gray-900 hover:border-brand-green hover:bg-brand-green hover:text-white"
          }`}
        >
          {justAdded ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
