import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET: public (approved only) or admin (all)
export async function GET(req: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true" && session;

  try {
    // Ensure table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        comment TEXT NOT NULL,
        is_approved BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const rows: any[] = all
      ? await prisma.$queryRawUnsafe(`SELECT * FROM reviews ORDER BY created_at DESC`)
      : await prisma.$queryRawUnsafe(`SELECT * FROM reviews WHERE is_approved = true ORDER BY created_at DESC LIMIT 20`);

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

// POST: anyone can submit a review
export async function POST(req: NextRequest) {
  try {
    const { customerName, rating, comment } = await req.json();

    if (!customerName || !comment || !rating) {
      return NextResponse.json({ error: "Name, rating, and comment are required" }, { status: 400 });
    }

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        comment TEXT NOT NULL,
        is_approved BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(
      `INSERT INTO reviews (customer_name, rating, comment) VALUES ($1, $2, $3)`,
      String(customerName), Number(rating), String(comment)
    );

    return NextResponse.json({ success: true, message: "Thank you! Your review will appear after approval." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: admin approve/reject
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, isApproved } = await req.json();
  await prisma.$executeRawUnsafe(
    `UPDATE reviews SET is_approved = $1 WHERE id = $2`,
    Boolean(isApproved), Number(id)
  );
  return NextResponse.json({ success: true });
}

// DELETE: admin only
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.$executeRawUnsafe(`DELETE FROM reviews WHERE id = $1`, Number(id));
  return NextResponse.json({ success: true });
}
