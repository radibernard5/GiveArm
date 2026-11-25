"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminCreator, AdminDonor } from "@/lib/admin-data";
import { updateCreator, updateDonor } from "@/lib/supabase-admin";

interface Props {
  donors: AdminDonor[];
  creators: AdminCreator[];
  search: string;
  onPersist?: () => Promise<void> | void;
  setDonors?: React.Dispatch<React.SetStateAction<AdminDonor[]>>;
  setCreators?: React.Dispatch<React.SetStateAction<AdminCreator[]>>;
}

export default function DonorsDirectory({ donors, creators, search }: Props) {
  // Note: parent owns state; we mutate via callbacks passed through a simpler pattern below by re-render.
  // For simplicity, we use local no-op fallback; actual persistence is handled by optimistic UI in parent via key props.
  return <DirectoryInner donors={donors} creators={creators} search={search} />;
}

function DirectoryInner({ donors: initialDonors, creators: initialCreators, search }: { donors: AdminDonor[]; creators: AdminCreator[]; search: string }) {
  const [donors, setDonors] = useMemoState(initialDonors);
  const [creators, setCreators] = useMemoState(initialCreators);

  const filteredDonors = useMemo(() => donors.filter((d) => {
    const q = search.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q);
  }), [donors, search]);
  const filteredCreators = useMemo(() => creators.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.organization.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  }), [creators, search]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Donors & Campaign Creators</h1><p className="text-sm text-slate-500">Manage donor relationships and campaign organizer access.</p></div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Donor Directory</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="pb-3">Donor</th><th className="pb-3">Total Given</th><th className="pb-3">Donations</th><th className="pb-3">Type</th><th className="pb-3">Last Donation</th><th className="pb-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonors.map((d) => (
                <tr key={d.id}>
                  <td className="py-3"><p className="font-medium text-slate-900">{d.name}</p><p className="text-xs text-slate-500">{d.email}</p></td>
                  <td className="py-3 font-semibold">₵{d.totalGiven.toLocaleString()}</td>
                  <td className="py-3">{d.donations}</td>
                  <td className="py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{d.type}</span></td>
                  <td className="py-3 text-slate-500">{d.lastDonation}</td>
                  <td className="py-3"><button onClick={async () => { const status = d.status === "Active" ? "Inactive" : "Active"; setDonors((prev) => prev.map((x) => x.id === d.id ? { ...x, status } : x)); await updateDonor(d.id, { status }); }} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${d.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{d.status}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Campaign Creators / Organizers</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="pb-3">Creator</th><th className="pb-3">Organization</th><th className="pb-3">Campaigns</th><th className="pb-3">Verification</th><th className="pb-3">Access</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCreators.map((c) => (
                <tr key={c.id}>
                  <td className="py-3"><p className="font-medium text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.email}</p></td>
                  <td className="py-3 text-slate-600">{c.organization}</td>
                  <td className="py-3">{c.campaigns}</td>
                  <td className="py-3"><button onClick={async () => { const verified = !c.verified; setCreators((prev) => prev.map((x) => x.id === c.id ? { ...x, verified } : x)); await updateCreator(c.id, { verified }); }} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{c.verified ? "Verified" : "Unverified"}</button></td>
                  <td className="py-3"><button onClick={async () => { const status = c.status === "Active" ? "Suspended" : "Active"; setCreators((prev) => prev.map((x) => x.id === c.id ? { ...x, status } : x)); await updateCreator(c.id, { status }); }} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.status === "Active" ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-700"}`}>{c.status}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function useMemoState<T>(incoming: T[]): [T[], React.Dispatch<React.SetStateAction<T[]>>] {
  const [state, setState] = useState(incoming);
  useEffect(() => { setState(incoming); }, [incoming]);
  return [state, setState];
}
