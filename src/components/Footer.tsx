import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import { Newsletter } from "./Newsletter";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Shopcart", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
      { label: "Help Center", href: "/faq" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Today's Deals", href: "/deals" },
      { label: "New Arrivals", href: "/new" },
      { label: "Shipping & Delivery", href: "/delivery" },
      { label: "Returns", href: "/delivery#returns" },
      { label: "Track an Order", href: "/account/orders" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex w-fit items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <ShoppingCart className="h-5 w-5 text-brand-green" />
              </div>
              <span className="text-xl font-extrabold text-brand-green">Shopcart</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-600">
              Your everyday department store for electronics, home, fashion, books and travel, delivered
              across India.
            </p>
            <Newsletter />
            <div className="pt-2">
              <p className="mb-2 text-xs font-bold text-gray-900">Accepted Payments</p>
              <div className="flex flex-wrap gap-2">
                {["UPI", "Visa", "Mastercard", "RuPay", "Net Banking", "Cash on Delivery"].map((p) => (
                  <span key={p} className="rounded-md border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold text-gray-900">Department</h2>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="transition hover:text-brand-green">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 text-sm font-bold text-gray-900">{col.title}</h2>
              <ul className="space-y-2.5 text-sm text-gray-600">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition hover:text-brand-green">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-xs text-gray-500 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/contact" className="hover:text-brand-green">Become a Seller</Link>
            <Link href="/faq" className="hover:text-brand-green">Help Center</Link>
            <Link href="/terms" className="hover:text-brand-green">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-brand-green">Privacy Policy</Link>
          </div>
          <span>© 2026 Shopcart. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
