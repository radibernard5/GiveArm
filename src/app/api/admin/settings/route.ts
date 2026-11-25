import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const settings = await prisma.adminSetting.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth.error;
  const body = await req.json();
  const settings = await prisma.adminSetting.upsert({
    where: { id: "default" },
    update: {
      presets: body.presets !== undefined ? String(body.presets) : undefined,
      taxReceipt: body.taxReceipt !== undefined ? !!body.taxReceipt : undefined,
      featuredStory: body.featuredStory !== undefined ? String(body.featuredStory) : undefined,
    },
    create: {
      id: "default",
      presets: String(body.presets ?? "50,100,250,500"),
      taxReceipt: body.taxReceipt !== undefined ? !!body.taxReceipt : true,
      featuredStory: String(body.featuredStory ?? ""),
    },
  });
  return NextResponse.json({ settings });
}
