import type { Metadata } from "next";
import OrderClient from "./OrderClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${decodeURIComponent(id)} — Shopcart` };
}

export default function Page() {
  return <OrderClient />;
}
