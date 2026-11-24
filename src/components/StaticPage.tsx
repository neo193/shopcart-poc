import React from "react";
import Link from "next/link";

/** Frame for simple content pages (About, FAQ, Terms...). */
export function StaticPage({
  title,
  intro,
  children,
  placeholder = true,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
  /** Shows a note that the copy is placeholder until the client provides it. */
  placeholder?: boolean;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">{title}</span>
      </nav>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{title}</h1>
      {intro && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{intro}</p>}
      <div className="prose-shop mt-8 space-y-8 text-sm leading-relaxed text-gray-600">{children}</div>
      {placeholder && (
        <p className="mt-12 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500">
          Placeholder content for the proof of concept. Final wording to be provided by the client.
        </p>
      )}
    </div>
  );
}

export function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="scroll-mt-32 text-xl font-bold text-gray-900">
      {children}
    </h2>
  );
}
