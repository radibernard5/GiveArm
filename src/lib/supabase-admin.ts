import { supabase } from "@/supabase";
import type { AdminCause, AdminCreator, AdminDonation, AdminDonor, Payout } from "@/lib/admin-data";
import { initialCauses, initialCreators, initialDonations, initialDonors, initialPayouts } from "@/lib/admin-data";

const mapCause = (r: any): AdminCause => ({
  id: String(r.id),
  title: r.title ?? "",
  category: r.category ?? "Community",
  summary: r.summary ?? "",
  story: r.story ?? "",
  imageUrl: r.image_url ?? "",
  goal: Number(r.goal ?? 0),
  raised: Number(r.raised ?? 0),
  startDate: r.start_date ?? "",
  endDate: r.end_date ?? "",
  beneficiary: r.beneficiary ?? "",
  featured: !!r.featured,
  status: r.status ?? "Draft",
  submittedBy: r.submitted_by ?? undefined,
});

const mapDonation = (r: any): AdminDonation => ({
  id: String(r.id),
  donorName: r.donor_name ?? r.name ?? "Anonymous",
  donorEmail: r.donor_email ?? r.email ?? "",
  cause: r.cause ?? "General Fund",
  amount: Number(r.amount ?? 0),
  method: r.method ?? "Card",
  reference: r.reference ?? `GA-${String(r.id)}`,
  status: r.status ?? "Completed",
  date: r.date ?? (r.created_at ? String(r.created_at).slice(0, 10) : ""),
});

const mapPayout = (r: any): Payout => ({
  id: String(r.id),
  cause: r.cause ?? "",
  beneficiary: r.beneficiary ?? "",
  available: Number(r.available ?? 0),
  fee: Number(r.fee ?? 0),
  net: Number(r.net ?? 0),
  status: r.status ?? "Scheduled",
  date: r.date ?? "",
});

const mapDonor = (r: any): AdminDonor => ({
  id: String(r.id),
  name: r.name ?? "",
  email: r.email ?? "",
  totalGiven: Number(r.total_given ?? 0),
  donations: Number(r.donations ?? 0),
  type: r.type ?? "One-time",
  lastDonation: r.last_donation ?? "",
  status: r.status ?? "Active",
});

const mapCreator = (r: any): AdminCreator => ({
  id: String(r.id),
  name: r.name ?? "",
  organization: r.organization ?? "",
  email: r.email ?? "",
  verified: !!r.verified,
  campaigns: Number(r.campaigns ?? 0),
  status: r.status ?? "Active",
});

async function seedIfEmpty(table: string, rows: any[]) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) return false;
  if ((count ?? 0) > 0) return true;
  const { error: insErr } = await supabase.from(table).insert(rows);
  return !insErr;
}

export async function loadAdminData() {
  // Seed tables if empty (first run) - keeps panel working out of the box after SQL setup
  await seedIfEmpty("causes", initialCauses.map((c) => ({
    title: c.title, category: c.category, summary: c.summary, story: c.story,
    image_url: c.imageUrl, goal: c.goal, raised: c.raised, start_date: c.startDate || null, end_date: c.endDate || null,
    beneficiary: c.beneficiary, featured: c.featured, status: c.status, submitted_by: c.submittedBy ?? null,
  })));
  await seedIfEmpty("payouts", initialPayouts.map((p) => ({
    id: p.id, cause: p.cause, beneficiary: p.beneficiary, available: p.available, fee: p.fee, net: p.net, status: p.status, date: p.date,
  })));
  await seedIfEmpty("donors", initialDonors.map((d) => ({
    id: d.id, name: d.name, email: d.email, total_given: d.totalGiven, donations: d.donations, type: d.type, last_donation: d.lastDonation, status: d.status,
  })));
  await seedIfEmpty("creators", initialCreators.map((c) => ({
    id: c.id, name: c.name, organization: c.organization, email: c.email, verified: c.verified, campaigns: c.campaigns, status: c.status,
  })));
  // Donations: try admin shape, also seed if table empty
  const { count: dCount } = await supabase.from("donations").select("*", { count: "exact", head: true });
  if ((dCount ?? 0) === 0) {
    await supabase.from("donations").insert(initialDonations.map((d) => ({
      donor_name: d.donorName, donor_email: d.donorEmail, cause: d.cause, amount: d.amount,
      method: d.method, reference: d.reference, status: d.status, date: d.date, name: d.donorName, email: d.donorEmail,
    })));
  }

  const [causesRes, donationsRes, payoutsRes, donorsRes, creatorsRes] = await Promise.all([
    supabase.from("causes").select("*").order("created_at", { ascending: false }),
    supabase.from("donations").select("*").order("created_at", { ascending: false }),
    supabase.from("payouts").select("*").order("date", { ascending: false }),
    supabase.from("donors").select("*").order("id", { ascending: true }),
    supabase.from("creators").select("*").order("id", { ascending: true }),
  ]);

  return {
    causes: (causesRes.data || []).map(mapCause),
    donations: (donationsRes.data || []).map(mapDonation),
    payouts: (payoutsRes.data || []).map(mapPayout),
    donors: (donorsRes.data || []).map(mapDonor),
    creators: (creatorsRes.data || []).map(mapCreator),
    errors: [causesRes.error, donationsRes.error, payoutsRes.error, donorsRes.error, creatorsRes.error].filter(Boolean).map((e: any) => e.message),
  };
}

const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function upsertCause(cause: AdminCause) {
  const id = isUuid(cause.id) ? cause.id : crypto.randomUUID();
  const row = {
    id, title: cause.title, category: cause.category, summary: cause.summary, story: cause.story,
    image_url: cause.imageUrl, goal: cause.goal, raised: cause.raised, start_date: cause.startDate || null, end_date: cause.endDate || null,
    beneficiary: cause.beneficiary, featured: cause.featured, status: cause.status, submitted_by: cause.submittedBy ?? null,
  };
  const res = await supabase.from("causes").upsert(row, { onConflict: "id" }).select().single();
  return { ...res, id };
}

export async function deleteCause(id: string) { return supabase.from("causes").delete().eq("id", id); }
export async function updateDonationStatus(id: string, status: string) { return supabase.from("donations").update({ status }).eq("id", id); }
export async function updatePayoutStatus(id: string, status: string) { return supabase.from("payouts").update({ status }).eq("id", id); }
export async function updateDonor(id: string, patch: Partial<AdminDonor>) {
  const row: any = {};
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.type !== undefined) row.type = patch.type;
  return supabase.from("donors").update(row).eq("id", id);
}
export async function updateCreator(id: string, patch: Partial<AdminCreator>) {
  const row: any = {};
  if (patch.verified !== undefined) row.verified = patch.verified;
  if (patch.status !== undefined) row.status = patch.status;
  return supabase.from("creators").update(row).eq("id", id);
}
export async function saveSettings(settings: { presets: string; taxReceipt: boolean; featuredStory: string }) {
  return supabase.from("admin_settings").upsert({
    id: "default",
    presets: settings.presets,
    tax_receipt: settings.taxReceipt,
    featured_story: settings.featuredStory,
  }, { onConflict: "id" });
}
export async function loadSettings() {
  const { data } = await supabase.from("admin_settings").select("*").eq("id", "default").maybeSingle();
  if (!data) return null;
  return {
    presets: data.presets ?? "50, 100, 250, 500",
    taxReceipt: !!data.tax_receipt,
    featuredStory: data.featured_story ?? "",
  };
}
