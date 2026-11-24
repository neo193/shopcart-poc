"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { getProductBySlug } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const { hydrated, wishlist } = useStore();
  const products = wishlist.flatMap((id) => {
    const p = getProductBySlug(id);
    return p ? [p] : [];
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Wishlist</span>
      </nav>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
        My Wishlist {hydrated && products.length > 0 && <span className="text-lg font-semibold text-gray-400">({products.length})</span>}
      </h1>

      {!hydrated ? (
        <div className="mt-8 h-64 rounded-2xl skeleton-shimmer" />
      ) : products.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-brand-surface px-6 py-16 text-center">
          <Heart className="h-10 w-10 text-gray-400" />
          <p className="text-lg font-bold text-gray-900">Your wishlist is empty</p>
          <p className="text-sm text-gray-500">Tap the heart on any product to save it here.</p>
          <Link href="/deals" className="mt-2 rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-greenHover">
            Browse Deals
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
