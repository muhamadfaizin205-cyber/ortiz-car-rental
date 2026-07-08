import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateBookingCode } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    include: { car: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  data.bookingCode = generateBookingCode();
  data.pickupDate = new Date(data.pickupDate);
  data.returnDate = new Date(data.returnDate);

  const booking = await prisma.booking.create({ data, include: { car: true } });
  return NextResponse.json(booking, { status: 201 });
}
