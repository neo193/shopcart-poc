import Link from "next/link";
import { Truck, ShieldCheck, RotateCcw, HeartHandshake } from "lucide-react";
import { StaticPage, H2 } from "@/components/StaticPage";

export const metadata = { title: "About Us — Shopcart" };

const VALUES = [
  { icon: HeartHandshake, title: "Curated, not crowded", body: "Every product is chosen for quality and value, so you spend less time scrolling." },
  { icon: Truck, title: "Fast, reliable delivery", body: "Standard delivery in 3–5 days and express in 1–2, across India." },
  { icon: RotateCcw, title: "Easy returns", body: "Changed your mind? Return most items free within 30 days." },
  { icon: ShieldCheck, title: "Secure payments", body: "Pay by UPI, card, net banking or cash on delivery." },
];

export default function AboutPage() {
  return (
    <StaticPage
      title="About Shopcart"
      intro="Shopcart is a modern department store that brings together electronics, home, fashion, books and travel essentials in one easy place to shop."
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl bg-brand-surface p-6">
            <Icon className="h-6 w-6 text-brand-orange" />
            <h3 className="mt-3 text-base font-bold text-gray-900">{title}</h3>
            <p className="mt-1">{body}</p>
          </div>
        ))}
      </section>
      <section>
        <H2>Our story</H2>
        <p className="mt-2">
          We started Shopcart to make online shopping feel calm again: fewer, better products, honest
          prices and delivery you can count on. Today we work with trusted brands and independent
          makers to bring their best work to your door.
        </p>
      </section>
      <section>
        <H2>Get in touch</H2>
        <p className="mt-2">
          Questions, feedback or partnership ideas? <Link href="/contact" className="font-semibold text-brand-green underline">Contact us</Link>{" "}
          or visit our <Link href="/faq" className="font-semibold text-brand-green underline">Help Center</Link>.
        </p>
      </section>
    </StaticPage>
  );
}
