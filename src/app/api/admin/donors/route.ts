import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const donations = await prisma.donation.findMany({ orderBy: { createdAt: "desc" } });
  const map = new Map<string, any>();
  for (const d of donations) {
    const key = d.donorEmail.toLowerCase();
    const existing = map.get(key) || { id: key, name: d.donorName, email: d.donorEmail, totalGiven: 0, donations: 0, recurring: false, lastDonation: d.createdAt, status: "Active" };
    existing.totalGiven += d.status === "SUCCESS" ? d.amount : 0;
    existing.donations += 1;
    existing.recurring = existing.recurring || d.frequency === "monthly";
    if (d.createdAt > existing.lastDonation) existing.lastDonation = d.createdAt;
    map.set(key, existing);
  }
  const donors = Array.from(map.values()).map((d) => ({
    id: d.id, name: d.name, email: d.email, totalGiven: d.totalGiven, donations: d.donations,
    type: d.recurring ? "Recurring" : "One-time",
    lastDonation: d.lastDonation.toISOString().slice(0, 10), status: d.status,
  }));
  const creators = await prisma.cause.findMany({ where: { submittedBy: { not: null } }, select: { submittedBy: true, beneficiary: true } });
  const creatorMap = new Map<string, any>();
  for (const c of creators) {
    const name = c.submittedBy || "Unknown";
    const existing = creatorMap.get(name) || { id: name, name, organization: c.beneficiary || "—", email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@givearm.org`, verified: false, campaigns: 0, status: "Active" };
    existing.campaigns += 1;
    creatorMap.set(name, existing);
  }
  return NextResponse.json({ donors, creators: Array.from(creatorMap.values()) });
}
