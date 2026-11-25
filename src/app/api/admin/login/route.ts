import { NextResponse } from "next/server";
import { createSessionToken, getAdminCredentials, setSessionCookie } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const admin = getAdminCredentials();
    if (email !== admin.email || password !== admin.password) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true, email });
    setSessionCookie(res, email);
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
