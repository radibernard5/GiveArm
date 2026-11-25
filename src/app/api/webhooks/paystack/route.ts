import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getPaystackSecretKey } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const hash = crypto
      .createHmac("sha512", getPaystackSecretKey())
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: { reference?: string };
    };

    if (event.event === "charge.success" && event.data?.reference) {
      const reference = event.data.reference;

      await prisma.$transaction(async (tx) => {
        const donation = await tx.donation.findUnique({
          where: { reference },
        });

        if (!donation || donation.status === "SUCCESS") {
          return;
        }

        const updated = await tx.donation.update({
          where: { id: donation.id },
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
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("POST /api/webhooks/paystack error", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
