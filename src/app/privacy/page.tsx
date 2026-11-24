import Link from "next/link";
import { StaticPage, H2 } from "@/components/StaticPage";

export const metadata = { title: "Privacy Policy — Shopcart" };

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" intro="Last updated: November 2026. This policy explains what we collect, why, and the choices you have.">
      <section>
        <H2>What we collect</H2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Account details: name, email and mobile number.</li>
          <li>Delivery addresses you save or use at checkout.</li>
          <li>Order history and payment status. Card details are handled by our payment partner and never stored by us.</li>
          <li>Basic usage data, such as pages visited, to improve the store.</li>
        </ul>
      </section>
      <section>
        <H2>How we use it</H2>
        <p className="mt-2">To process and deliver orders, provide support, prevent fraud, and, if you opt in, send offers. We do not sell your personal data.</p>
      </section>
      <section>
        <H2>Cookies</H2>
        <p className="mt-2">We use essential cookies to keep your cart and sign-in working. Optional analytics cookies are only used if you accept them in the cookie banner.</p>
      </section>
      <section>
        <H2>Your choices</H2>
        <p className="mt-2">You can update your details in <Link href="/account" className="text-brand-green underline">My Account</Link>, unsubscribe from emails at any time, or <Link href="/contact" className="text-brand-green underline">contact us</Link> to request a copy or deletion of your data.</p>
      </section>
      <section className="rounded-xl bg-brand-surface p-4">
        <p className="text-xs">
          <span className="font-semibold text-gray-900">About this demo:</span> in this proof of concept, your cart, account,
          addresses, orders and reviews are stored only in your own browser and are never sent to a server.
        </p>
      </section>
    </StaticPage>
  );
}
