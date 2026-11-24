"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  ChevronDown,
  User,
  ShoppingCart,
  Menu,
  X,
  Search,
  Package,
  Check,
  Heart,
  MapPin,
  LogOut,
} from "lucide-react";
import { POPULAR_CATEGORIES } from "@/data/products";
import { CATEGORIES, categoryCount } from "@/lib/catalog";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/pricing";
import { SearchBox } from "./SearchBox";
import { DeliveryCheck } from "./DeliveryCheck";

const NAV_LINKS = [
  { href: "/deals", label: "Deals" },
  { href: "/new", label: "What's New" },
  { href: "/delivery", label: "Delivery" },
];

/** Small click-to-open popover used by the header menus. */
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
  return { open, setOpen, ref };
}

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, openCart, orders, wishlist, showToast } = useStore();
  const { user, signOut } = useAuth();
  const cat = usePopover();
  const lang = usePopover();
  const loc = usePopover();
  const account = usePopover();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close menus whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    cat.setOpen(false);
    account.setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-brand-green text-white text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-emerald-200">
            <Phone className="h-3.5 w-3.5" />
            <span>+91 98765 43210</span>
          </a>
          <div className="hidden items-center gap-2 sm:flex">
            <span>Get 50% Off on Selected Items</span>
            <span className="opacity-60">|</span>
            <Link href="/deals" className="underline underline-offset-2 hover:text-emerald-200 transition">
              Shop Now
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div ref={lang.ref} className="relative">
              <button
                type="button"
                onClick={() => lang.setOpen((o) => !o)}
                aria-expanded={lang.open}
                className="flex items-center gap-1 hover:text-emerald-200 transition"
              >
                Eng <ChevronDown className="h-3 w-3" />
              </button>
              {lang.open && (
                <div className="absolute right-0 top-6 z-50 w-44 rounded-xl border border-gray-100 bg-white p-1.5 text-gray-800 shadow-2xl animate-popIn">
                  <button
                    type="button"
                    onClick={() => lang.setOpen(false)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold hover:bg-brand-surface"
                  >
                    English <Check className="h-3.5 w-3.5 text-brand-green" />
                  </button>
                  {["ಕನ್ನಡ", "हिन्दी"].map((l) => (
                    <span key={l} className="flex items-center justify-between px-3 py-2 text-xs text-gray-400">
                      {l} <span className="text-[10px]">Soon</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div ref={loc.ref} className="relative">
              <button
                type="button"
                onClick={() => loc.setOpen((o) => !o)}
                aria-expanded={loc.open}
                className="flex items-center gap-1 hover:text-emerald-200 transition"
              >
                Location <ChevronDown className="h-3 w-3" />
              </button>
              {loc.open && (
                <div className="absolute right-0 top-6 z-50 w-72 rounded-xl border border-gray-100 bg-white p-4 text-gray-800 shadow-2xl animate-popIn">
                  <p className="text-sm font-bold">Deliver to</p>
                  <p className="text-xs text-gray-500">Check delivery dates for your area.</p>
                  <DeliveryCheck />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="-ml-2 rounded-lg p-2 text-gray-800 hover:bg-brand-surface lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 transition-transform group-hover:scale-105">
              <ShoppingCart className="h-5 w-5 text-brand-green" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-brand-green">Shopcart</span>
          </Link>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-800 lg:flex">
          <div ref={cat.ref} className="relative">
            <button
              type="button"
              onClick={() => cat.setOpen((o) => !o)}
              aria-expanded={cat.open}
              className={`flex items-center gap-1 transition hover:text-brand-green ${
                pathname.startsWith("/category") ? "text-brand-green" : ""
              }`}
            >
              Categories
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${cat.open ? "rotate-180" : ""}`} />
            </button>

            {cat.open && (
              <div className="absolute left-0 top-10 w-[440px] rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl animate-popIn">
                <div className="mb-3.5 flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <h3 className="text-sm font-bold text-gray-900">Popular Categories</h3>
                  <Link href="/categories" className="text-xs font-semibold text-brand-green hover:underline">
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {POPULAR_CATEGORIES.map((c) => {
                    const n = categoryCount(c.slug);
                    return (
                      <Link
                        key={c.id}
                        href={`/category/${c.slug}`}
                        className="group flex items-center gap-3 rounded-xl bg-brand-surface p-2.5 transition hover:bg-emerald-50/70"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${c.bgGradient} text-xl shadow-sm transition-transform group-hover:scale-105`}
                        >
                          {CATEGORIES.find((x) => x.slug === c.slug)?.emoji}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-500">
                            {n} Item{n === 1 ? "" : "s"} Available
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition hover:text-brand-green ${isActive(l.href) ? "text-brand-green" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hidden max-w-sm flex-1 md:block">
          <Suspense fallback={<SearchFallback />}>
            <SearchBox id="search-desktop" />
          </Suspense>
        </div>

        {/* Account & Cart */}
        <div className="flex shrink-0 items-center gap-5">
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlist.length} item${wishlist.length === 1 ? "" : "s"}`}
            className="relative hidden text-gray-800 transition hover:text-brand-green sm:block"
          >
            <Heart className="h-4 w-4" />
            {wishlist.length > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <div ref={account.ref} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => account.setOpen((o) => !o)}
              aria-expanded={account.open}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-800 transition hover:text-brand-green"
            >
              {user ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </span>
              ) : (
                <User className="h-4 w-4" />
              )}
              <span>{user ? `Hi, ${user.firstName}` : "Account"}</span>
            </button>
            {account.open && (
              <div className="absolute right-0 top-9 z-50 w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl animate-popIn">
                {user ? (
                  <>
                    <p className="text-sm font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                    <ul className="mt-3 space-y-0.5 border-t border-gray-100 pt-3 text-sm">
                      {[
                        { href: "/account", label: "My Profile", icon: User },
                        { href: "/account/orders", label: "My Orders", icon: Package },
                        { href: "/account/addresses", label: "Saved Addresses", icon: MapPin },
                        { href: "/wishlist", label: "Wishlist", icon: Heart },
                      ].map(({ href, label, icon: Icon }) => (
                        <li key={href}>
                          <Link href={href} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-gray-700 hover:bg-brand-surface">
                            <Icon className="h-4 w-4 text-brand-green" /> {label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            signOut();
                            account.setOpen(false);
                            showToast("Signed out");
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-gray-900">Welcome to Shopcart</p>
                    <p className="mt-0.5 text-xs text-gray-500">Sign in to track orders and check out faster.</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="rounded-full bg-brand-green py-2 text-center text-xs font-bold text-white hover:bg-brand-greenHover">
                        Sign In
                      </Link>
                      <Link href={`/signup?next=${encodeURIComponent(pathname)}`} className="rounded-full border border-brand-green py-2 text-center text-xs font-bold text-brand-green hover:bg-brand-surface">
                        Create Account
                      </Link>
                    </div>
                    {orders.length > 0 && (
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Recent orders</p>
                        <ul className="space-y-1">
                          {orders.slice(0, 3).map((o) => (
                            <li key={o.id}>
                              <Link
                                href={`/order/${o.id}`}
                                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-brand-surface"
                              >
                                <span className="flex items-center gap-1.5 font-semibold text-gray-800">
                                  <Package className="h-3.5 w-3.5 text-brand-green" />
                                  {o.id}
                                </span>
                                <span className="text-gray-500">{formatPrice(o.totals.total)}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative flex items-center gap-1.5 text-sm font-medium text-gray-800 transition hover:text-brand-green"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-green px-1.5 text-[11px] font-bold text-white animate-popIn"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="px-4 pb-3 md:hidden">
        <Suspense fallback={<SearchFallback />}>
          <SearchBox id="search-mobile" />
        </Suspense>
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`fixed inset-0 z-50 transition-[visibility] duration-300 lg:hidden ${
          mobileOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        <nav
          aria-label="Main menu"
          className={`absolute left-0 top-0 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <span className="text-lg font-extrabold text-brand-green">Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2 text-gray-600 hover:bg-brand-surface"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block rounded-xl px-3 py-3 text-sm font-semibold transition hover:bg-brand-surface ${
                  isActive(l.href) ? "text-brand-green" : "text-gray-900"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={user ? "/account" : "/login"}
              className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-semibold text-gray-900 hover:bg-brand-surface"
            >
              <User className="h-4 w-4 text-brand-green" /> {user ? `My Account (${user.firstName})` : "Sign in / Create account"}
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-semibold text-gray-900 hover:bg-brand-surface"
            >
              <Heart className="h-4 w-4 text-brand-green" /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
            <p className="mt-4 px-3 pb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Categories</p>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-brand-surface ${
                  pathname === `/category/${c.slug}` ? "font-semibold text-brand-green" : "text-gray-800"
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {c.emoji}
                </span>
                {c.name}
                <span className="ml-auto text-xs text-gray-400">{categoryCount(c.slug)}</span>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-gray-100 p-4">
            <Link
              href="/search"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300 py-2.5 text-sm font-semibold text-gray-800"
            >
              <Search className="h-4 w-4" /> Search
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openCart();
              }}
              className="flex items-center justify-center gap-2 rounded-full bg-brand-green py-2.5 text-sm font-semibold text-white"
            >
              <ShoppingCart className="h-4 w-4" /> Cart ({cartCount})
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function SearchFallback() {
  return <div className="h-9 w-full rounded-full bg-brand-surface" />;
}
