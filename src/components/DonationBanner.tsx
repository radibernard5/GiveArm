"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CreditCard, Smartphone } from "lucide-react";
import { Currency, Frequency } from "@/lib/types";

interface DonationBannerProps {
  currency: Currency;
  onDonate: (opts: { amount?: number; frequency: Frequency }) => void;
}

export default function DonationBanner({ currency, onDonate }: DonationBannerProps) {
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [selected, setSelected] = useState<number | "custom">(currency === "GHS" ? 100 : 25);
  const [custom, setCustom] = useState("");

  const presets = currency === "GHS" ? [50, 100, 250, 500] : [10, 25, 50, 100];
  const symbol = currency === "GHS" ? "₵" : "$";
  const amount = selected === "custom" ? Number(custom) || undefined : selected;

  useEffect(() => {
    setSelected(currency === "GHS" ? 100 : 25);
    setCustom("");
  }, [currency]);

  return (
    <section className="bg-brand-mint py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl bg-white shadow-soft lg:grid-cols-2">
        <div className="relative min-h-[340px]">
          <Image
            src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80"
            alt="Community members smiling together"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052E16]/45 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/15 p-5 text-white backdrop-blur-md">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-soft">Quick Donate</p>
            <p className="mt-1 text-xl font-bold">Your kindness creates immediate impact.</p>
          </div>
        </div>

        <div className="p-8 sm:p-10 lg:p-12">
          <p className="text-sm font-semibold tracking-[0.2em] text-brand">MAKE A DIFFERENCE</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Give hope in just a few clicks
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Choose an amount and support verified GiveArm causes with secure Mobile Money or card payments.
          </p>

          <div className="mt-8 inline-flex rounded-full bg-slate-100 p-1">
            {(["one-time", "monthly"] as Frequency[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  frequency === f ? "bg-brand text-white shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f === "one-time" ? "One-Time" : "Monthly"}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelected(p)}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  selected === p
                    ? "border-brand bg-brand text-white"
                    : "border-slate-200 text-slate-700 hover:border-brand hover:text-brand"
                }`}
              >
                {symbol}
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelected("custom")}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                selected === "custom"
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 text-slate-700 hover:border-brand hover:text-brand"
              }`}
            >
              Custom
            </button>
          </div>

          {selected === "custom" && (
            <div className="mt-4">
              <label htmlFor="custom-amount" className="sr-only">Custom amount</label>
              <div className="flex items-center rounded-full border border-slate-200 bg-white px-4 py-3 focus-within:border-brand">
                <span className="mr-2 font-semibold text-slate-500">{symbol}</span>
                <input
                  id="custom-amount"
                  type="number"
                  min="1"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-mint px-4 py-2 text-xs font-semibold text-brand-dark">
              <Smartphone className="h-4 w-4 text-brand" /> MTN MoMo
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-mint px-4 py-2 text-xs font-semibold text-brand-dark">
              <Smartphone className="h-4 w-4 text-brand" /> Telecel Cash
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-mint px-4 py-2 text-xs font-semibold text-brand-dark">
              <CreditCard className="h-4 w-4 text-brand" /> Visa / Mastercard
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">Secure payments powered by Paystack.</p>

          <button
            type="button"
            onClick={() => onDonate({ amount, frequency })}
            className="mt-8 w-full rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Proceed to Donate →
          </button>
        </div>
      </div>
    </section>
  );
}
