import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <ShoppingCart className="h-5 w-5 text-brand-green" />
              </div>
              <span className="text-xl font-extrabold text-brand-green">
                Shopcart
              </span>
            </Link>
            <p className="max-w-xs text-sm text-gray-600 leading-relaxed">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-900 mb-2">
                Accepted Payments
              </p>
              <div className="flex flex-wrap gap-2">
                {["Stripe", "Visa", "Mastercard", "Amazon Pay", "PayPal"].map(
                  (p) => (
                    <span
                      key={p}
                      className="rounded-md border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700"
                    >
                      {p}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">Department</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {["Fashion", "Education Product", "Frozen Food", "Beverages", "Electronics & Gadget"].map(
                (item) => (
                  <li key={item}>
                    <Link href="/headphones" className="hover:text-brand-green transition">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">About Us</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {["About Shopcart", "Careers", "News & Blog", "Help", "Press Center"].map(
                (item) => (
                  <li key={item}>
                    <Link href="/" className="hover:text-brand-green transition">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {["Gift Card", "Mobile App", "Shipping & Delivery", "Order Pickup", "Account Signup"].map(
                (item) => (
                  <li key={item}>
                    <Link href="/checkout" className="hover:text-brand-green transition">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-xs text-gray-500 sm:flex-row">
          <div className="flex items-center gap-6">
            <span>Become Seller</span>
            <span>Gift Cards</span>
            <span>Help Center</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Terms of Service</span>
            <span>Privacy &amp; Policy</span>
            <span>All Right reserved by Shopcart | 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
