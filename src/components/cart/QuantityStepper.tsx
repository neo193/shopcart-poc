"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  max,
  onChange,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "gap-3 px-3 py-1.5" : "gap-5 px-4 py-2.5";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className={`inline-flex items-center rounded-full bg-brand-surface ${pad}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="text-gray-700 hover:text-brand-green transition disabled:opacity-30 disabled:hover:text-gray-700"
        aria-label="Decrease quantity"
      >
        <Minus className={icon} />
      </button>
      <span
        className="min-w-[1.25rem] text-center text-sm font-bold text-brand-green"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="text-gray-700 hover:text-brand-green transition disabled:opacity-30 disabled:hover:text-gray-700"
        aria-label="Increase quantity"
        title={value >= max ? `Only ${max} in stock` : undefined}
      >
        <Plus className={icon} />
      </button>
    </div>
  );
}
