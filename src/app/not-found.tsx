import Link from "next/link";

export const metadata = { title: "Page not found — Shopcart" };

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center animate-fadeUp">
      <p className="text-7xl font-extrabold tracking-tight text-brand-green">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-gray-900">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-sm text-gray-500">
        The product or page you&apos;re looking for may have moved or no longer exists.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand-green px-7 py-3 text-sm font-semibold text-white hover:bg-brand-greenHover transition"
        >
          Back to Home
        </Link>
        <Link
          href="/deals"
          className="rounded-full border border-brand-green px-7 py-3 text-sm font-semibold text-brand-green hover:bg-brand-surface transition"
        >
          Browse Deals
        </Link>
      </div>
    </div>
  );
}
