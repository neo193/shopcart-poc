import Link from "next/link";
import { StaticPage, H2 } from "@/components/StaticPage";

export const metadata = { title: "Terms of Service — Shopcart" };

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service" intro="Last updated: November 2026. These terms govern your use of Shopcart and any purchase you make.">
      <section>
        <H2>1. Using Shopcart</H2>
        <p className="mt-2">You must be at least 18 years old, or use the site under a guardian&apos;s supervision. You&apos;re responsible for keeping your account details secure.</p>
      </section>
      <section>
        <H2>2. Orders and pricing</H2>
        <p className="mt-2">All prices are in Indian Rupees and include GST. An order is confirmed once payment succeeds (or, for Cash on Delivery, once we accept it). We may cancel an order if an item is out of stock or mispriced, and will refund any amount paid.</p>
      </section>
      <section>
        <H2>3. Coupons and offers</H2>
        <p className="mt-2">Coupons have their own conditions such as minimum order value, eligible categories and expiry dates. One coupon can be applied per order and coupons have no cash value.</p>
      </section>
      <section>
        <H2>4. Delivery, returns and refunds</H2>
        <p className="mt-2">Delivery timelines and our 30-day return policy are described on the <Link href="/delivery" className="text-brand-green underline">Delivery &amp; Returns</Link> page.</p>
      </section>
      <section>
        <H2>5. Contact</H2>
        <p className="mt-2">Questions about these terms? <Link href="/contact" className="text-brand-green underline">Contact us</Link>.</p>
      </section>
    </StaticPage>
  );
}
