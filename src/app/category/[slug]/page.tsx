import type { Metadata } from "next";
import { getCategory } from "@/lib/catalog";
import CategoryClient from "./CategoryClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  return c
    ? { title: `${c.name} — Shopcart`, description: c.tagline }
    : { title: "Category not found — Shopcart" };
}

export default function Page() {
  return <CategoryClient />;
}
