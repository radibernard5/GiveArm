"use client";

import {
  LayoutDashboard,
  HeartHandshake,
  Receipt,
  Users,
  Wallet,
  Settings,
  ShieldCheck,
} from "lucide-react";

export type AdminModule = "overview" | "causes" | "donations" | "donors" | "payouts" | "settings";

interface Props {
  active: AdminModule;
  onChange: (m: AdminModule) => void;
  pendingApprovals: number;
}

const items: { id: AdminModule; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "causes", label: "Causes Management", icon: HeartHandshake },
  { id: "donations", label: "Donations & Ledger", icon: Receipt },
  { id: "donors", label: "Donors & Creators", icon: Users },
  { id: "payouts", label: "Payouts", icon: Wallet },
  { id: "settings", label: "Platform Settings", icon: Settings },
];

export default function AdminSidebar({ active, onChange, pendingApprovals }: Props) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15803D] text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-extrabold text-[#0F172A]">GiveArm</p>
          <p className="text-xs font-medium text-slate-500">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-50 text-[#15803D]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                {item.label}
              </span>
              {item.id === "causes" && pendingApprovals > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {pendingApprovals}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trust status</p>
          <p className="mt-1 text-sm font-medium text-slate-700">All systems operational</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Secure & monitored
          </div>
        </div>
      </div>
    </aside>
  );
}
