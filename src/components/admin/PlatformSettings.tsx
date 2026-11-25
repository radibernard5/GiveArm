"use client";

import { useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/lib/supabase-admin";

export default function PlatformSettings() {
  const [presets, setPresets] = useState("50, 100, 250, 500");
  const [taxReceipt, setTaxReceipt] = useState(true);
  const [featuredStory, setFeaturedStory] = useState("Clean water changed everything for the Kpando community.");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await loadSettings();
        if (s) {
          setPresets(s.presets ?? presets);
          setTaxReceipt(!!s.taxReceipt);
          setFeaturedStory(s.featuredStory ?? featuredStory);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    await saveSettings({ presets, taxReceipt, featuredStory });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-extrabold text-slate-900">Content & Platform Settings</h1><p className="text-sm text-slate-500">Manage homepage content, donation presets, receipts, and admin permissions.</p></div>
      {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading settings...</div> : (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Homepage & Content</h2>
              <div className="mt-4 space-y-4">
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Featured Impact Story</label><input value={featuredStory} onChange={(e) => setFeaturedStory(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#15803D]" /></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Donation Presets (GHS)</label><input value={presets} onChange={(e) => setPresets(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#15803D]" /></div>
                <label className="flex items-center gap-3 text-sm text-slate-700"><input type="checkbox" checked={taxReceipt} onChange={(e) => setTaxReceipt(e.target.checked)} /> Enable tax receipt details on donation confirmations</label>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Admin Role Permissions</h2>
              <div className="mt-4 space-y-3">
                {[
                  ["Super Admin", "Full access to all modules, settings, and payouts"],
                  ["Campaign Manager", "Manage causes, moderation, and impact stories"],
                  ["Finance Reviewer", "View donations, export reports, and manage payouts"],
                  ["Support Agent", "View donors and respond to contact inquiries"],
                ].map(([role, desc]) => (
                  <div key={role} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div><p className="font-medium text-slate-900">{role}</p><p className="text-sm text-slate-500">{desc}</p></div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={save} className="rounded-xl bg-[#15803D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534]">Save Settings</button>
            {saved && <span className="text-sm font-medium text-emerald-700">Settings saved.</span>}
          </div>
        </>
      )}
    </div>
  );
}
