"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Field } from "@/components/checkout/forms";
import { useAuth } from "@/context/AuthContext";

const TOPICS = ["Order or delivery", "Returns & refunds", "Payments", "Product question", "Become a seller", "Something else"];

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email ?? "",
    orderId: "",
    topic: TOPICS[0],
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ticket, setTicket] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeUp">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">Contact Us</span>
      </nav>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Contact Us</h1>
      <p className="mt-2 text-sm text-gray-600">
        We usually reply within one business day. For quick answers, try the{" "}
        <Link href="/faq" className="font-semibold text-brand-green underline">Help Center</Link>.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ul className="space-y-4 text-sm text-gray-600">
          {[
            { icon: Phone, label: "Call us", value: "+91 98765 43210" },
            { icon: Mail, label: "Email", value: "support@shopcart.example" },
            { icon: Clock, label: "Hours", value: "Mon–Sat, 9 AM – 8 PM IST" },
            { icon: MapPin, label: "Office", value: "Bengaluru, Karnataka" },
          ].map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-start gap-3 rounded-2xl bg-brand-surface p-4">
              <Icon className="mt-0.5 h-5 w-5 text-brand-orange" />
              <div>
                <p className="font-bold text-gray-900">{label}</p>
                <p>{value}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-2">
          {ticket ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 px-6 py-16 text-center animate-popIn">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <p className="text-xl font-extrabold text-gray-900">Message sent!</p>
              <p className="text-sm text-gray-600">
                Your ticket number is <span className="font-bold text-gray-900">{ticket}</span>. We&apos;ll reply to {form.email}.
              </p>
              <p className="text-[11px] text-gray-400">Demo only: nothing was actually sent.</p>
              <button
                type="button"
                onClick={() => {
                  setTicket(null);
                  setForm((f) => ({ ...f, message: "", orderId: "" }));
                }}
                className="mt-2 rounded-full border border-brand-green px-6 py-2.5 text-sm font-bold text-brand-green hover:bg-brand-surface"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                const errs: Record<string, string> = {};
                if (!form.name.trim()) errs.name = "Required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errs.email = "Enter a valid email";
                if (form.message.trim().length < 10) errs.message = "Please add a little more detail";
                setErrors(errs);
                if (Object.values(errs).some(Boolean)) return;
                setTicket(`SC-T${Math.floor(100000 + Math.random() * 900000)}`);
              }}
              className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 p-6 sm:grid-cols-2"
            >
              <Field id="c-name" label="Your Name" value={form.name} error={errors.name} onChange={set("name")} autoComplete="name" />
              <Field id="c-email" label="Email" type="email" value={form.email} error={errors.email} onChange={set("email")} autoComplete="email" />
              <div>
                <label htmlFor="c-topic" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Topic*
                </label>
                <select
                  id="c-topic"
                  value={form.topic}
                  onChange={(e) => set("topic")(e.target.value)}
                  className="w-full rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30"
                >
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <Field id="c-order" label="Order ID (optional)" required={false} value={form.orderId} onChange={set("orderId")} placeholder="SC-2026-123456" />
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Message*
                </label>
                <textarea
                  id="c-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => set("message")(e.target.value)}
                  aria-invalid={!!errors.message}
                  placeholder="How can we help?"
                  className={`w-full resize-y rounded-lg bg-brand-surface px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green/30 ${
                    errors.message ? "ring-2 ring-rose-400" : ""
                  }`}
                />
                {errors.message && <p className="mt-1 text-xs text-rose-600">{errors.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="rounded-full bg-brand-green px-8 py-3 text-sm font-bold text-white hover:bg-brand-greenHover">
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
