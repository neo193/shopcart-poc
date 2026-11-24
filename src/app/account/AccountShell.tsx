"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";

const LINKS = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, user, signOut } = useAuth();
  const { showToast } = useStore();

  useEffect(() => {
    if (hydrated && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [hydrated, user, pathname, router]);

  if (!hydrated || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-64 rounded-2xl skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">My Account</span>
      </nav>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="rounded-2xl bg-brand-surface p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-lg font-bold text-white">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
          <nav aria-label="Account" className="mt-4 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active ? "bg-brand-green text-white" : "text-gray-700 hover:bg-brand-surface"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                signOut();
                showToast("Signed out");
                router.push("/");
              }}
              className="flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-gray-500 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>
        <section className="lg:col-span-9 animate-fadeUp">{children}</section>
      </div>
    </div>
  );
}
