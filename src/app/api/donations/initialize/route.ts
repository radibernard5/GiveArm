import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initializeDonationSchema } from "@/lib/validations";
import { initializePaystackTransaction } from "@/lib/paystack";
import { Prisma } from "@prisma/client";

function normalizeMomoNetwork(value?: string | null) {
  if (!value) return undefined;
  const v = value.toLowerCase();
  if (v.includes("mtn")) return "mtn" as const;
  if (v.includes("telecel") || v.includes("vod")) return "vod" as const;
  if (v.includes("at") || v.includes("atl")) return "atl" as const;
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const normalized = {
      ...body,
      momoNetwork: normalizeMomoNetwork(body.momoNetwork) ?? body.momoNetwork,
      causeId: body.causeId || undefined,
    };

    const parsed = initializeDonationSchema.safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const input = parsed.data;
    if (input.paymentChannel === "mobile_money" && !input.momoNetwork) {
      return NextResponse.json(
        { error: "Validation failed", details: { momoNetwork: ["Mobile Money network is required"] } },
        { status: 400 }
      );
    }

    let resolvedCauseId: string | null = input.causeId ?? null;
    if (resolvedCauseId) {
      const cause = await prisma.cause.findUnique({ where: { id: resolvedCauseId } });
      if (!cause || !cause.isActive) {
        return NextResponse.json({ error: "Selected cause not found" }, { status: 400 });
      }
    }

    const reference = `GA_${Date.now()}_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const donation = await prisma.donation.create({
      data: {
        reference,
        donorName: input.donorName,
        donorEmail: input.donorEmail,
        donorPhone: input.donorPhone || null,
        amount: input.amount,
        currency: input.currency,
        paymentChannel: input.paymentChannel,
        momoNetwork: input.paymentChannel === "mobile_money" ? input.momoNetwork : null,
        frequency: input.frequency,
        status: "PENDING",
        causeId: resolvedCauseId,
        metadata: (input.metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const callbackUrl = appUrl
      ? `${appUrl.replace(/\/$/, "")}/donation/callback?reference=${encodeURIComponent(reference)}`
      : undefined;

    try {
      const paystack = await initializePaystackTransaction({
        email: input.donorEmail,
        amount: input.amount,
        currency: input.currency,
        reference,
        callbackUrl,
        channels: ["card", "mobile_money"],
        metadata: {
          donationId: donation.id,
          causeId: resolvedCauseId,
          causeName: input.causeName,
          donorName: input.donorName,
          donorPhone: input.donorPhone,
          frequency: input.frequency,
          paymentChannel: input.paymentChannel,
          momoNetwork: input.momoNetwork,
          ...(input.metadata || {}),
        },
      });

      return NextResponse.json({
        authorization_url: paystack.authorization_url,
        reference: paystack.reference,
        donationId: donation.id,
      });
    } catch (err) {
      await prisma.donation.update({
        where: { id: donation.id },
        data: { status: "FAILED" },
      });
      throw err;
    }
  } catch (error) {
    console.error("POST /api/donations/initialize error", error);
    const message = error instanceof Error ? error.message : "Failed to initialize donation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
