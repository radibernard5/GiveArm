"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar, { AdminModule } from "@/components/admin/AdminSidebar";
import OverviewDashboard from "@/components/admin/OverviewDashboard";
import CausesManagement from "@/components/admin/CausesManagement";
import DonationsLedger from "@/components/admin/DonationsLedger";
import DonorsDirectory from "@/components/admin/DonorsDirectory";
import PayoutsDisbursement from "@/components/admin/PayoutsDisbursement";
import PlatformSettings from "@/components/admin/PlatformSettings";
import { donationChart, AdminCause, AdminDonation, AdminDonor, AdminCreator, Payout } from "@/lib/admin-data";
import { loadAdminData } from "@/lib/supabase-admin";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [active, setActive] = useState<AdminModule>("overview");
  const [search, setSearch] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [causes, setCauses] = useState<AdminCause[]>([]);
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [donors, setDonors] = useState<AdminDonor[]>([]);
  const [creators, setCreators] = useState<AdminCreator[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  useEffect(() => {
    setAuthed(sessionStorage.getItem("givearm_admin_authed") === "1");
    setAuthChecked(true);
  }, []);

  const refresh = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await loadAdminData();
      setCauses(data.causes);
      setDonations(data.donations);
      setPayouts(data.payouts);
      setDonors(data.donors);
      setCreators(data.creators);
      if (data.errors.length) setLoadError(data.errors.join(" | "));
    } catch (e: any) {
      setLoadError(e?.message || "Failed to load admin data from Supabase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) refresh();
  }, [authed]); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo(() => {
    const totalRaised = causes.reduce((s, c) => s + c.raised, 0);
    const activeCauses = causes.filter((c) => c.status === "Active").length;
    const pendingApprovals = causes.filter((c) => c.status === "Pending Approval").length;
    const monthDonations = donations.filter((d) => d.status === "Completed").reduce((s, d) => s + d.amount, 0);
    return { totalRaised, activeCauses, pendingApprovals, donors: donors.length, monthDonations };
  }, [causes, donations, donors]);

  const chart = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of donations) {
      const key = d.date ? d.date.slice(0, 7) : "";
      if (!key) continue;
      map.set(key, (map.get(key) || 0) + Number(d.amount || 0));
    }
    const entries = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
    return entries.length ? entries.map(([m, amount]) => ({ month: m.slice(5), amount })) : donationChart;
  }, [donations]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === "geniusradi@gmail.com" && password === "Saucepan14") {
      sessionStorage.setItem("givearm_admin_authed", "1");
      setAuthed(true);
      setLoginError("");
    } else setLoginError("Invalid username or password.");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("givearm_admin_authed");
    setAuthed(false);
    setPassword("");
  };

  if (!authChecked) return <div className="min-h-screen bg-[#F8FAFC]" />;

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#dcfce7,_#F8FAFC_45%,_#e2e8f0)] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#15803D] text-lg font-bold text-white">GA</div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0D9488]">GiveArm Admin</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#0F172A]">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500">Access the GiveArm management dashboard.</p>
          </div>
          <div className="space-y-4">
            <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#15803D] focus:bg-white" placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#15803D] focus:bg-white" placeholder="Password" required />
            {loginError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{loginError}</p>}
            <button type="submit" className="w-full rounded-xl bg-[#15803D] px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#166534]">Sign In to Dashboard</button>
          </div>
        </form>
      </div>
    );
  }

  const nav = (
    <AdminSidebar
      active={active}
      onChange={(m) => { setActive(m); setMobileNav(false); }}
      pendingApprovals={stats.pendingApprovals}
    />
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setMobileNav((v) => !v)} className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
          {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileNav && <div className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden" onClick={() => setMobileNav(false)} />}
      <div className={`${mobileNav ? "block" : "hidden"} lg:block`}>{nav}</div>

      <div className="lg:pl-72">
        <AdminHeader search={search} onSearch={setSearch} onLogout={handleLogout} />
        <main className="p-4 sm:p-6 lg:p-8">
          {loadError && <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Supabase: {loadError}</div>}
          {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading admin data from Supabase...</div> : (
            <>
              {active === "overview" && (
                <OverviewDashboard
                  stats={stats}
                  causes={causes}
                  donations={donations}
                  chart={chart}
                  onCreateCause={() => setActive("causes")}
                  onReviewPending={() => setActive("causes")}
                />
              )}
              {active === "causes" && <CausesManagement causes={causes} setCauses={setCauses} search={search} onPersist={refresh} />}
              {active === "donations" && <DonationsLedger donations={donations} setDonations={setDonations} search={search} onPersist={refresh} />}
              {active === "donors" && <DonorsDirectory donors={donors} creators={creators} search={search} onPersist={refresh} />}
              {active === "payouts" && <PayoutsDisbursement payouts={payouts} setPayouts={setPayouts} causes={causes} onPersist={refresh} />}
              {active === "settings" && <PlatformSettings />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
