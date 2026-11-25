"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import InitiativesGrid from "@/components/InitiativesGrid";
import CausesSection from "@/components/CausesSection";
import DonationBanner from "@/components/DonationBanner";
import ProcessSteps from "@/components/ProcessSteps";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import StoriesSection from "@/components/StoriesSection";
import Footer from "@/components/Footer";
import DonationModal from "@/components/DonationModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Cause, Currency, Frequency } from "@/lib/types";

export default function HomePage() {
  const [currency, setCurrency] = useState<Currency>("GHS");
  const [causes, setCauses] = useState<Cause[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState("General GiveArm Fund");
  const [selectedCauseId, setSelectedCauseId] = useState<string | null>(null);
  const [initialAmount, setInitialAmount] = useState<number | undefined>(undefined);
  const [initialFrequency, setInitialFrequency] = useState<Frequency>("one-time");

  useEffect(() => {
    const loadCauses = async () => {
      try {
        const res = await fetch("/api/causes", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.causes)) {
          setCauses(data.causes);
        }
      } catch {
        // Keep causes empty when API/database is unavailable.
      }
    };
    loadCauses();
  }, []);

  const openDonate = (
    causeName = "General GiveArm Fund",
    opts?: { amount?: number; frequency?: Frequency; causeId?: string | null }
  ) => {
    setSelectedCause(causeName);
    setSelectedCauseId(opts?.causeId ?? null);
    setInitialAmount(opts?.amount);
    setInitialFrequency(opts?.frequency ?? "one-time");
    setModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar currency={currency} onCurrencyChange={setCurrency} onDonate={() => openDonate()} />
      <Hero currency={currency} onDonate={() => openDonate()} />
      <AboutSection currency={currency} onDonate={() => openDonate()} />
      <InitiativesGrid />
      <CausesSection
        causes={causes}
        currency={currency}
        onDonate={(name, causeId) => openDonate(name, { causeId })}
      />
      <DonationBanner currency={currency} onDonate={(opts) => openDonate("General GiveArm Fund", opts)} />
      <ProcessSteps />
      <Testimonials />
      <Gallery />
      <StoriesSection />
      <Footer />
      <DonationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        causeName={selectedCause}
        causeId={selectedCauseId}
        currency={currency}
        initialAmount={initialAmount}
        initialFrequency={initialFrequency}
      />
      <WhatsAppButton />
    </main>
  );
}
