import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/admin-api";
const bodySchema = z.object({ status: z.enum(["NEW","CONFIRMED","PREPARING","SERVED","PAID","CANCELLED"]) });
export async function PUT(req: NextRequest, { params }: { params: Promise<{id:string}> }) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const { id } = await params; const { status } = bodySchema.parse(await req.json());
    const result = await prisma.$transaction(async tx => {
      const order = await tx.order.findUnique({ where: { id }, include: { items: { include: { menuItem: { include: { recipeItems: true } } } } } });
      if (!order) throw new Error("Bestellung nicht gefunden");
      if (status === "PAID" && !order.inventoryPostedAt) {
        const totals = new Map<string, number>();
        for (const oi of order.items) for (const ri of oi.menuItem.recipeItems) totals.set(ri.ingredientId, (totals.get(ri.ingredientId) || 0) + Number(ri.quantity) * oi.quantity);
        for (const [ingredientId, quantity] of totals) {
          await tx.ingredient.update({ where: { id: ingredientId }, data: { stock: { decrement: quantity } } });
          await tx.stockMovement.create({ data: { ingredientId, type: "CONSUMPTION", quantity: -quantity, reason: "Verbrauch durch bezahlte Bestellung", orderId: id } });
        }
      }
      return tx.order.update({ where: { id }, data: { status, ...(status === "PAID" && !order.inventoryPostedAt ? { inventoryPostedAt: new Date() } : {}) } });
    });
    return NextResponse.json(result);
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Aktualisierung fehlgeschlagen" }, { status: 400 }); }
}
