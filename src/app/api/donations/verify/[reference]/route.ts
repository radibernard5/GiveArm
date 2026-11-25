import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackTransaction } from "@/lib/paystack";

interface RouteContext {
  params: { reference: string };
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const reference = params.reference;
    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 });
    }

    const paystackData = await verifyPaystackTransaction(reference);

    let donation = await prisma.donation.findUnique({
      where: { reference },
      include: { cause: { select: { title: true } } },
    });

    if (donation && paystackData.status === "success" && donation.status !== "SUCCESS") {
      await prisma.$transaction(async (tx) => {
        const current = await tx.donation.findUnique({ where: { reference } });
        if (!current || current.status === "SUCCESS") return;
        const updated = await tx.donation.update({
          where: { id: current.id },
          data: { status: "SUCCESS" },
        });
        if (updated.causeId) {
          const cause = await tx.cause.findUnique({ where: { id: updated.causeId } });
          if (cause && cause.currency === updated.currency) {
            await tx.cause.update({
              where: { id: cause.id },
              data: { raisedAmount: { increment: updated.amount } },
            });
          }
        }
      });
      donation = await prisma.donation.findUnique({
        where: { reference },
        include: { cause: { select: { title: true } } },
      });
    }

    if (donation && paystackData.status === "failed" && donation.status === "PENDING") {
      donation = await prisma.donation.update({
        where: { id: donation.id },
        data: { status: "FAILED" },
        include: { cause: { select: { title: true } } },
      });
    }

    return NextResponse.json({
      reference,
      paystackStatus: paystackData.status,
      donation: donation
        ? {
            id: donation.id,
            reference: donation.reference,
            donorName: donation.donorName,
            donorEmail: donation.donorEmail,
            amount: donation.amount,
            currency: donation.currency,
            paymentChannel: donation.paymentChannel,
            momoNetwork: donation.momoNetwork,
            frequency: donation.frequency,
            status: donation.status,
            causeName: donation.cause?.title ?? "General GiveArm Fund",
            createdAt: donation.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error("GET /api/donations/verify/[reference] error", error);
    const message = error instanceof Error ? error.message : "Failed to verify donation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
