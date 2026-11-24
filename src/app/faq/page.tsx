import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { StaticPage, H2 } from "@/components/StaticPage";

export const metadata = { title: "Help Center & FAQ — Shopcart" };

const SECTIONS: { id: string; title: string; items: { q: string; a: ReactNode }[] }[] = [
  {
    id: "orders",
    title: "Orders & Delivery",
    items: [
      { q: "How long does delivery take?", a: <>Standard delivery takes 3–5 business days and is free on orders over ₹999. Express delivery takes 1–2 business days for ₹149. See <Link href="/delivery" className="text-brand-green underline">Delivery &amp; Returns</Link>.</> },
      { q: "How do I track my order?", a: <>Open <Link href="/account/orders" className="text-brand-green underline">My Orders</Link> and choose &ldquo;View &amp; Track&rdquo;. You&apos;ll also get updates by email and SMS.</> },
      { q: "Can I change my delivery address after ordering?", a: "You can change it until the order is packed. Contact us with your order ID and we'll update it." },
      { q: "Do you deliver to my PIN code?", a: "Enter your PIN code on any product page or in the Location menu at the top of the site to see delivery dates." },
    ],
  },
  {
    id: "payments",
    title: "Payments & Offers",
    items: [
      { q: "Which payment methods do you accept?", a: "UPI, credit and debit cards (Visa, Mastercard, RuPay), net banking and cash on delivery." },
      { q: "Are prices inclusive of GST?", a: "Yes. All prices include GST, and your invoice shows the GST amount separately." },
      { q: "How do I use a coupon code?", a: "Enter the code in the Order Summary on the cart or checkout page, or choose one from \"View available offers\". One coupon can be used per order." },
      { q: "Is it safe to pay online?", a: "Payments are processed by a PCI-DSS compliant payment gateway. We never store your full card details." },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "Most items can be returned free of charge within 30 days of delivery, unused and in original packaging." },
      { q: "When will I get my refund?", a: "Refunds go back to your original payment method within 5–7 business days of the return pickup. Cash on delivery orders are refunded to your bank account or as store credit." },
    ],
  },
  {
    id: "account",
    title: "Your Account",
    items: [
      { q: "Do I need an account to order?", a: "No, you can check out as a guest. An account lets you save addresses, see order history and keep a wishlist." },
      { q: "How do I update my saved addresses?", a: <>Go to <Link href="/account/addresses" className="text-brand-green underline">Saved Addresses</Link> in your account to add, edit or remove addresses.</> },
    ],
  },
];

export default function FaqPage() {
  return (
    <StaticPage title="Help Center" intro="Answers to the questions we hear most. Can't find what you need? Contact our support team.">
      <nav aria-label="FAQ sections" className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-full bg-brand-surface px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-200">
            {s.title}
          </a>
        ))}
      </nav>
      {SECTIONS.map((s) => (
        <section key={s.id}>
          <H2 id={s.id}>{s.title}</H2>
          <div className="mt-3 divide-y divide-gray-100 rounded-2xl border border-gray-200">
            {s.items.map((it) => (
              <details key={it.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                  {it.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2">{it.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <section className="rounded-2xl bg-brand-surface p-6 text-center">
        <p className="font-bold text-gray-900">Still need help?</p>
        <Link href="/contact" className="mt-3 inline-block rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-greenHover">
          Contact Support
        </Link>
      </section>
    </StaticPage>
  );
}
