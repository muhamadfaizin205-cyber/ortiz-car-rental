import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  if (data.pickupDate) data.pickupDate = new Date(data.pickupDate);
  if (data.returnDate) data.returnDate = new Date(data.returnDate);

  const booking = await prisma.booking.update({
    where: { id: parseInt(params.id) },
    data,
    include: { car: true },
  });
  return NextResponse.json(booking);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.booking.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
