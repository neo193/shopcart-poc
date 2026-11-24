"use client";

import { newProducts } from "@/lib/catalog";
import { ListingPage, PromoBanner } from "@/components/listing/ListingPage";

export default function WhatsNewPage() {
  return (
    <ListingPage
      crumbs={[{ label: "What's New" }]}
      banner={
        <PromoBanner
          title="Fresh Drops, Just Landed"
          subtitle="The newest arrivals across the store, updated every week."
          bg="bg-brand-sky"
          emoji="✨"
        />
      }
      heading={<h2 className="text-2xl font-bold tracking-tight text-gray-900">New Arrivals</h2>}
      products={newProducts()}
    />
  );
}
