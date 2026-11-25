import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const [causes, donations] = await Promise.all([
    prisma.cause.findMany(),
    prisma.donation.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  const totalRaised = causes.reduce((s, c) => s + (c.raisedAmount || 0), 0);
  const activeCauses = causes.filter((c) => c.status === "ACTIVE").length;
  const pendingApprovals = causes.filter((c) => c.status === "PENDING_APPROVAL").length;
  const donors = new Set(donations.map((d) => d.donorEmail.toLowerCase())).size;
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthDonations = donations.filter((d) => d.status === "SUCCESS" && d.createdAt.toISOString().startsWith(monthKey)).reduce((s, d) => s + d.amount, 0);

  const byMonth = new Map<string, number>();
  for (const d of donations) {
    if (d.status !== "SUCCESS") continue;
    const k = d.createdAt.toISOString().slice(0, 7);
    byMonth.set(k, (byMonth.get(k) || 0) + d.amount);
  }
  const chart = Array.from(byMonth.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([month, amount]) => ({
    month: new Date(month + "-01").toLocaleString("en-US", { month: "short" }), amount,
  }));

  return NextResponse.json({
    stats: { totalRaised, activeCauses, pendingApprovals, donors, monthDonations },
    chart,
  });
}
