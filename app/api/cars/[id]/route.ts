import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const car = await prisma.car.findUnique({
    where: { id: parseInt(params.id) },
    include: { category: true },
  });
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // Build update data with explicit field mapping and type coercion
    const data: Record<string, any> = {};

    if (body.name != null) data.name = String(body.name);
    if (body.slug != null) data.slug = String(body.slug);
    if (body.description !== undefined) data.description = body.description ? String(body.description) : null;
    if (body.seats != null) data.seats = Number(body.seats) || 4;
    if (body.fuelType != null) data.fuelType = String(body.fuelType);
    if (body.transmission != null) data.transmission = String(body.transmission);
    if (body.price != null) data.price = Number(body.price) || 0;
    if (body.priceDuration != null) data.priceDuration = String(body.priceDuration);
    if (body.notes !== undefined) data.notes = body.notes ? String(body.notes) : null;
    if (body.isAvailable !== undefined) data.isAvailable = Boolean(body.isAvailable);
    if (body.sortOrder != null) data.sortOrder = Number(body.sortOrder) || 0;
    if (body.categoryId != null) data.categoryId = Number(body.categoryId);

    // imagePath: accept base64 data URLs, regular URLs, or null
    if (body.imagePath !== undefined) {
      if (body.imagePath && typeof body.imagePath === "string" && body.imagePath.length > 0) {
        data.imagePath = body.imagePath;
      } else {
        data.imagePath = null;
      }
    }

    console.log(`[CAR UPDATE] id=${params.id}, imagePath type=${data.imagePath ? (data.imagePath.startsWith("data:") ? "base64" : "url") : "null"}, length=${data.imagePath?.length || 0}`);

    const car = await prisma.car.update({
      where: { id: parseInt(params.id) },
      data,
      include: { category: true },
    });

    console.log(`[CAR UPDATE] saved, imagePath in DB: type=${car.imagePath ? (car.imagePath.startsWith("data:") ? "base64" : "url") : "null"}, length=${car.imagePath?.length || 0}`);

    return NextResponse.json(car);
  } catch (error: any) {
    console.error("[CAR UPDATE ERROR]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.car.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
