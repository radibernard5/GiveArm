"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import { Cause, Currency } from "@/lib/types";
import { formatAmount } from "@/lib/format";

interface CausesSectionProps {
  causes: Cause[];
  currency: Currency;
  onDonate: (causeName: string, causeId?: string | null) => void;
}

function getCauseAmounts(cause: Cause, selectedCurrency: Currency) {
  if (typeof cause.raisedAmount === "number" && typeof cause.goalAmount === "number") {
    const causeCurrency = (cause.currency === "USD" ? "USD" : "GHS") as Currency;
    return {
      raised: cause.raisedAmount,
      goal: cause.goalAmount,
      currency: causeCurrency,
    };
  }

  const useGhs = selectedCurrency === "GHS";
  return {
    raised: useGhs ? cause.raisedGhs ?? 0 : cause.raisedUsd ?? 0,
    goal: useGhs ? cause.goalGhs ?? 1 : cause.goalUsd ?? 1,
    currency: selectedCurrency,
  };
}

export default function CausesSection({ causes, currency, onDonate }: CausesSectionProps) {
  return (
    <section id="causes" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-brand">ACTIVE CAUSES</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Supporting active community causes
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Your donation goes directly to verified projects making real change on the ground.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {causes.map((cause) => {
            const { raised, goal, currency: displayCurrency } = getCauseAmounts(cause, currency);
            const percent =
              typeof cause.progressPercentage === "number"
                ? Math.min(100, Math.round(cause.progressPercentage))
                : Math.min(100, Math.round((raised / Math.max(goal, 1)) * 100));
            const donors = cause.donorCount ?? cause.donors ?? 0;
            const image = cause.imageUrl || cause.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80";
            const summary = cause.description || cause.summary || "";
            return (
              <article key={cause.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition hover:shadow-soft">
                <div className="relative h-64 w-full">
                  <Image src={image} alt={cause.title} fill className="object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow">
                    {cause.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold leading-snug text-slate-900">{cause.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{summary}</p>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                      <span className="text-brand">Raised: {formatAmount(raised, displayCurrency)}</span>
                      <span className="text-slate-500">Goal: {formatAmount(goal, displayCurrency)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-emerald-100">
                      <div
                        className="h-full rounded-full bg-brand transition-all duration-500"
                        style={{ width: `${percent}%` }}
                        aria-label={`${percent}% funded`}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-brand" />
                        {donors.toLocaleString()} donors
                      </span>
                      <span className="font-medium text-slate-700">{percent}% funded</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDonate(cause.title, cause.id)}
                    className="mt-6 w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
                  >
                    Donate to Cause
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
