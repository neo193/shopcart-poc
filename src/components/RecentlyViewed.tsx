"use client";

import { useEffect, useState } from "react";
import { getProductBySlug, Product } from "@/data/products";
import { recentlyViewed } from "@/lib/reviews";
import { ProductCard } from "./ProductCard";

/** Products this browser looked at recently, excluding the current one. */
export function RecentlyViewed({ excludeId, title = "Recently Viewed" }: { excludeId?: string; title?: string }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    setItems(
      recentlyViewed()
        .filter((id) => id !== excludeId)
        .flatMap((id) => {
          const p = getProductBySlug(id);
          return p ? [p] : [];
        })
        .slice(0, 4)
    );
  }, [excludeId]);

  if (items.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
