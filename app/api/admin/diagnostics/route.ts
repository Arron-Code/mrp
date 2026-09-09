import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  return NextResponse.json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    adminPassword: {
      set: typeof password === "string" && password.length > 0,
      length: password?.length ?? 0,
      hasSurroundingWhitespace: password ? password !== password.trim() : false,
      hasSurroundingQuotes: password ? /^["'].*["']$/.test(password) : false,
    },
    adminSessionSecret: {
      set: typeof secret === "string" && secret.length > 0,
      length: secret?.length ?? 0,
      longEnough: (secret?.length ?? 0) >= 32,
    },
    databaseUrl: { set: Boolean(process.env.DATABASE_URL) },
  });
}
