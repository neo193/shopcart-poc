import React from "react";
import { Product } from "@/data/products";

interface ProductVisualProps {
  type: Product["visualType"];
  color?: string;
  secondaryColor?: string;
  className?: string;
}

export function ProductVisual({
  type,
  color = "#E6877F",
  secondaryColor = "#F5C6C2",
  className = "w-36 h-36",
}: ProductVisualProps) {
  if (type === "over-ear" || type === "gaming-headset") {
    const isGaming = type === "gaming-headset";
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Soft studio drop shadow */}
        <ellipse cx="100" cy="182" rx="48" ry="7" fill="rgba(0,0,0,0.08)" />
        {/* Headband */}
        <path
          d="M42 108C42 58 67 28 100 28C133 28 158 58 158 108"
          stroke={secondaryColor}
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M46 105C46 60 69 33 100 33C131 33 154 60 154 105"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Metal stems */}
        <rect x="41" y="96" width="6" height="22" rx="3" fill="#CBD5E1" />
        <rect x="153" y="96" width="6" height="22" rx="3" fill="#CBD5E1" />
        {/* Left Earcup */}
        <rect x="26" y="106" width="32" height="58" rx="16" fill={color} />
        <rect x="52" y="110" width="12" height="50" rx="6" fill={secondaryColor} />
        <ellipse cx="42" cy="135" rx="8" ry="18" fill="rgba(255,255,255,0.16)" />
        {/* Right Earcup */}
        <rect x="142" y="106" width="32" height="58" rx="16" fill={color} />
        <rect x="136" y="110" width="12" height="50" rx="6" fill={secondaryColor} />
        <ellipse cx="158" cy="135" rx="8" ry="18" fill="rgba(255,255,255,0.16)" />
        {/* Optional Gaming Mic */}
        {isGaming && (
          <path
            d="M42 156C46 172 68 176 90 172"
            stroke="#1F2937"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  }

  if (type === "earbuds-case") {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <ellipse cx="100" cy="176" rx="52" ry="7" fill="rgba(0,0,0,0.08)" />
        {/* Charging Case */}
        <rect x="50" y="64" width="100" height="96" rx="28" fill={color} />
        <rect x="56" y="68" width="88" height="36" rx="18" fill={secondaryColor} opacity="0.35" />
        <line x1="52" y1="108" x2="148" y2="108" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        {/* Earbud Left */}
        <circle cx="80" cy="82" r="14" fill="#F8FAFC" />
        <rect x="75" y="90" width="8" height="22" rx="4" fill="#E2E8F0" />
        {/* Earbud Right */}
        <circle cx="120" cy="82" r="14" fill="#F8FAFC" />
        <rect x="117" y="90" width="8" height="22" rx="4" fill="#E2E8F0" />
        {/* LED indicator */}
        <circle cx="100" cy="132" r="3.5" fill="#22C55E" />
      </svg>
    );
  }

  if (type === "neckband") {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <ellipse cx="100" cy="175" rx="46" ry="7" fill="rgba(0,0,0,0.08)" />
        <path
          d="M52 142C36 114 42 52 100 52C158 52 164 114 148 142"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <circle cx="58" cy="150" r="11" fill={secondaryColor} />
        <circle cx="142" cy="150" r="11" fill={secondaryColor} />
      </svg>
    );
  }

  if (type === "laptop") {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <ellipse cx="100" cy="166" rx="64" ry="7" fill="rgba(0,0,0,0.08)" />
        {/* Screen */}
        <rect x="34" y="46" width="132" height="86" rx="8" fill="#1E293B" />
        <rect x="40" y="52" width="120" height="74" rx="4" fill="url(#laptopGrad)" />
        {/* Base */}
        <path d="M22 136H178L170 152H30L22 136Z" fill={color} />
        <rect x="82" y="138" width="36" height="4" rx="2" fill="#94A3B8" />
        <defs>
          <linearGradient id="laptopGrad" x1="40" y1="52" x2="160" y2="126">
            <stop stopColor="#C084FC" />
            <stop offset="0.5" stopColor="#F472B6" />
            <stop offset="1" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === "smart-speaker") {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <ellipse cx="100" cy="168" rx="44" ry="7" fill="rgba(0,0,0,0.08)" />
        <circle cx="100" cy="105" r="56" fill={color} />
        <ellipse cx="100" cy="64" rx="28" ry="12" fill="#F8FAFC" opacity="0.9" />
        <circle cx="100" cy="105" r="54" stroke={secondaryColor} strokeWidth="3" opacity="0.5" />
      </svg>
    );
  }

  // laptop-sleeve
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="100" cy="166" rx="60" ry="7" fill="rgba(0,0,0,0.08)" />
      <rect x="34" y="58" width="132" height="92" rx="10" fill={color} />
      <path d="M34 72L100 106L166 72V58H34V72Z" fill={secondaryColor} opacity="0.7" />
      <rect x="52" y="64" width="96" height="8" rx="4" fill="#94A3B8" opacity="0.5" />
    </svg>
  );
}
