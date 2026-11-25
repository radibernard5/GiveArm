"use client";

import { CheckCircle2, Play } from "lucide-react";
import Image from "next/image";
import { Currency } from "@/lib/types";
import { formatAmount } from "@/lib/format";

interface HeroProps {
  currency: Currency;
  onDonate: () => void;
}

export default function Hero({ currency, onDonate }: HeroProps) {
  const gift = currency === "GHS" ? 250 : 20;

  return (
    <section id="home" className="relative min-h-[92vh] overflow-hidden bg-slate-900">
      <Image
        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80"
        alt="Smiling children in a community"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#052E16]/90 via-[#052E16]/65 to-[#052E16]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#052E16]/40 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-brand-soft backdrop-blur">
            WELCOME TO GIVEARM
          </span>
          <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Empower change, one{" "}
            <span className="text-emerald-400">act of kindness</span> at a time
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Join GiveArm in creating brighter futures by delivering direct aid, clean water, and
            educational support to underserved communities.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onDonate}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-hover"
            >
              Donate Now <span aria-hidden="true">→</span>
            </button>
            <a
              href="#stories"
              className="group inline-flex items-center gap-3 rounded-full px-2 py-2 text-sm font-semibold text-white transition hover:text-brand-soft"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition group-hover:bg-brand group-hover:border-brand">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
              Watch Impact Video
            </a>
          </div>
        </div>

        <div className="mt-14 max-w-5xl rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md sm:p-6">
          <div className="grid gap-5 md:grid-cols-3 md:items-center">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <p className="text-sm font-medium text-white">Rural Education &amp; Digital Literacy</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <p className="text-sm font-medium text-white">Women &amp; Youth Empowerment</p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3 text-sm text-white/90">
              <span className="font-semibold text-emerald-300">Feed Local Families:</span> Your gift
              of {formatAmount(gift, currency)} {currency === "GHS" ? "/ $20" : "/ ₵250"} provides
              meals for 15 children.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
