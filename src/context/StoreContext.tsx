"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product, getProductBySlug } from "@/data/products";
import { evaluateCoupon, CouponResult } from "@/data/coupons";
import { CartItem, getStock, lineId } from "@/lib/pricing";
import { Order } from "@/lib/orders";

export type { CartItem } from "@/lib/pricing";

/**
 * Client-only store for the POC. Everything persists to localStorage so the
 * demo survives refreshes. When Supabase is added, swap the load/save
 * functions for API calls; the component-facing API can stay the same.
 */

const STORAGE_KEY = "shopcart:v1";

interface StoredLine {
  productId: string;
  color: string;
  quantity: number;
}

interface StoredState {
  cart: StoredLine[];
  saved: StoredLine[];
  wishlist: string[];
  couponCode: string | null;
  orders: Order[];
}

function toStored(items: CartItem[]): StoredLine[] {
  return items.map((i) => ({
    productId: i.product.id,
    color: i.color,
    quantity: i.quantity,
  }));
}

function fromStored(lines: StoredLine[] | undefined): CartItem[] {
  if (!Array.isArray(lines)) return [];
  return lines.flatMap((l) => {
    const product = getProductBySlug(l.productId);
    if (!product) return [];
    const quantity = Math.min(Math.max(1, l.quantity | 0), getStock(product));
    const color = product.colors.some((c) => c.name === l.color)
      ? l.color
      : product.colors[0]?.name || "Default";
    return [{ product, color, quantity }];
  });
}

interface Toast {
  id: number;
  message: string;
  showCartLink?: boolean;
}

interface StoreContextValue {
  hydrated: boolean;
  cart: CartItem[];
  savedForLater: CartItem[];
  wishlist: string[];
  orders: Order[];
  cartCount: number;

  addToCart: (
    product: Product,
    color?: string,
    quantity?: number,
    opts?: { openDrawer?: boolean }
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeSaved: (id: string) => void;

  couponCode: string | null;
  applyCoupon: (code: string, items?: CartItem[]) => CouponResult;
  removeCoupon: () => void;

  buyNowItem: CartItem | null;
  setBuyNowItem: (item: CartItem | null) => void;

  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  addOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;

  toggleWishlist: (productId: string) => void;
  showToast: (message: string, showCartLink?: boolean) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSaved] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Load once on the client.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<StoredState>;
        setCart(fromStored(s.cart));
        setSaved(fromStored(s.saved));
        setWishlist(Array.isArray(s.wishlist) ? s.wishlist : []);
        setCouponCode(s.couponCode ?? null);
        setOrders(Array.isArray(s.orders) ? s.orders : []);
      }
    } catch {
      // Corrupt or blocked storage: start empty.
    }
    setHydrated(true);
  }, []);

  // Save on every change after loading.
  useEffect(() => {
    if (!hydrated) return;
    const s: StoredState = {
      cart: toStored(cart),
      saved: toStored(savedForLater),
      wishlist,
      couponCode,
      orders,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      // Ignore quota/private-mode errors.
    }
  }, [hydrated, cart, savedForLater, wishlist, couponCode, orders]);

  const showToast = useCallback((message: string, showCartLink = false) => {
    const id = Date.now();
    setToast({ id, message, showCartLink });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3000);
  }, []);

  const addToCart: StoreContextValue["addToCart"] = (
    product,
    color,
    quantity = 1,
    opts
  ) => {
    const selectedColor = color || product.colors[0]?.name || "Default";
    const stock = getStock(product);
    const id = lineId({ product, color: selectedColor });
    const existing = cart.find((i) => lineId(i) === id);
    const current = existing?.quantity ?? 0;
    const next = Math.min(stock, current + quantity);

    if (next === current) {
      showToast(`Only ${stock} of ${product.name} in stock. You already have them all.`);
      return;
    }

    setCart((prev) =>
      existing
        ? prev.map((i) => (lineId(i) === id ? { ...i, quantity: next } : i))
        : [...prev, { product, color: selectedColor, quantity: next }]
    );

    if (opts?.openDrawer) setCartOpen(true);
    else if (next - current < quantity)
      showToast(`Only ${stock} in stock. Cart updated to ${next}.`, true);
    else showToast(`Added ${product.name} to cart`, true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((i) =>
        lineId(i) === id
          ? { ...i, quantity: Math.min(getStock(i.product), Math.max(1, quantity)) }
          : i
      )
    );
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => lineId(i) !== id));

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
  };

  const saveForLater = (id: string) => {
    const item = cart.find((i) => lineId(i) === id);
    if (!item) return;
    setCart((prev) => prev.filter((i) => lineId(i) !== id));
    setSaved((prev) =>
      prev.some((i) => lineId(i) === id) ? prev : [...prev, item]
    );
  };

  const moveToCart = (id: string) => {
    const item = savedForLater.find((i) => lineId(i) === id);
    if (!item) return;
    setSaved((prev) => prev.filter((i) => lineId(i) !== id));
    setCart((prev) => {
      const ex = prev.find((i) => lineId(i) === id);
      if (!ex) return [...prev, item];
      return prev.map((i) =>
        lineId(i) === id
          ? {
              ...i,
              quantity: Math.min(getStock(i.product), i.quantity + item.quantity),
            }
          : i
      );
    });
  };

  const removeSaved = (id: string) =>
    setSaved((prev) => prev.filter((i) => lineId(i) !== id));

  const applyCoupon = (code: string, items: CartItem[] = cart) => {
    const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const result = evaluateCoupon(code, items, subtotal, orders.length);
    if (result.valid) setCouponCode(result.coupon.code);
    return result;
  };

  const toggleWishlist = (productId: string) => {
    const has = wishlist.includes(productId);
    setWishlist((prev) =>
      has ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    showToast(has ? "Removed from wishlist" : "Saved to wishlist");
  };

  const addOrder = (order: Order) => setOrders((prev) => [order, ...prev]);
  const getOrder = (id: string) => orders.find((o) => o.id === id);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <StoreContext.Provider
      value={{
        hydrated,
        cart,
        savedForLater,
        wishlist,
        orders,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        saveForLater,
        moveToCart,
        removeSaved,
        couponCode,
        applyCoupon,
        removeCoupon: () => setCouponCode(null),
        buyNowItem,
        setBuyNowItem,
        cartOpen,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
        addOrder,
        getOrder,
        toggleWishlist,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-full bg-brand-green px-5 py-3 text-sm font-medium text-white shadow-xl animate-popIn"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-brand-green text-xs font-bold">
            ✓
          </span>
          <span>{toast.message}</span>
          {toast.showCartLink && (
            <button
              type="button"
              onClick={() => {
                setToast(null);
                setCartOpen(true);
              }}
              className="ml-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25 transition"
            >
              View cart
            </button>
          )}
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
