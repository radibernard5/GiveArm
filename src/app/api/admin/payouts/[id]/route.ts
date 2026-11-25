import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const body = await req.json();
  const data: any = {};
  if (body.status) data.status = String(body.status).toUpperCase();
  const payout = await prisma.payout.update({ where: { id: params.id }, data, include: { cause: true } });
  return NextResponse.json({ payout: { id: payout.id, cause: payout.cause?.title, beneficiary: payout.beneficiary, available: payout.available, fee: payout.fee, net: payout.net, status: String(payout.status).charAt(0) + String(payout.status).slice(1).toLowerCase(), date: payout.date.toISOString().slice(0, 10) } });
}
