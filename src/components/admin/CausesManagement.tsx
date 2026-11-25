"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Check, X, Edit2, Pause, Play, Archive, ImageIcon } from "lucide-react";
import { AdminCause, CauseStatus } from "@/lib/admin-data";
import { deleteCause, upsertCause } from "@/lib/supabase-admin";

interface Props {
  causes: AdminCause[];
  setCauses: React.Dispatch<React.SetStateAction<AdminCause[]>>;
  search: string;
  onPersist?: () => Promise<void> | void;
}

const emptyCause: Omit<AdminCause, "id" | "raised"> = {
  title: "", category: "Education", summary: "", story: "", imageUrl: "", goal: 0,
  startDate: "", endDate: "", beneficiary: "", featured: false, status: "Draft",
};

export default function CausesManagement({ causes, setCauses, search, onPersist }: Props) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCause | null>(null);
  const [form, setForm] = useState(emptyCause);

  const filtered = useMemo(() => {
    return causes.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.beneficiary.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchCat = categoryFilter === "All" || c.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [causes, search, statusFilter, categoryFilter]);

  const pending = causes.filter((c) => c.status === "Pending Approval");
  const openCreate = () => { setEditing(null); setForm(emptyCause); setModalOpen(true); };
  const openEdit = (cause: AdminCause) => { setEditing(cause); const { id, raised, ...rest } = cause; setForm(rest); setModalOpen(true); };

  const saveCause = async () => {
    if (!form.title.trim()) return;
    if (editing) {
      const updated = { ...editing, ...form };
      const { error, id } = await upsertCause(updated);
      if (error) return alert(`Could not save cause: ${error.message}`);
      setCauses((prev) => prev.map((c) => (c.id === editing.id ? { ...updated, id } : c)));
    } else {
      const created: AdminCause = { id: `C-${Date.now().toString().slice(-6)}`, raised: 0, ...form };
      const { error, id } = await upsertCause(created);
      if (error) return alert(`Could not create cause: ${error.message}`);
      setCauses((prev) => [{ ...created, id }, ...prev]);
    }
    setModalOpen(false);
    await onPersist?.();
  };

  const updateStatus = async (id: string, status: CauseStatus) => {
    const cause = causes.find((c) => c.id === id);
    if (!cause) return;
    const { error } = await upsertCause({ ...cause, status });
    if (error) return alert(`Could not update cause: ${error.message}`);
    setCauses((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    await onPersist?.();
  };
  const featureAndApprove = async (id: string) => {
    const cause = causes.find((c) => c.id === id);
    if (!cause) return;
    const { error } = await upsertCause({ ...cause, status: "Active", featured: true });
    if (error) return alert(`Could not update cause: ${error.message}`);
    setCauses((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Active", featured: true } : c)));
    await onPersist?.();
  };
  const removeCause = async (id: string) => {
    if (!confirm("Archive/delete this cause?")) return;
    const { error } = await deleteCause(id);
    if (error) return alert(`Could not delete cause: ${error.message}`);
    setCauses((prev) => prev.filter((c) => c.id !== id));
    await onPersist?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Causes Management</h1>
          <p className="text-sm text-slate-500">Create, edit, moderate, and manage GiveArm campaigns.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#15803D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#166534]"><Plus className="h-4 w-4" /> Create New Cause</button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Cause Moderation Queue</h2>
        <p className="text-sm text-slate-500">Review user/partner-submitted causes.</p>
        <div className="mt-4 space-y-3">
          {pending.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No pending submissions. All caught up!</p>}
          {pending.map((c) => (
            <div key={c.id} className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{c.title}</p>
                <p className="text-sm text-slate-500">{c.category} • Submitted by {c.submittedBy || "Partner"} • Goal ₵{c.goal.toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => updateStatus(c.id, "Active")} className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">Approve</button>
                <button onClick={() => updateStatus(c.id, "Rejected")} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Reject</button>
                <button onClick={() => updateStatus(c.id, "Draft")} className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100">Request Changes</button>
                <button onClick={() => featureAndApprove(c.id)} className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100">Feature on Homepage</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-bold text-slate-900">All Causes</h2>
          <div className="flex flex-wrap gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} readOnly className="rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-500" placeholder="Use top search" /></div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option>All</option><option>Draft</option><option>Active</option><option>Paused</option><option>Completed</option><option>Pending Approval</option><option>Rejected</option></select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm"><option>All</option><option>Education</option><option>Healthcare</option><option>Emergency Relief</option><option>Community</option><option>Environment</option></select>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="pb-3">Cause</th><th className="pb-3">Category</th><th className="pb-3">Progress</th><th className="pb-3">Status</th><th className="pb-3">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const pct = Math.min(100, Math.round((c.raised / Math.max(c.goal, 1)) * 100));
                return (
                  <tr key={c.id}>
                    <td className="py-3"><p className="font-medium text-slate-900">{c.title}</p><p className="text-xs text-slate-500">{c.beneficiary}{c.featured ? " • Featured" : ""}</p></td>
                    <td className="py-3 text-slate-600">{c.category}</td>
                    <td className="py-3"><div className="w-44"><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#15803D]" style={{ width: `${pct}%` }} /></div><p className="mt-1 text-xs text-slate-500">₵{c.raised.toLocaleString()} / ₵{c.goal.toLocaleString()} ({pct}%)</p></div></td>
                    <td className="py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.status === "Active" ? "bg-emerald-50 text-emerald-700" : c.status === "Pending Approval" ? "bg-amber-50 text-amber-700" : c.status === "Rejected" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"}`}>{c.status}</span></td>
                    <td className="py-3"><div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" title="Edit"><Edit2 className="h-4 w-4" /></button>
                      {c.status === "Active" ? <button onClick={() => updateStatus(c.id, "Paused")} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" title="Pause"><Pause className="h-4 w-4" /></button> : <button onClick={() => updateStatus(c.id, "Active")} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" title="Activate"><Play className="h-4 w-4" /></button>}
                      <button onClick={() => removeCause(c.id)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" title="Archive"><Archive className="h-4 w-4" /></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between"><h3 className="text-xl font-bold text-slate-900">{editing ? "Edit Cause" : "Create New Cause"}</h3><button onClick={() => setModalOpen(false)} className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm sm:col-span-2" placeholder="Cause title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Education</option><option>Healthcare</option><option>Emergency Relief</option><option>Community</option><option>Environment</option></select>
              <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CauseStatus })}><option>Draft</option><option>Active</option><option>Paused</option><option>Completed</option><option>Pending Approval</option><option>Rejected</option></select>
              <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm sm:col-span-2" placeholder="Short summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              <textarea className="rounded-xl border border-slate-200 px-4 py-3 text-sm sm:col-span-2" rows={4} placeholder="Full story" value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} />
              <div className="sm:col-span-2"><input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Cover image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />{form.imageUrl && <div className="mt-2 overflow-hidden rounded-xl border border-slate-200"><img src={form.imageUrl} alt="Preview" className="h-36 w-full object-cover" /></div>}{!form.imageUrl && <div className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500"><ImageIcon className="h-4 w-4" /> Add an image URL to preview cover</div>}</div>
              <input type="number" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Target goal amount" value={form.goal || ""} onChange={(e) => setForm({ ...form, goal: Number(e.target.value) })} />
              <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Beneficiary / organization" value={form.beneficiary} onChange={(e) => setForm({ ...form, beneficiary: e.target.value })} />
              <input type="date" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              <input type="date" className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Feature on Homepage</label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
              <button onClick={saveCause} className="inline-flex items-center gap-2 rounded-xl bg-[#15803D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#166534]"><Check className="h-4 w-4" /> Save Cause</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
