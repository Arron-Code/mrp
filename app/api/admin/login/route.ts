import { NextRequest, NextResponse } from "next/server";
import { adminCookieName, makeAdminToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json() as { password?: unknown };

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD ist auf dem Server nicht konfiguriert." },
      { status: 503 },
    );
  }

  if (typeof password !== "string" || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Passwort ist nicht korrekt." }, { status: 401 });
  }

  let token: string;
  try {
    token = makeAdminToken();
  } catch {
    return NextResponse.json(
      { error: "ADMIN_SESSION_SECRET ist auf dem Server nicht korrekt konfiguriert." },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
