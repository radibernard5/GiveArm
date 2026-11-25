"use client";

import { HeartHandshake, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to subscribe");
      setStatus("success");
      setMessage("Thanks for subscribing! You'll receive GiveArm updates.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to subscribe. Please try again.");
    }
  };

  return (
    <footer id="contact" className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                <HeartHandshake className="h-5 w-5" />
              </span>
              <span className="text-xl font-extrabold">GiveArm</span>
            </a>
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              Empowering communities through transparent giving, direct aid, and sustainable local impact across Ghana.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> 14 Liberation Road, Airport Residential, Accra, Ghana</p>
              <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-brand" /> 0543314054</p>
              <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-brand" /> hello@givearm.org</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-soft">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              { [
                ["Home", "#home"],
                ["About Us", "#about"],
                ["Causes", "#causes"],
                ["Impact Stories", "#stories"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition hover:text-white">{label}</a>
                </li>
              )) }
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-soft">Our Causes</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li><a href="#causes" className="hover:text-white">Clean Water &amp; Boreholes</a></li>
              <li><a href="#causes" className="hover:text-white">Community Healthcare</a></li>
              <li><a href="#causes" className="hover:text-white">STEM &amp; School Support</a></li>
              <li><a href="#causes" className="hover:text-white">Women &amp; Youth Empowerment</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-soft">Newsletter</h3>
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              Get impact updates, stories from the field, and ways to help.
            </p>
            <form className="mt-5 flex gap-2" onSubmit={handleSubscribe}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-brand"
                required
              />
              <button
                type="submit"
                aria-label="Subscribe"
                disabled={status === "loading"}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-hover disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-xs ${status === "error" ? "text-red-300" : "text-brand-soft"}`}>{message}</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/55 sm:flex-row">
          <p>© {new Date().getFullYear()} GiveArm. All rights reserved.</p>
          <p>Built with compassion for communities everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
