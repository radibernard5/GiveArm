import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const subscriber = await prisma.subscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      update: {},
      create: { email: parsed.data.email.toLowerCase() },
    });

    return NextResponse.json({ ok: true, subscriber: { id: subscriber.id, email: subscriber.email } });
  } catch (error) {
    console.error("POST /api/newsletter error", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
