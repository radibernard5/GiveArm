"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { AdminDonation } from "@/lib/admin-data";
import { updateDonationStatus } from "@/lib/supabase-admin";

interface Props {
  donations: AdminDonation[];
  setDonations: React.Dispatch<React.SetStateAction<AdminDonation[]>>;
  search: string;
  onPersist?: () => Promise<void> | void;
}

export default function DonationsLedger({ donations, setDonations, search }: Props) {
  const [status, setStatus] = useState("All");
  const [cause, setCause] = useState("All");

  const causes = ["All", ...Array.from(new Set(donations.map((d) => d.cause)))];
  const filtered = useMemo(() => donations.filter((d) => {
    const q = search.toLowerCase();
    const matchQ = !q || d.donorName.toLowerCase().includes(q) || d.donorEmail.toLowerCase().includes(q) || d.reference.toLowerCase().includes(q) || d.cause.toLowerCase().includes(q);
    return matchQ && (status === "All" || d.status === status) && (cause === "All" || d.cause === cause);
  }), [donations, search, status, cause]);

  const exportCsv = () => {
    const header = ["ID", "Donor", "Email", "Cause", "Amount", "Method", "Reference", "Status", "Date"];
    const rows = filtered.map((d) => [d.id, d.donorName, d.donorEmail, d.cause, d.amount, d.method, d.reference, d.status, d.date]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "givearm-donations.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const markRefunded = async (id: string) => {
    setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, status: "Refunded" } : d)));
    await updateDonationStatus(id, "Refunded");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-2xl font-extrabold text-slate-900">Donations & Transactions</h1><p className="text-sm text-slate-500">Track donations, receipts, statuses, and refunds.</p></div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" /> Export CSV</button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option>All</option><option>Completed</option><option>Pending</option><option>Refunded</option></select>
          <select value={cause} onChange={(e) => setCause(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">{causes.map((c) => <option key={c}>{c}</option>)}</select>
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input readOnly value={search} className="rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-500" placeholder="Use top search" /></div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="pb-3">Donor</th><th className="pb-3">Cause</th><th className="pb-3">Amount</th><th className="pb-3">Method / Ref</th><th className="pb-3">Status</th><th className="pb-3">Date</th><th className="pb-3">Action</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="py-3"><p className="font-medium text-slate-900">{d.donorName}</p><p className="text-xs text-slate-500">{d.donorEmail}</p></td>
                  <td className="py-3 text-slate-600">{d.cause}</td>
                  <td className="py-3 font-semibold text-slate-900">₵{d.amount.toLocaleString()}</td>
                  <td className="py-3 text-slate-600"><p>{d.method}</p><p className="text-xs text-slate-400">{d.reference}</p></td>
                  <td className="py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${d.status === "Completed" ? "bg-emerald-50 text-emerald-700" : d.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{d.status}</span></td>
                  <td className="py-3 text-slate-500">{d.date}</td>
                  <td className="py-3">{d.status !== "Refunded" ? <button onClick={() => markRefunded(d.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Refund</button> : <span className="text-xs text-slate-400">Refunded</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
