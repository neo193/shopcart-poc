"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, X, Check } from "lucide-react";
import { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import {
  FilterGroup,
  FilterKey,
  FilterState,
  SORT_OPTIONS,
  activeCount,
  applyFilters,
  buildGroups,
  parseFilters,
} from "./filters";

const PAGE_SIZE = 8;

export function ProductListing({
  products,
  heading,
  emptyState,
}: {
  products: Product[];
  heading?: React.ReactNode;
  /** Shown when the source list itself is empty (not when filters hide everything). */
  emptyState?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const f = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const gridRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const groups = useMemo(() => buildGroups(products, f), [products, f]);
  const results = useMemo(() => applyFilters(products, f), [products, f]);
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(f.page, pages);
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /** Writes changes to the URL so filters survive refresh and can be shared. */
  const update = (changes: Record<string, string | string[] | null>, resetPage = true) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      const val = Array.isArray(v) ? v.join(",") : v;
      if (!val || (k === "sort" && val === "featured") || (k === "page" && val === "1")) next.delete(k);
      else next.set(k, val);
    }
    if (resetPage) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggle = (g: FilterGroup, id: string) => {
    if (g.multi) {
      const cur = f[g.key] as string[];
      update({ [g.key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
    } else {
      update({ [g.key]: f[g.key] === id ? null : id });
    }
  };

  const clearAll = () =>
    update({ type: null, price: null, rating: null, color: null, material: null, offer: null });

  const goToPage = (n: number) => {
    update({ page: String(n) }, false);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chips = groups.flatMap((g) => {
    const sel = g.multi ? (f[g.key] as string[]) : f[g.key] ? [f[g.key] as string] : [];
    return sel.map((id) => ({
      g,
      id,
      label: g.options.find((o) => o.id === id)?.label ?? id,
    }));
  });

  if (products.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {groups.map((g) => (
            <FilterPill key={g.key} group={g} f={f} onToggle={(id) => toggle(g, id)} />
          ))}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-surface px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-200/70 transition"
          >
            All Filters
            {activeCount(f) > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-green px-1 text-[10px] text-white">
                {activeCount(f)}
              </span>
            )}
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </div>

        <div className="relative shrink-0">
          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select
            id="sort"
            value={f.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="appearance-none rounded-full border border-gray-200 bg-white py-2 pl-4 pr-9 text-xs font-semibold text-gray-800 outline-none cursor-pointer hover:border-gray-300 transition"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Sort by: {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-600" />
        </div>
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button
              key={`${c.g.key}-${c.id}`}
              type="button"
              onClick={() => toggle(c.g, c.id)}
              className="flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-brand-green hover:bg-emerald-100 transition"
              aria-label={`Remove filter ${c.label}`}
            >
              {c.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="px-2 text-xs font-semibold text-gray-500 underline hover:text-gray-900"
          >
            Clear all
          </button>
        </div>
      )}

      <div ref={gridRef} className="scroll-mt-40" />
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
        {heading}
        <p className="text-xs text-gray-500">
          {results.length === 0
            ? "No results"
            : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, results.length)} of ${results.length} result${results.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-brand-surface px-6 py-16 text-center">
          <p className="text-lg font-bold text-gray-900">No products match these filters</p>
          <p className="text-sm text-gray-500">Try removing a filter or two.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-2 rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-greenHover transition"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {pageItems.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2.5">
          <PageButton disabled={page === 1} onClick={() => goToPage(page - 1)} label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </PageButton>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => goToPage(n)}
              aria-current={n === page ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                n === page
                  ? "bg-brand-green text-white shadow-sm"
                  : "border border-gray-200 text-gray-700 hover:bg-brand-surface"
              }`}
            >
              {n}
            </button>
          ))}
          <PageButton disabled={page === pages} onClick={() => goToPage(page + 1)} label="Next page">
            <ChevronRight className="h-4 w-4" />
          </PageButton>
        </nav>
      )}

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={groups}
        f={f}
        onToggle={toggle}
        onClear={clearAll}
        resultCount={results.length}
      />
    </div>
  );
}

function PageButton({
  disabled,
  onClick,
  label,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-brand-surface transition disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function isSelected(f: FilterState, key: FilterKey, id: string) {
  const v = f[key];
  return Array.isArray(v) ? v.includes(id) : v === id;
}

function OptionList({
  group,
  f,
  onToggle,
}: {
  group: FilterGroup;
  f: FilterState;
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="space-y-0.5">
      {group.options.map((o) => {
        const sel = isSelected(f, group.key, o.id);
        const disabled = o.count === 0 && !sel;
        return (
          <li key={o.id}>
            <button
              type="button"
              role={group.multi ? "menuitemcheckbox" : "menuitemradio"}
              aria-checked={sel}
              disabled={disabled}
              onClick={() => onToggle(o.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-gray-800 hover:bg-brand-surface transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                  group.multi ? "rounded" : "rounded-full"
                } ${sel ? "border-brand-green bg-brand-green text-white" : "border-gray-300"}`}
              >
                {sel && <Check className="h-3 w-3" />}
              </span>
              {o.swatch && (
                <span
                  className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                  style={{ background: o.swatch }}
                />
              )}
              <span className="flex-1">{o.label}</span>
              <span className="text-xs text-gray-400">{o.count}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function FilterPill({
  group,
  f,
  onToggle,
}: {
  group: FilterGroup;
  f: FilterState;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const v = f[group.key];
  const n = Array.isArray(v) ? v.length : v ? 1 : 0;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden shrink-0 sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
          n > 0 ? "bg-brand-green text-white" : "bg-brand-surface text-gray-800 hover:bg-gray-200/70"
        }`}
      >
        {group.label}
        {n > 0 && group.multi && <span className="opacity-80">({n})</span>}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-11 z-30 max-h-80 w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl animate-popIn"
        >
          <OptionList
            group={group}
            f={f}
            onToggle={(id) => {
              onToggle(id);
              if (!group.multi) setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function FilterDrawer({
  open,
  onClose,
  groups,
  f,
  onToggle,
  onClear,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  groups: FilterGroup[];
  f: FilterState;
  onToggle: (g: FilterGroup, id: string) => void;
  onClear: () => void;
  resultCount: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${
        open ? "visible" : "invisible pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="All filters"
        className={`absolute left-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-full p-2 text-gray-600 hover:bg-brand-surface transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 divide-y divide-gray-100 overflow-y-auto px-4">
          {groups.map((g) => (
            <details key={g.key} open className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-1 text-sm font-bold text-gray-900">
                {g.label}
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2">
                <OptionList group={g} f={f} onToggle={(id) => onToggle(g, id)} />
              </div>
            </details>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-gray-300 py-3 text-sm font-bold text-gray-700 hover:bg-brand-surface transition"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand-green py-3 text-sm font-bold text-white hover:bg-brand-greenHover transition"
          >
            Show {resultCount} result{resultCount === 1 ? "" : "s"}
          </button>
        </div>
      </aside>
    </div>
  );
}
