"use client";

import { ArrowUpRight, BadgeDollarSign, HeartHandshake, Clock3, Users, TrendingUp } from "lucide-react";
import { AdminCause, AdminDonation } from "@/lib/admin-data";

interface Stats {
  totalRaised: number;
  activeCauses: number;
  pendingApprovals: number;
  donors: number;
  monthDonations: number;
}

interface Props {
  stats: Stats;
  causes: AdminCause[];
  donations: AdminDonation[];
  chart?: { month: string; amount: number }[];
  onCreateCause: () => void;
  onReviewPending: () => void;
}

export default function OverviewDashboard({ stats, causes, donations, chart = [], onCreateCause, onReviewPending }: Props) {
  const chartData = chart.length ? chart : [{ month: "—", amount: 0 }];
  const max = Math.max(...chartData.map((d) => d.amount), 1);
  const topCauses = [...causes].sort((a, b) => b.raised - a.raised).slice(0, 4);
  const recent = donations.slice(0, 5);

  const cards = [
    { label: "Total Funds Raised", value: `₵${stats.totalRaised.toLocaleString()}`, trend: "+12.4%", icon: BadgeDollarSign },
    { label: "Active Causes", value: String(stats.activeCauses), trend: "+2 this month", icon: HeartHandshake },
    { label: "Pending Approvals", value: String(stats.pendingApprovals), trend: "Needs review", icon: Clock3 },
    { label: "Total Donors", value: String(stats.donors), trend: "+8.1%", icon: Users },
    { label: "Monthly Donations", value: `₵${stats.monthDonations.toLocaleString()}`, trend: "+15.2%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Overview Dashboard</h1>
          <p className="text-sm text-slate-500">Monitor GiveArm performance, donations, and campaign activity.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onReviewPending} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Review Pending</button>
          <button onClick={onCreateCause} className="rounded-xl bg-[#15803D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#166534]">+ Create New Cause</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-[#15803D]"><Icon className="h-5 w-5" /></div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><ArrowUpRight className="h-3.5 w-3.5" />{card.trend}</span>
              </div>
              <p className="mt-4 text-2xl font-extrabold text-slate-900">{card.value}</p>
              <p className="mt-1 text-sm text-slate-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Donation Activity</h2>
              <p className="text-sm text-slate-500">Donations over the last 6 months</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">+15.2% growth</span>
          </div>
          <div className="mt-8 flex h-64 items-end gap-4">
            {chartData.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-emerald-100">
                  <div className="rounded-t-xl bg-[#15803D]" style={{ height: `${(d.amount / max) * 180}px` }} title={`₵${d.amount.toLocaleString()}`} />
                </div>
                <span className="text-xs font-medium text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Top Performing Causes</h2>
          <div className="mt-5 space-y-5">
            {topCauses.map((cause) => {
              const pct = Math.min(100, Math.round((cause.raised / cause.goal) * 100));
              return (
                <div key={cause.id}>
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-slate-800">{cause.title}</p>
                    <span className="text-slate-500">{pct}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#0D9488]" style={{ width: `${pct}%` }} /></div>
                  <p className="mt-1 text-xs text-slate-500">₵{cause.raised.toLocaleString()} / ₵{cause.goal.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Recent Donations</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="pb-3">Donor</th><th className="pb-3">Cause</th><th className="pb-3">Amount</th><th className="pb-3">Status</th><th className="pb-3">Date</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((d) => (
                <tr key={d.id}>
                  <td className="py-3 font-medium text-slate-800">{d.donorName}</td>
                  <td className="py-3 text-slate-600">{d.cause}</td>
                  <td className="py-3 font-semibold text-slate-900">₵{d.amount.toLocaleString()}</td>
                  <td className="py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${d.status === "Completed" ? "bg-emerald-50 text-emerald-700" : d.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{d.status}</span></td>
                  <td className="py-3 text-slate-500">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
