import Link from "next/link";
import { CATEGORIES, categoryCount } from "@/lib/catalog";
import { TOP_CATEGORIES } from "@/data/products";

export const metadata = { title: "All Categories — Shopcart" };

export default function CategoriesPage() {
  const gradient = (slug: string) =>
    TOP_CATEGORIES.find((c) => c.slug === slug)?.bgGradient ?? "from-[#1B3A2F] to-[#2F614E]";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Categories</span>
      </nav>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shop by Category</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c) => {
          const n = categoryCount(c.slug);
          return (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`group flex h-56 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-b ${gradient(c.slug)} p-5 text-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="text-center">
                <h2 className="text-lg font-bold tracking-tight">{c.name}</h2>
                <p className="mt-0.5 text-xs opacity-80">
                  {n} item{n === 1 ? "" : "s"}
                </p>
              </div>
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-white/15 text-5xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <span aria-hidden>{c.emoji}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
