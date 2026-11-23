"use client";

import React, { createContext, useContext, useState } from "react";
import { Product, HEADPHONES_PRODUCTS } from "@/data/products";

export interface CartItem {
  product: Product;
  color: string;
  quantity: number;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  checkoutItem: CartItem;
  setCheckoutItem: (item: CartItem) => void;
  addToCart: (product: Product, color?: string, quantity?: number) => void;
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  toastMessage: string | null;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const defaultAirpods = HEADPHONES_PRODUCTS[1]; // Airpods- Max
  const [cart, setCart] = useState<CartItem[]>([
    { product: defaultAirpods, color: "Pink", quantity: 1 },
  ]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [checkoutItem, setCheckoutItem] = useState<CartItem>({
    product: defaultAirpods,
    color: "Pink",
    quantity: 1,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const addToCart = (product: Product, color?: string, quantity = 1) => {
    const selectedColor = color || product.colors[0]?.name || "Default";
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.color === selectedColor
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.color === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, color: selectedColor, quantity }];
    });
    setCheckoutItem({ product, color: selectedColor, quantity });
    showToast(`Added ${product.name} to cart`);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        checkoutItem,
        setCheckoutItem,
        addToCart,
        toggleWishlist,
        cartCount,
        toastMessage,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-brand-green px-5 py-3 text-sm font-medium text-white shadow-xl animate-popIn">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-brand-green text-xs font-bold">
            ✓
          </span>
          {toastMessage}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
