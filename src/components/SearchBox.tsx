"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { searchProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { ProductVisual } from "./ProductVisual";
import { Stars } from "./Stars";

/** Header search with live suggestions, keyboard navigation and a full results page. */
export function SearchBox({ id = "site-search" }: { id?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the box in sync with the search page's query.
  useEffect(() => {
    if (pathname === "/search") setQuery(params.get("q") ?? "");
  }, [pathname, params]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const q = query.trim();
  const all = q ? searchProducts(q) : [];
  const results = all.slice(0, 5);
  // Options: each product, then "see all".
  const optionCount = results.length + (q ? 1 : 0);

  const goSearch = () => {
    if (!q) return;
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const goProduct = (slug: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/product/${slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % Math.max(1, optionCount));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? optionCount - 1 : a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && active < results.length) goProduct(results[active].slug);
      else goSearch();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const listId = `${id}-list`;

  return (
    <div ref={wrapRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goSearch();
        }}
        className="flex items-center rounded-full border border-transparent bg-brand-surface px-4 py-2 transition focus-within:border-brand-green/30 focus-within:bg-white"
      >
        <label htmlFor={id} className="sr-only">
          Search products
        </label>
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search Product"
          autoComplete="off"
          role="combobox"
          aria-expanded={open && !!q}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${id}-opt-${active}` : undefined}
          className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <button type="submit" aria-label="Search" className="shrink-0 text-gray-500 hover:text-brand-green">
          <Search className="h-4 w-4" />
        </button>
      </form>

      {open && q && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-12 z-50 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl animate-popIn"
        >
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-gray-500">
              No products found for &ldquo;{q}&rdquo;
            </p>
          ) : (
            results.map((p, i) => (
              <button
                key={p.id}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={active === i}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => goProduct(p.slug)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl p-2 text-left transition ${
                  active === i ? "bg-brand-surface" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-surface">
                    <ProductVisual
                      type={p.visualType}
                      emoji={p.emoji}
                      color={p.defaultColor}
                      secondaryColor={p.colors[0]?.secondaryHex}
                      className="h-9 w-9"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{p.name}</p>
                    <p className="text-[11px] text-gray-500">{p.category}</p>
                    <Stars rating={p.rating} size="h-3 w-3" />
                  </div>
                </div>
                <span className="shrink-0 text-sm font-bold text-gray-900">{formatPrice(p.price)}</span>
              </button>
            ))
          )}
          <button
            id={`${id}-opt-${results.length}`}
            role="option"
            aria-selected={active === results.length}
            type="button"
            onMouseEnter={() => setActive(results.length)}
            onClick={goSearch}
            className={`mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-green transition ${
              active === results.length ? "bg-brand-surface" : ""
            }`}
          >
            {all.length > 0 ? `See all ${all.length} results` : "Search anyway"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
