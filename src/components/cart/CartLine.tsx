"use client";

import Link from "next/link";
import { Trash2, Bookmark } from "lucide-react";
import { CartItem, formatPrice, getStock, lineId } from "@/lib/pricing";
import { useStore } from "@/context/StoreContext";
import { ProductVisual } from "@/components/ProductVisual";
import { QuantityStepper } from "./QuantityStepper";

export function CartItemThumb({
  item,
  size = "md",
}: {
  item: CartItem;
  size?: "sm" | "md" | "lg";
}) {
  const color =
    item.product.colors.find((c) => c.name === item.color) ||
    item.product.colors[0];
  const box =
    size === "sm" ? "h-14 w-14" : size === "lg" ? "h-28 w-28" : "h-20 w-20";
  const img =
    size === "sm" ? "h-11 w-11" : size === "lg" ? "h-24 w-24" : "h-16 w-16";
  return (
    <div
      className={`flex ${box} shrink-0 items-center justify-center rounded-xl bg-brand-surface`}
    >
      <ProductVisual
        type={item.product.visualType}
        emoji={item.product.emoji}
        color={color?.hex || item.product.defaultColor}
        secondaryColor={color?.secondaryHex || "#E5E7EB"}
        className={img}
      />
    </div>
  );
}

export function CartLine({
  item,
  compact = false,
  onNavigate,
}: {
  item: CartItem;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { updateQuantity, removeFromCart, saveForLater } = useStore();
  const id = lineId(item);
  const stock = getStock(item.product);
  const lowStock = stock - item.quantity <= 3;

  return (
    <div className="flex gap-4 py-4">
      <Link href={`/product/${item.product.slug}`} onClick={onNavigate}>
        <CartItemThumb item={item} size={compact ? "md" : "lg"} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${item.product.slug}`}
              onClick={onNavigate}
              className="block truncate text-sm font-bold text-gray-900 hover:text-brand-green"
            >
              {item.product.name}
            </Link>
            <p className="mt-0.5 text-xs text-gray-500">
              Color: {item.color}
              {!compact && <> · {formatPrice(item.product.price)} each</>}
            </p>
            {lowStock && (
              <p className="mt-0.5 text-[11px] font-semibold text-brand-orange">
                Only {stock} left in stock
              </p>
            )}
          </div>
          <p className="shrink-0 text-sm font-bold text-gray-900">
            {formatPrice(item.product.price * item.quantity)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            max={stock}
            onChange={(q) => updateQuantity(id, q)}
          />
          <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
            <button
              type="button"
              onClick={() => saveForLater(id)}
              className="flex items-center gap-1 hover:text-brand-green transition"
            >
              <Bookmark className="h-3.5 w-3.5" />
              {compact ? "Save" : "Save for later"}
            </button>
            <button
              type="button"
              onClick={() => removeFromCart(id)}
              className="flex items-center gap-1 hover:text-rose-600 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
