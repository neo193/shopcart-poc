"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Smartphone, XCircle } from "lucide-react";
import { PaymentMethod } from "@/lib/orders";
import { formatPrice } from "@/lib/pricing";

export type PaymentPhase = "idle" | "processing" | "failed" | "success";

const PROCESSING_STEPS: Record<PaymentMethod, string[]> = {
  card: ["Contacting your bank…", "Verifying card…", "Confirming payment…"],
  upi: ["Sending payment request…", "Waiting for approval in your UPI app…", "Confirming payment…"],
  netbanking: ["Redirecting to your bank…", "Authorising payment…", "Confirming payment…"],
  cod: ["Checking delivery availability…", "Placing your order…"],
};

/**
 * Mock payment gateway. Later, "processing" is where the Razorpay checkout
 * opens; success/failure come from its handler instead of a timer.
 */
export function PaymentModal({
  phase,
  method,
  amount,
  upiId,
  onRetry,
  onChangeMethod,
}: {
  phase: PaymentPhase;
  method: PaymentMethod;
  amount: number;
  upiId: string;
  onRetry: () => void;
  onChangeMethod: () => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = PROCESSING_STEPS[method];

  useEffect(() => {
    if (phase !== "processing") return;
    setStepIdx(0);
    const total = method === "upi" ? 3200 : 2200;
    const each = total / steps.length;
    const timers = steps.map((_, i) => setTimeout(() => setStepIdx(i), i * each));
    return () => timers.forEach(clearTimeout);
  }, [phase, method, steps]);

  if (phase === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl animate-popIn"
      >
        {phase === "processing" && (
          <>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              {method === "upi" ? (
                <Smartphone className="h-9 w-9 animate-pulse text-brand-green" />
              ) : (
                <Loader2 className="h-9 w-9 animate-spin text-brand-green" />
              )}
            </div>
            <p className="text-lg font-bold text-gray-900">
              {method === "cod" ? "Placing your order" : `Paying ${formatPrice(amount)}`}
            </p>
            {method === "upi" && upiId && (
              <p className="mt-1 text-xs text-gray-500">Request sent to {upiId}</p>
            )}
            <p className="mt-3 text-sm text-gray-600" key={stepIdx}>
              <span className="animate-fadeUp inline-block">{steps[stepIdx]}</span>
            </p>
            <div className="mt-5 flex justify-center gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                    i <= stepIdx ? "bg-brand-green" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="mt-5 text-[11px] text-gray-400">Please don&apos;t close or refresh this page.</p>
          </>
        )}

        {phase === "failed" && (
          <>
            <XCircle className="mx-auto mb-4 h-16 w-16 text-rose-500 animate-checkPulse" />
            <p className="text-xl font-extrabold text-gray-900">Payment failed</p>
            <p className="mt-2 text-sm text-gray-500">
              Your bank declined the transaction. No money was deducted. You can try
              again or pick another payment method.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onRetry}
                className="rounded-full bg-brand-green py-3 text-sm font-bold text-white hover:bg-brand-greenHover transition"
              >
                Retry Payment
              </button>
              <button
                type="button"
                onClick={onChangeMethod}
                className="rounded-full border border-gray-300 py-3 text-sm font-bold text-gray-700 hover:bg-brand-surface transition"
              >
                Change Payment Method
              </button>
            </div>
          </>
        )}

        {phase === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-100 via-sky-100 to-rose-100 animate-checkPulse">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-gray-900">
              {method === "cod" ? "Order placed!" : "Payment successful!"}
            </p>
            <p className="mt-2 text-sm text-gray-500">Taking you to your order…</p>
          </>
        )}
      </div>
    </div>
  );
}
