import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

function normalizeStatus(status: string) {
  const map: Record<string, string> = {
    Draft: "DRAFT", Active: "ACTIVE", Paused: "PAUSED", Completed: "COMPLETED",
    "Pending Approval": "PENDING_APPROVAL", Rejected: "REJECTED",
  };
  return (map[status] || undefined) as any;
}

function mapCause(c: any) {
  return {
    id: c.id, title: c.title, category: c.category, summary: c.summary || "",
    story: c.description || "", imageUrl: c.imageUrl, goal: c.goalAmount || 0,
    raised: c.raisedAmount || 0, startDate: c.startDate ? c.startDate.toISOString().slice(0, 10) : "",
    endDate: c.endDate ? c.endDate.toISOString().slice(0, 10) : "", beneficiary: c.beneficiary || "",
    featured: !!c.featured, status: String(c.status || "ACTIVE").replace(/_/g, " ").replace(/\b\w/g, (m: string) => m.toUpperCase()).replace("Pending Approval", "Pending Approval"),
    submittedBy: c.submittedBy || undefined, slug: c.slug,
  };
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const body = await req.json();
  const data: any = {};
  if (body.title !== undefined) data.title = String(body.title);
  if (body.category !== undefined) data.category = String(body.category);
  if (body.summary !== undefined) data.summary = String(body.summary);
  if (body.story !== undefined) data.description = String(body.story);
  if (body.description !== undefined) data.description = String(body.description);
  if (body.imageUrl !== undefined) data.imageUrl = String(body.imageUrl);
  if (body.goal !== undefined) data.goalAmount = Number(body.goal);
  if (body.beneficiary !== undefined) data.beneficiary = String(body.beneficiary);
  if (body.startDate !== undefined) data.startDate = body.startDate ? new Date(body.startDate) : null;
  if (body.endDate !== undefined) data.endDate = body.endDate ? new Date(body.endDate) : null;
  if (body.featured !== undefined) data.featured = !!body.featured;
  if (body.status !== undefined) {
    const s = normalizeStatus(String(body.status));
    if (s) { data.status = s; data.isActive = s === "ACTIVE"; }
  }
  if (body.submittedBy !== undefined) data.submittedBy = body.submittedBy;
  const cause = await prisma.cause.update({ where: { id: params.id }, data });
  return NextResponse.json({ cause: mapCause(cause) });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  await prisma.cause.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
