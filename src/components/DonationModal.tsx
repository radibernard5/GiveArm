"use client";

import { CheckCircle2, CreditCard, Heart, Loader2, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Currency, Frequency, PaymentMethod } from "@/lib/types";
import { formatAmount } from "@/lib/format";
import { supabase } from "@/supabase";

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  causeName: string;
  causeId?: string | null;
  currency: Currency;
  initialAmount?: number;
  initialFrequency?: Frequency;
}

const PRESETS_GHS = [50, 100, 250, 500];
const PRESETS_USD = [10, 25, 50, 100];
const PAYSTACK_INLINE_SRC = "https://js.paystack.co/v1/inline.js";

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Window unavailable"));
    if (window.PaystackPop) return resolve();
    const existing = document.querySelector(`script[src="${PAYSTACK_INLINE_SRC}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Paystack")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = PAYSTACK_INLINE_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.body.appendChild(script);
  });
}

export default function DonationModal({
  open,
  onClose,
  causeName,
  causeId,
  currency,
  initialAmount,
  initialFrequency = "one-time",
}: DonationModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>(initialFrequency);
  const [method, setMethod] = useState<PaymentMethod>("momo");
  const [network, setNetwork] = useState("MTN MoMo");
  const [phone, setPhone] = useState("0543314054");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txRef, setTxRef] = useState("");
  const [error, setError] = useState("");

  const presets = currency === "GHS" ? PRESETS_GHS : PRESETS_USD;
  const symbol = currency === "GHS" ? "₵" : "$";

  useEffect(() => {
    if (open) {
      setFullName("");
      setEmail("");
      setAmount(initialAmount ? String(initialAmount) : String(presets[1]));
      setFrequency(initialFrequency);
      setMethod("momo");
      setNetwork("MTN MoMo");
      setPhone("0543314054");
      setLoading(false);
      setSuccess(false);
      setTxRef("");
      setError("");
      loadPaystackScript().catch(() => undefined);
    }
  }, [open, initialAmount, initialFrequency, currency]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const numericAmount = Number(amount);
  const validAmount = Number.isFinite(numericAmount) && numericAmount > 0;

  const saveDonation = async (ref: string, paystackStatus: "Completed" | "Pending") => {
    const methodLabel = method === "momo" ? network : "Card / Paystack";
    const { error: insertError } = await supabase.from("donations").insert([
      {
        email: email.trim(),
        name: fullName.trim(),
        amount: numericAmount,
        donor_name: fullName.trim(),
        donor_email: email.trim(),
        cause: causeName || "General GiveArm Fund",
        method: methodLabel,
        reference: ref,
        status: paystackStatus,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    if (insertError) throw insertError;

    if (paystackStatus === "Completed" && causeId) {
      const { data: causeRow } = await supabase.from("causes").select("id,raised").eq("id", causeId).maybeSingle();
      if (causeRow) {
        await supabase.from("causes").update({ raised: Number(causeRow.raised || 0) + numericAmount }).eq("id", causeId);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address for your receipt.");
    if (!validAmount) return setError("Please enter a valid donation amount.");
    if (method === "momo" && !/^[0-9\s+()-]{8,}$/.test(phone))
      return setError("Please enter a valid Mobile Money phone number.");

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) return setError("Paystack public key is not configured. Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to .env.local.");

    setLoading(true);
    try {
      await loadPaystackScript();
      if (!window.PaystackPop?.setup) throw new Error("Paystack could not be loaded. Please check your connection.");

      const ref = `GA-${Date.now().toString(36).toUpperCase()}`;
      const paystackCurrency: "GHS" | "USD" = "GHS"; // Paystack MoMo in Ghana uses GHS
      const channels = method === "momo" ? ["mobile_money"] : ["card", "bank", "ussd", "qr", "mobile_money"];

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email.trim(),
        amount: Math.round(numericAmount * 100),
        currency: paystackCurrency,
        ref,
        channels,
        metadata: {
          custom_fields: [
            { display_name: "Donor Name", variable_name: "donor_name", value: fullName.trim() },
            { display_name: "Cause", variable_name: "cause", value: causeName || "General GiveArm Fund" },
            { display_name: "Phone", variable_name: "phone", value: phone.trim() },
            { display_name: "Frequency", variable_name: "frequency", value: frequency },
            { display_name: "Method", variable_name: "method", value: method === "momo" ? network : "Card / Paystack" },
          ],
        },
        ...(method === "momo" && phone.trim() ? { mobile_money: { phone: phone.trim(), provider: network.toLowerCase().includes("mtn") ? "mtn" : network.toLowerCase().includes("telecel") || network.toLowerCase().includes("vod") ? "vod" : "atl" } } : {}),
        callback: (response: any) => {
          const paidRef = response?.reference || ref;
          saveDonation(paidRef, "Completed")
            .then(() => {
              setTxRef(paidRef);
              setSuccess(true);
            })
            .catch((err: any) => {
              setError(err?.message || "Payment succeeded, but we could not save the donation record. Please contact support with your reference.");
              setTxRef(paidRef);
            })
            .finally(() => setLoading(false));
        },
        onClose: () => {
          setLoading(false);
          setError("Payment window closed. No donation was completed.");
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setError(err?.message || "Unable to start Paystack checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Donation form">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-soft">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Donate to GiveArm</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{success ? "Thank You for Your Kindness!" : causeName || "General GiveArm Fund"}</h2>
            {!success && <p className="mt-1 text-sm text-slate-500">Your gift brings hope and direct impact to communities.</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close donation modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center sm:px-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <p className="mt-6 text-lg font-semibold text-slate-900">Your donation has been received with gratitude.</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Thank you for supporting <span className="font-medium text-slate-900">{causeName || "General GiveArm Fund"}</span>. Your kindness makes a real difference.
            </p>
            <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-brand-mint p-5 text-left">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Amount</span><span className="font-semibold text-slate-900">{formatAmount(numericAmount, "GHS")}</span></div>
              <div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">Frequency</span><span className="font-semibold text-slate-900 capitalize">{frequency.replace("-", " ")}</span></div>
              <div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">Payment</span><span className="font-semibold text-slate-900">{method === "momo" ? network : "Card / Paystack"}</span></div>
              <div className="mt-2 flex justify-between text-sm"><span className="text-slate-500">Transaction Ref</span><span className="font-mono font-semibold text-brand">{txRef}</span></div>
            </div>
            <button type="button" onClick={onClose} className="mt-8 rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white hover:bg-brand-hover">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              {(["one-time", "monthly"] as Frequency[]).map((f) => (
                <button key={f} type="button" onClick={() => setFrequency(f)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${frequency === f ? "bg-brand text-white" : "text-slate-600"}`}>
                  {f === "one-time" ? "One-Time" : "Monthly"}
                </button>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Donation Amount (GHS)</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button key={p} type="button" onClick={() => setAmount(String(p))} className={`rounded-full border px-4 py-2 text-sm font-semibold ${amount === String(p) ? "border-brand bg-brand text-white" : "border-slate-200 text-slate-700 hover:border-brand"}`}>
                    {symbol}{p}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center rounded-xl border border-slate-200 px-4 py-3 focus-within:border-brand">
                <span className="mr-2 font-semibold text-slate-500">{symbol}</span>
                <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Enter amount" aria-label="Donation amount" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="donor-name" className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                <input id="donor-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand" placeholder="e.g. Ama Mensah" required />
              </div>
              <div>
                <label htmlFor="donor-email" className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
                <input id="donor-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">Payment Method</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setMethod("momo")} className={`flex items-center gap-3 rounded-2xl border p-4 text-left ${method === "momo" ? "border-brand bg-brand-soft/40" : "border-slate-200"}`}>
                  <Smartphone className="h-5 w-5 text-brand" />
                  <div><p className="font-semibold text-slate-900">Mobile Money (MoMo)</p><p className="text-xs text-slate-500">MTN, Telecel, AT Money</p></div>
                </button>
                <button type="button" onClick={() => setMethod("card")} className={`flex items-center gap-3 rounded-2xl border p-4 text-left ${method === "card" ? "border-brand bg-brand-soft/40" : "border-slate-200"}`}>
                  <CreditCard className="h-5 w-5 text-brand" />
                  <div><p className="font-semibold text-slate-900">Card / Bank (Paystack)</p><p className="text-xs text-slate-500">Visa, Mastercard, Bank</p></div>
                </button>
              </div>
            </div>

            {method === "momo" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="momo-network" className="mb-2 block text-sm font-semibold text-slate-700">Network</label>
                  <select id="momo-network" value={network} onChange={(e) => setNetwork(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand">
                    <option>MTN MoMo</option>
                    <option>Telecel Cash</option>
                    <option>AT Money</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="momo-phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                  <input id="momo-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand" placeholder="024 XXX XXXX" />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-brand/20 bg-brand-mint p-5">
                <p className="font-semibold text-slate-900">Secure Paystack Checkout</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  You&apos;ll complete payment securely through Paystack. Your details are encrypted and never stored on GiveArm servers.
                </p>
              </div>
            )}

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening Paystack...</> : <><Heart className="h-4 w-4" /> Donate with Paystack</>}
            </button>
            <p className="text-center text-xs text-slate-500">Secured by Paystack. Currency: GHS. Mobile Money enabled.</p>
          </form>
        )}
      </div>
    </div>
  );
}
