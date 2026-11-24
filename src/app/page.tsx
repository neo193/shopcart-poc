"use client";

import React from "react";
import Link from "next/link";
import {
  TOP_CATEGORIES,
  WEEKLY_POPULAR_PRODUCTS,
} from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { dealProducts } from "@/lib/catalog";
import { ProductVisual } from "@/components/ProductVisual";
import { HelpCircle, CreditCard, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#D5EEF9] via-[#E1F3FB] to-[#CEECF8]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="z-10 space-y-6 animate-fadeUp">
            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-brand-green sm:text-5xl lg:text-[54px]">
              Shopping And
              <br />
              Department Store.
            </h1>
            <p className="max-w-md text-base text-gray-700 leading-relaxed">
              Electronics, home, fashion, books and travel essentials in one
              place, with free delivery on orders over ₹999.
            </p>
            <div>
              <Link
                href="/deals"
                className="inline-flex items-center justify-center rounded-full bg-brand-green px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-greenHover hover:shadow-lg active:scale-95"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* 3D Golden Pedestal Showcase */}
          <div className="relative flex h-[300px] sm:h-[340px] items-end justify-center gap-4">
            {/* Left Pedestal */}
            <div className="relative flex flex-col items-center animate-fadeUp">
              <div className="mb-[-12px] z-10 transition-transform duration-300 hover:-translate-y-2">
                <ProductVisual
                  type="earbuds-case"
                  color="#1F2937"
                  secondaryColor="#60A5FA"
                  className="h-24 w-24 sm:h-28 sm:w-28"
                />
              </div>
              <div className="h-20 w-28 sm:w-36 rounded-t-lg bg-gradient-to-b from-[#F9D058] to-[#E5B32E] shadow-xl border-t-4 border-[#FFE484]" />
            </div>

            {/* Center Tall Pedestal */}
            <div className="relative flex flex-col items-center animate-fadeUp">
              <div className="mb-[-14px] z-10 transition-transform duration-300 hover:-translate-y-2">
                <ProductVisual
                  type="over-ear"
                  color="#E6877F"
                  secondaryColor="#F5C6C2"
                  className="h-32 w-32 sm:h-40 sm:w-40"
                />
              </div>
              <div className="h-36 w-36 sm:w-44 rounded-t-lg bg-gradient-to-b from-[#FAD663] to-[#E5B32E] shadow-2xl border-t-4 border-[#FFE899]" />
            </div>

            {/* Right Pedestal */}
            <div className="relative flex flex-col items-center animate-fadeUp">
              <div className="mb-[-12px] z-10 transition-transform duration-300 hover:-translate-y-2">
                <ProductVisual
                  type="smart-speaker"
                  color="#F97316"
                  secondaryColor="#FDBA74"
                  className="h-24 w-24 sm:h-28 sm:w-28"
                />
              </div>
              <div className="h-28 w-28 sm:w-36 rounded-t-lg bg-gradient-to-b from-[#F9D058] to-[#E5B32E] shadow-xl border-t-4 border-[#FFE484]" />
            </div>
          </div>
        </div>
      </section>

      {/* Shop Our Top Categories */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Shop Our Top Categories
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {TOP_CATEGORIES.map((cat) => (
            // White card with just the emoji; hovering (or keyboard focus) fades in
            // the category colour and name. Touch screens can't hover, so there
            // the colour and name are always shown.
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              aria-label={cat.name}
              className="group relative flex h-56 flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl focus-visible:-translate-y-1"
            >
              <span
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-b ${cat.bgGradient} transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:hover)]:opacity-0`}
              />
              <h3 className="relative text-center text-lg font-bold tracking-tight transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:hover)]:-translate-y-1 [@media(hover:hover)]:opacity-0">
                {cat.name}
              </h3>
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-white/15 transition-transform duration-300 group-hover:scale-110">
                <span className="text-3xl font-extrabold opacity-90">
                  {cat.name === "Furniture" && "🛋️"}
                  {cat.name === "Hand Bag" && "👜"}
                  {cat.name === "Books" && "📚"}
                  {cat.name === "Tech" && "💻"}
                  {cat.name === "Sneakers" && "👟"}
                  {cat.name === "Travel" && "🧳"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Best Deals / Headphones Preview */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Todays Best Deals For You!
          </h2>
          <Link
            href="/deals"
            className="text-sm font-semibold text-brand-green hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dealProducts()
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, 4)
            .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Weekly Popular Products */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Weekly Popular Products
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WEEKLY_POPULAR_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Services To Help You Shop */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Services To Help You Shop
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Frequently Asked Questions",
              subtitle: "Quick answers on orders, delivery, payments and returns",
              href: "/faq",
              icon: HelpCircle,
              accent: "bg-amber-100 text-amber-800",
            },
            {
              title: "Online Payment Process",
              subtitle: "Pay securely by UPI, card, net banking or cash on delivery",
              href: "/faq#payments",
              icon: CreditCard,
              accent: "bg-emerald-100 text-brand-green",
            },
            {
              title: "Home Delivery Options",
              subtitle: "Standard and express delivery, free over ₹999",
              href: "/delivery",
              icon: Truck,
              accent: "bg-sky-100 text-sky-800",
            },
          ].map((svc) => {
            const Icon = svc.icon;
            return (
              <Link
                key={svc.title}
                href={svc.href}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-brand-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="p-7">
                  <h3 className="max-w-[200px] text-xl font-bold leading-snug text-gray-900">
                    {svc.title}
                  </h3>
                  <p className="mt-2.5 max-w-[210px] text-xs font-medium text-gray-600 leading-relaxed">
                    {svc.subtitle}
                  </p>
                </div>
                <div className="flex h-44 items-center justify-center bg-gradient-to-tr from-gray-200/70 to-gray-100 px-6">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl ${svc.accent} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-10 w-10" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RecentlyViewed title="Pick Up Where You Left Off" />
      </div>
    </div>
  );
}
