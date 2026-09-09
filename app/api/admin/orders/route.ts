import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/admin-api";
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  const orders = await prisma.order.findMany({ take: 100, orderBy: { createdAt: "desc" }, include: { table: true, items: { include: { menuItem: true } } } });
  return NextResponse.json(orders);
}
