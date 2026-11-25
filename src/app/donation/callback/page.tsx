"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

interface Receipt {
  reference: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  paymentChannel: string;
  frequency: string;
  status: string;
  causeName: string;
}

export default function DonationCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [paystackStatus, setPaystackStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) {
      setError("Missing donation reference.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/donations/verify/${encodeURIComponent(reference)}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Unable to verify donation.");
        setPaystackStatus(data.paystackStatus || "");
        setReceipt(data.donation || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to verify donation.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  const success = paystackStatus === "success" || receipt?.status === "SUCCESS";

  return (
    <main className="min-h-screen bg-brand-mint px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-soft sm:p-10">
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand" />
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Verifying your donation...</h1>
            <p className="mt-2 text-slate-600">Please wait while we confirm your payment.</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Verification issue</h1>
            <p className="mt-2 text-slate-600">{error}</p>
          </div>
        ) : (
          <div className="py-6 text-center">
            {success ? (
              <CheckCircle2 className="mx-auto h-14 w-14 text-brand" />
            ) : (
              <XCircle className="mx-auto h-14 w-14 text-amber-500" />
            )}
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              {success ? "Thank You for Your Kindness!" : "Donation Status"}
            </h1>
            <p className="mt-2 text-slate-600">
              {success
                ? "Your payment was confirmed. A receipt has been sent to your email."
                : "We could not confirm a successful payment yet. If you were charged, please contact GiveArm with your reference."}
            </p>
            {receipt && (
              <div className="mx-auto mt-8 max-w-md rounded-2xl bg-brand-mint p-5 text-left text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Reference</span><span className="font-mono font-semibold text-brand">{receipt.reference}</span></div>
                <div className="mt-2 flex justify-between"><span className="text-slate-500">Donor</span><span className="font-semibold text-slate-900">{receipt.donorName}</span></div>
                <div className="mt-2 flex justify-between"><span className="text-slate-500">Cause</span><span className="font-semibold text-slate-900">{receipt.causeName}</span></div>
                <div className="mt-2 flex justify-between"><span className="text-slate-500">Amount</span><span className="font-semibold text-slate-900">{receipt.currency} {receipt.amount.toLocaleString()}</span></div>
                <div className="mt-2 flex justify-between"><span className="text-slate-500">Status</span><span className="font-semibold text-slate-900">{receipt.status}</span></div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white hover:bg-brand-hover">
            Back to GiveArm
          </Link>
        </div>
      </div>
    </main>
  );
}
