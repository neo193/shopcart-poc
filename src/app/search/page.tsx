"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchProducts, CATEGORIES } from "@/lib/catalog";
import { ListingPage } from "@/components/listing/ListingPage";
import { ListingSkeleton } from "@/components/Skeletons";

export default function SearchPage() {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <Search />
    </Suspense>
  );
}

function Search() {
  const q = useSearchParams().get("q")?.trim() ?? "";
  const results = searchProducts(q);

  return (
    <ListingPage
      // Remount on a new query so the skeleton and filters reset.
      key={q}
      crumbs={[{ label: q ? `Search: "${q}"` : "Search" }]}
      heading={
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {q ? (
            <>
              Results for <span className="text-brand-green">&ldquo;{q}&rdquo;</span>
            </>
          ) : (
            "Search"
          )}
        </h1>
      }
      products={results}
      emptyState={
        <div className="rounded-2xl bg-brand-surface px-6 py-16 text-center">
          <p className="text-lg font-bold text-gray-900">
            {q ? <>No products found for &ldquo;{q}&rdquo;</> : "Type in the search bar to find products"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Check the spelling, try a more general word, or browse a category.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-100"
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>
      }
    />
  );
}
