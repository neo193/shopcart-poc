"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  ChevronDown,
  Search,
  User,
  ShoppingCart,
  Star,
} from "lucide-react";
import { ALL_PRODUCTS, POPULAR_CATEGORIES } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { ProductVisual } from "./ProductVisual";

export function Navbar() {
  const router = useRouter();
  const { cartCount } = useStore();
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults =
    searchQuery.trim().length > 0
      ? ALL_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
      : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-brand-green text-white text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span>+001234567890</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span>Get 50% Off on Selected Items</span>
            <span className="opacity-60">|</span>
            <Link
              href="/headphones"
              className="underline underline-offset-2 hover:text-emerald-200 transition"
            >
              Shop Now
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-emerald-200 transition">
              Eng <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-1 hover:text-emerald-200 transition">
              Location <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 transition-transform group-hover:scale-105">
            <ShoppingCart className="h-5 w-5 text-brand-green" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-brand-green">
            Shopcart
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-800">
          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-1 hover:text-brand-green transition"
            >
              Categories
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  catOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {catOpen && (
              <div className="absolute left-0 top-10 w-[440px] rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl animate-popIn">
                <h3 className="mb-3.5 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                  Popular Categories
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {POPULAR_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href="/headphones"
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-3 rounded-xl bg-brand-surface p-2.5 hover:bg-emerald-50/70 transition group"
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cat.bgGradient} text-white text-xs font-bold shadow-sm group-hover:scale-105 transition-transform`}
                      >
                        {cat.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {cat.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cat.itemsAvailable} Item Available
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/headphones" className="hover:text-brand-green transition">
            Deals
          </Link>
          <Link href="/headphones" className="hover:text-brand-green transition">
            What&apos;s New
          </Link>
          <Link href="/checkout" className="hover:text-brand-green transition">
            Delivery
          </Link>
        </nav>

        {/* Search Input + Live Autocomplete */}
        <div ref={searchRef} className="relative flex-1 max-w-sm">
          <div className="flex items-center rounded-full bg-brand-surface px-4 py-2 border border-transparent focus-within:border-brand-green/30 focus-within:bg-white transition">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search Product"
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 outline-none"
            />
            <Search className="h-4 w-4 text-gray-500 shrink-0" />
          </div>

          {searchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-12 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl animate-popIn">
              <div className="space-y-1.5">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSearchFocused(false);
                      setSearchQuery("");
                      router.push(`/product/${product.slug}`);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl p-2 text-left hover:bg-brand-surface transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-surface">
                        <ProductVisual
                          type={product.visualType}
                          color={product.defaultColor}
                          className="h-9 w-9"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-brand-star text-brand-star"
                            />
                          ))}
                          <span className="text-[11px] text-gray-500 ml-1">
                            ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account & Cart */}
        <div className="flex items-center gap-5 shrink-0">
          <Link
            href="/checkout"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-brand-green transition"
          >
            <User className="h-4 w-4" />
            <span>Account</span>
          </Link>
          <Link
            href="/checkout"
            className="relative flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-brand-green transition"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-green px-1.5 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
