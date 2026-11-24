"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth, SavedAddress } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { AddressEditor, EMPTY_ADDRESS } from "@/components/account/AddressForm";

export default function AddressesPage() {
  const { user, addresses, saveAddress, removeAddress, setDefaultAddress } = useAuth();
  const { showToast } = useStore();
  // null = closed, "new" = adding, otherwise the address being edited.
  const [editing, setEditing] = useState<SavedAddress | "new" | null>(null);
  if (!user) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Saved Addresses</h1>
        {editing === null && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-greenHover"
          >
            <Plus className="h-4 w-4" /> Add New Address
          </button>
        )}
      </div>

      {editing !== null && (
        <div className="mt-6">
          <AddressEditor
            initial={
              editing === "new"
                ? { ...EMPTY_ADDRESS, firstName: user.firstName, lastName: user.lastName, mobile: user.phone, email: user.email }
                : editing
            }
            initialLabel={editing === "new" ? "Home" : editing.label}
            initialDefault={editing === "new" ? addresses.length === 0 : editing.isDefault}
            onCancel={() => setEditing(null)}
            onSave={(addr, label, isDefault) => {
              saveAddress({ ...addr, label, isDefault, id: editing === "new" ? undefined : editing.id });
              showToast(editing === "new" ? "Address added" : "Address updated");
              setEditing(null);
            }}
          />
        </div>
      )}

      {addresses.length === 0 && editing === null ? (
        <p className="mt-6 rounded-2xl bg-brand-surface px-6 py-12 text-center text-sm text-gray-500">
          No saved addresses yet. Add one to check out faster.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((a) => (
            <li
              key={a.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 ${
                a.isDefault ? "border-brand-green ring-1 ring-brand-green" : "border-gray-200"
              }`}
            >
              <div className="text-sm text-gray-600">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-brand-surface px-2.5 py-0.5 text-[11px] font-bold text-gray-700">{a.label}</span>
                  {a.isDefault && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">Default</span>
                  )}
                </div>
                <p className="font-bold text-gray-900">
                  {a.firstName} {a.lastName}
                </p>
                <p>{a.address}</p>
                <p>
                  {a.city}, {a.state} {a.zip}
                </p>
                <p className="mt-1">{a.mobile}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
                <button type="button" onClick={() => setEditing(a)} className="flex items-center gap-1 text-brand-green hover:underline">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove the ${a.label} address?`)) {
                      removeAddress(a.id);
                      showToast("Address removed");
                    }
                  }}
                  className="flex items-center gap-1 text-gray-500 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
                {!a.isDefault && (
                  <button type="button" onClick={() => setDefaultAddress(a.id)} className="text-gray-500 hover:text-brand-green">
                    Set as default
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
