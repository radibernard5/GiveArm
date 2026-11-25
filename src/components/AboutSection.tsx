"use client";

import { HeartHandshake } from "lucide-react";
import Image from "next/image";
import { Currency } from "@/lib/types";

interface AboutSectionProps {
  currency: Currency;
  onDonate: () => void;
}

export default function AboutSection({ currency, onDonate }: AboutSectionProps) {
  const funded = currency === "GHS" ? "₵850k+" : "$75k+";

  return (
    <section id="about" className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="relative ml-auto h-[420px] w-[82%] overflow-hidden rounded-2xl shadow-soft sm:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80"
              alt="Community volunteers helping children"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-8 left-0 h-44 w-44 overflow-hidden rounded-2xl border-8 border-white shadow-soft sm:h-56 sm:w-56">
            <Image
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=600&q=80"
              alt="Hands joined in support"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-2 right-4 rounded-2xl bg-brand px-6 py-5 text-white shadow-soft sm:right-10 sm:px-8">
            <p className="text-sm font-medium text-brand-soft">We&apos;ve Funded</p>
            <p className="mt-1 text-2xl font-extrabold sm:text-3xl">{funded}</p>
            <p className="text-sm font-medium text-white/90">in Direct Aid</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-brand">ABOUT GIVEARM</p>
          <h2 className="mt-4 text-balance text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            United in compassion, changing lives
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600">
            GiveArm is a community-first charity platform connecting generous donors with verified
            local initiatives across Ghana. We believe every act of kindness can unlock opportunity,
            dignity, and lasting change for families who need it most.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:items-start">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <HeartHandshake className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">100% Transparent Aid</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Every cedi and dollar is tracked from donor to community, with clear impact
                  reporting.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
              <p className="text-3xl font-extrabold text-brand">75,958</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Lives Impacted</p>
              <p className="mt-2 text-sm text-slate-500">
                Across education, water, health, and family support programs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDonate}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Learn More <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
