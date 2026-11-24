"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DeliveryAddress } from "@/lib/orders";

/**
 * Mock accounts for the POC. Accounts live in this browser's localStorage
 * and passwords are never stored: any password signs in to an existing
 * email. Replace the bodies of these functions with Supabase Auth calls
 * (signInWithPassword, signUp, signOut) and a profiles/addresses table later.
 */

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface SavedAddress extends DeliveryAddress {
  id: string;
  label: string; // Home, Work, ...
  isDefault: boolean;
}

interface AccountRecord {
  user: UserProfile;
  addresses: SavedAddress[];
}

interface StoredAuth {
  accounts: Record<string, AccountRecord>;
  currentEmail: string | null;
}

type Result = { ok: true } | { ok: false; error: string };

interface AuthValue {
  hydrated: boolean;
  user: UserProfile | null;
  addresses: SavedAddress[];
  defaultAddress: SavedAddress | null;
  signIn: (email: string, password: string) => Result;
  signUp: (data: Omit<UserProfile, "createdAt"> & { password: string }) => Result;
  signInDemo: () => void;
  signOut: () => void;
  updateProfile: (data: Partial<Omit<UserProfile, "email" | "createdAt">>) => void;
  saveAddress: (addr: Omit<SavedAddress, "id" | "isDefault"> & { id?: string; isDefault?: boolean }) => SavedAddress;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const STORAGE_KEY = "shopcart:auth:v1";
const AuthContext = createContext<AuthValue | undefined>(undefined);

const norm = (email: string) => email.trim().toLowerCase();
const newId = () => `addr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const DEMO_EMAIL = "aarav.sharma@example.com";
function demoAccount(): AccountRecord {
  return {
    user: {
      firstName: "Aarav",
      lastName: "Sharma",
      email: DEMO_EMAIL,
      phone: "+91 98765 43210",
      createdAt: new Date().toISOString(),
    },
    addresses: [
      {
        id: newId(),
        label: "Home",
        isDefault: true,
        firstName: "Aarav",
        lastName: "Sharma",
        address: "Flat 12B, Lakeview Apartments, 4th Cross, Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        zip: "560038",
        mobile: "+91 98765 43210",
        email: DEMO_EMAIL,
      },
      {
        id: newId(),
        label: "Work",
        isDefault: false,
        firstName: "Aarav",
        lastName: "Sharma",
        address: "Level 5, Prestige Tech Park, Outer Ring Road, Marathahalli",
        city: "Bengaluru",
        state: "Karnataka",
        zip: "560103",
        mobile: "+91 98765 43210",
        email: DEMO_EMAIL,
      },
    ],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<StoredAuth>({ accounts: {}, currentEmail: null });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as StoredAuth;
        if (s && typeof s.accounts === "object") setState(s);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [hydrated, state]);

  const current = state.currentEmail ? state.accounts[state.currentEmail] : undefined;
  const user = current?.user ?? null;
  const addresses = current?.addresses ?? [];

  const updateCurrent = (fn: (a: AccountRecord) => AccountRecord) =>
    setState((s) => {
      if (!s.currentEmail || !s.accounts[s.currentEmail]) return s;
      return { ...s, accounts: { ...s.accounts, [s.currentEmail]: fn(s.accounts[s.currentEmail]) } };
    });

  const signIn: AuthValue["signIn"] = (email, password) => {
    const key = norm(email);
    if (!key || !password) return { ok: false, error: "Enter your email and password." };
    if (!state.accounts[key])
      return { ok: false, error: "No account found with that email. Create one below." };
    setState((s) => ({ ...s, currentEmail: key }));
    return { ok: true };
  };

  const signUp: AuthValue["signUp"] = ({ password, ...data }) => {
    const key = norm(data.email);
    if (state.accounts[key]) return { ok: false, error: "An account with this email already exists. Sign in instead." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    const record: AccountRecord = {
      user: { ...data, email: key, createdAt: new Date().toISOString() },
      addresses: [],
    };
    setState((s) => ({ accounts: { ...s.accounts, [key]: record }, currentEmail: key }));
    return { ok: true };
  };

  const signInDemo = () =>
    setState((s) => ({
      accounts: s.accounts[DEMO_EMAIL] ? s.accounts : { ...s.accounts, [DEMO_EMAIL]: demoAccount() },
      currentEmail: DEMO_EMAIL,
    }));

  const signOut = () => setState((s) => ({ ...s, currentEmail: null }));

  const updateProfile: AuthValue["updateProfile"] = (data) =>
    updateCurrent((a) => ({ ...a, user: { ...a.user, ...data } }));

  const saveAddress: AuthValue["saveAddress"] = (addr) => {
    const id = addr.id ?? newId();
    const existing = addresses.find((a) => a.id === id);
    const makeDefault = addr.isDefault ?? (existing?.isDefault || addresses.length === 0);
    const saved: SavedAddress = { ...existing, ...addr, id, isDefault: makeDefault } as SavedAddress;
    updateCurrent((a) => {
      let list = a.addresses.some((x) => x.id === id)
        ? a.addresses.map((x) => (x.id === id ? saved : x))
        : [...a.addresses, saved];
      if (makeDefault) list = list.map((x) => ({ ...x, isDefault: x.id === id }));
      return { ...a, addresses: list };
    });
    return saved;
  };

  const removeAddress = (id: string) =>
    updateCurrent((a) => {
      const list = a.addresses.filter((x) => x.id !== id);
      if (list.length && !list.some((x) => x.isDefault)) list[0] = { ...list[0], isDefault: true };
      return { ...a, addresses: list };
    });

  const setDefaultAddress = (id: string) =>
    updateCurrent((a) => ({ ...a, addresses: a.addresses.map((x) => ({ ...x, isDefault: x.id === id })) }));

  return (
    <AuthContext.Provider
      value={{
        hydrated,
        user,
        addresses,
        defaultAddress: addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
        signIn,
        signUp,
        signInDemo,
        signOut,
        updateProfile,
        saveAddress,
        removeAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
