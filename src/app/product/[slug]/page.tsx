import type { Metadata } from "next";
import { getProductBySlug } from "@/data/products";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  return p
    ? { title: `${p.name} — Shopcart`, description: p.shortDesc }
    : { title: "Product not found — Shopcart" };
}

export default function Page() {
  return <ProductClient />;
}
