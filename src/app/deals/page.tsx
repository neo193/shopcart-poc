"use client";

import { dealProducts } from "@/lib/catalog";
import { ListingPage, PromoBanner } from "@/components/listing/ListingPage";

export default function DealsPage() {
  return (
    <ListingPage
      crumbs={[{ label: "Deals" }]}
      banner={
        <PromoBanner
          title="Today's Best Deals For You!"
          subtitle="Up to 50% off across every category. Stack with coupon SAVE10 at checkout."
          bg="bg-brand-cream"
          emoji="🏷️"
        />
      }
      heading={<h2 className="text-2xl font-bold tracking-tight text-gray-900">All Deals</h2>}
      products={dealProducts()}
    />
  );
}
