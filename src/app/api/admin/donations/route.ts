import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

function mapStatus(s: string) {
  if (s === "SUCCESS") return "Completed";
  if (s === "PENDING") return "Pending";
  if (s === "REFUNDED") return "Refunded";
  return "Failed";
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const donations = await prisma.donation.findMany({ include: { cause: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({
    donations: donations.map((d) => ({
      id: d.id,
      donorName: d.donorName,
      donorEmail: d.donorEmail,
      cause: d.cause?.title || "General Donation",
      amount: d.amount,
      method: d.paymentChannel === "mobile_money" ? (d.momoNetwork?.toUpperCase() || "MoMo") : "Card",
      reference: d.reference,
      status: mapStatus(d.status),
      date: d.createdAt.toISOString().slice(0, 10),
    })),
  });
}
