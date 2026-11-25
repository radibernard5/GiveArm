import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const body = await req.json();
  if (body.status === "Refunded") {
    const donation = await prisma.donation.update({ where: { id: params.id }, data: { status: "REFUNDED" } });
    return NextResponse.json({ ok: true, id: donation.id, status: "Refunded" });
  }
  return NextResponse.json({ error: "Unsupported status update" }, { status: 400 });
}
