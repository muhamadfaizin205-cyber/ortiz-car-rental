import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const where: any = {};
  if (category) where.category = { slug: category };

  const cars = await prisma.car.findMany({
    where,
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(cars);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const car = await prisma.car.create({
      data: {
        name: String(body.name),
        slug: String(body.slug),
        description: body.description || null,
        imagePath: body.imagePath || null,
        seats: parseInt(body.seats) || 4,
        fuelType: String(body.fuelType || "Gasoline"),
        transmission: String(body.transmission || "Automatic"),
        price: parseInt(body.price) || 0,
        priceDuration: String(body.priceDuration || "day"),
        notes: body.notes || null,
        isAvailable: body.isAvailable !== false,
        sortOrder: parseInt(body.sortOrder) || 0,
        categoryId: parseInt(body.categoryId),
      },
      include: { category: true },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error: any) {
    console.error("Car create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
