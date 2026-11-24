import Link from "next/link";
import { MapPin, Briefcase } from "lucide-react";
import { StaticPage } from "@/components/StaticPage";

export const metadata = { title: "Careers — Shopcart" };

const ROLES = [
  { title: "Senior Frontend Engineer", team: "Engineering", location: "Bengaluru · Hybrid" },
  { title: "Category Manager, Home & Living", team: "Merchandising", location: "Mumbai" },
  { title: "Customer Support Associate", team: "Customer Experience", location: "Remote, India" },
  { title: "Warehouse Operations Lead", team: "Operations", location: "Gurugram" },
];

export default function CareersPage() {
  return (
    <StaticPage title="Careers" intro="Help us build the calmest way to shop online. We're a small, friendly team that cares about craft.">
      <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200">
        {ROLES.map((r) => (
          <li key={r.title} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="font-bold text-gray-900">{r.title}</p>
              <p className="mt-0.5 flex flex-wrap gap-x-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {r.team}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {r.location}</span>
              </p>
            </div>
            <Link href="/contact" className="rounded-full border border-brand-green px-4 py-1.5 text-xs font-bold text-brand-green hover:bg-brand-green hover:text-white">
              Apply
            </Link>
          </li>
        ))}
      </ul>
    </StaticPage>
  );
}
