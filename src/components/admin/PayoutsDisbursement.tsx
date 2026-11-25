"use client";

import { AdminCause, Payout } from "@/lib/admin-data";
import { updatePayoutStatus } from "@/lib/supabase-admin";

interface Props {
  payouts: Payout[];
  setPayouts: React.Dispatch<React.SetStateAction<Payout[]>>;
  causes: AdminCause[];
  onPersist?: () => Promise<void> | void;
}

export default function PayoutsDisbursement({ payouts, setPayouts, causes }: Props) {
  const totalAvailable = causes.reduce((s, c) => s + c.raised, 0);
  const totalFees = payouts.reduce((s, p) => s + p.fee, 0);
  const completed = payouts.filter((p) => p.status === "Completed").reduce((s, p) => s + p.net, 0);

  const markComplete = async (id: string) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Completed" } : p)));
    await updatePayoutStatus(id, "Completed");
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Payouts & Fund Disbursement</h1><p className="text-sm text-slate-500">Track available funds, fees, and beneficiary payouts.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total Funds Tracked</p><p className="mt-2 text-2xl font-extrabold text-slate-900">₵{totalAvailable.toLocaleString()}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Processing Fees</p><p className="mt-2 text-2xl font-extrabold text-slate-900">₵{totalFees.toLocaleString()}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Completed Payouts</p><p className="mt-2 text-2xl font-extrabold text-[#15803D]">₵{completed.toLocaleString()}</p></div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Payout History</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="pb-3">Cause / Beneficiary</th><th className="pb-3">Available</th><th className="pb-3">Fee</th><th className="pb-3">Net Payout</th><th className="pb-3">Status</th><th className="pb-3">Date</th><th className="pb-3">Action</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="py-3"><p className="font-medium text-slate-900">{p.cause}</p><p className="text-xs text-slate-500">{p.beneficiary}</p></td>
                  <td className="py-3">₵{p.available.toLocaleString()}</td>
                  <td className="py-3 text-slate-500">₵{p.fee.toLocaleString()}</td>
                  <td className="py-3 font-semibold text-slate-900">₵{p.net.toLocaleString()}</td>
                  <td className="py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.status === "Completed" ? "bg-emerald-50 text-emerald-700" : p.status === "Processing" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"}`}>{p.status}</span></td>
                  <td className="py-3 text-slate-500">{p.date}</td>
                  <td className="py-3">{p.status !== "Completed" ? <button onClick={() => markComplete(p.id)} className="rounded-lg bg-[#15803D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#166534]">Mark Completed</button> : <span className="text-xs text-slate-400">Completed</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
