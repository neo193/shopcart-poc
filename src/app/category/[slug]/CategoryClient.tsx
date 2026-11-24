"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { getCategory, productsInCategory, CATEGORIES } from "@/lib/catalog";
import { ListingPage, PromoBanner } from "@/components/listing/ListingPage";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategory(slug);
  if (!category) notFound();

  const products = productsInCategory(category.slug);

  return (
    <ListingPage
      crumbs={[{ label: "Categories", href: "/categories" }, { label: category.name }]}
      banner={
        <PromoBanner
          title={category.bannerTitle}
          subtitle={category.tagline}
          bg={category.bannerBg}
          emoji={category.emoji}
          cta={{ label: "See Today's Deals", href: "/deals" }}
        />
      }
      heading={
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {category.name} For You!
        </h2>
      }
      products={products}
      emptyState={
        <div className="rounded-2xl bg-brand-surface px-6 py-16 text-center">
          <p className="text-lg font-bold text-gray-900">New {category.name} arriving soon</p>
          <p className="mt-1 text-sm text-gray-500">Meanwhile, explore our other categories.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-100"
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>
      }
    />
  );
}
