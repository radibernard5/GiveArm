import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

function mapPayout(p: any) {
  return {
    id: p.id, cause: p.cause?.title || "Cause", beneficiary: p.beneficiary,
    available: p.available, fee: p.fee, net: p.net,
    status: String(p.status).charAt(0) + String(p.status).slice(1).toLowerCase(),
    date: p.date.toISOString().slice(0, 10),
  };
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const payouts = await prisma.payout.findMany({ include: { cause: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ payouts: payouts.map(mapPayout) });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const body = await req.json();
  const payout = await prisma.payout.create({
    data: {
      causeId: String(body.causeId),
      beneficiary: String(body.beneficiary || ""),
      available: Number(body.available || 0),
      fee: Number(body.fee || 0),
      net: Number(body.net || 0),
      status: (body.status || "SCHEDULED").toUpperCase(),
      date: body.date ? new Date(body.date) : new Date(),
    },
    include: { cause: true },
  });
  return NextResponse.json({ payout: mapPayout(payout) }, { status: 201 });
}
