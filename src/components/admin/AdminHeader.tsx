"use client";

import { Bell, LogOut, Search } from "lucide-react";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  onLogout?: () => void;
}

export default function AdminHeader({ search, onSearch, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search causes, donors, transactions..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#15803D] focus:bg-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          {onLogout && <button type="button" onClick={onLogout} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50" aria-label="Logout"><LogOut className="h-5 w-5" /></button>}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#15803D] text-sm font-bold text-white">GA</div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">GiveArm Admin</p>
              <p className="text-xs text-slate-500">admin@givearm.org</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
