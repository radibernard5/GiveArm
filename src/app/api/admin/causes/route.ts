import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `cause-${Date.now()}`;
}

function mapCause(c: any) {
  const goal = c.goalAmount || 0;
  const raised = c.raisedAmount || 0;
  return {
    id: c.id,
    title: c.title,
    category: c.category,
    summary: c.summary || "",
    story: c.description || "",
    imageUrl: c.imageUrl,
    goal,
    raised,
    startDate: c.startDate ? c.startDate.toISOString().slice(0, 10) : "",
    endDate: c.endDate ? c.endDate.toISOString().slice(0, 10) : "",
    beneficiary: c.beneficiary || "",
    featured: !!c.featured,
    status: String(c.status || "ACTIVE").replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()).replace("Pending Approval", "Pending Approval"),
    submittedBy: c.submittedBy || undefined,
    slug: c.slug,
  };
}

function normalizeStatus(status: string) {
  const map: Record<string, string> = {
    Draft: "DRAFT", Active: "ACTIVE", Paused: "PAUSED", Completed: "COMPLETED",
    "Pending Approval": "PENDING_APPROVAL", Rejected: "REJECTED",
  };
  return (map[status] || "DRAFT") as any;
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const causes = await prisma.cause.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ causes: causes.map(mapCause) });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const body = await req.json();
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  const baseSlug = slugify(title);
  const existing = await prisma.cause.findUnique({ where: { slug: baseSlug } });
  const slug = existing ? `${baseSlug}-${Date.now().toString().slice(-5)}` : baseSlug;
  const status = normalizeStatus(String(body.status || "Draft"));
  const cause = await prisma.cause.create({
    data: {
      slug,
      title,
      category: String(body.category || "Community"),
      summary: String(body.summary || ""),
      description: String(body.story || body.description || ""),
      goalAmount: Number(body.goal || 0),
      raisedAmount: Number(body.raised || 0),
      currency: "GHS",
      imageUrl: String(body.imageUrl || ""),
      beneficiary: String(body.beneficiary || ""),
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      featured: !!body.featured,
      status,
      submittedBy: body.submittedBy ? String(body.submittedBy) : null,
      isActive: status === "ACTIVE",
    },
  });
  return NextResponse.json({ cause: mapCause(cause) }, { status: 201 });
}
