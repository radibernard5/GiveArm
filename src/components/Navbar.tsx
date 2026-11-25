"use client";

import { HeartHandshake, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Currency } from "@/lib/types";
import { currencyLabel } from "@/lib/format";

interface NavbarProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onDonate: () => void;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Causes", href: "#causes" },
  { label: "Impact Stories", href: "#stories" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ currency, onCurrencyChange, onDonate }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute inset-x-0 top-0 z-50 border-b border-white/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-soft">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-white">GiveArm</span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 xl:flex">
          <div className="flex items-center rounded-full border border-white/25 bg-white/10 p-1 text-xs font-semibold text-white backdrop-blur">
            {(["GHS", "USD"] as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCurrencyChange(c)}
                className={`rounded-full px-3 py-1.5 transition ${
                  currency === c ? "bg-white text-brand-dark" : "text-white/85 hover:text-white"
                }`}
              >
                {currencyLabel(c)}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-2 text-sm text-white/90 2xl:flex">
            <Phone className="h-4 w-4 text-brand-soft" />
            <span>Need help? 0543314054</span>
          </div>
          <button
            type="button"
            onClick={onDonate}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-hover"
          >
            Donate Now
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/30 p-2 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/15 bg-[#052E16]/95 px-4 py-5 backdrop-blur lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-white/90"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2">
              {(["GHS", "USD"] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCurrencyChange(c)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    currency === c ? "bg-white text-brand-dark" : "bg-white/10 text-white"
                  }`}
                >
                  {currencyLabel(c)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onDonate();
              }}
              className="mt-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
            >
              Donate Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
