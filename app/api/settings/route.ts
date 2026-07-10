import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(
      `SELECT value FROM site_settings WHERE key = 'homepage' LIMIT 1`
    );
    if (rows.length > 0 && rows[0].value) {
      return NextResponse.json(JSON.parse(rows[0].value));
    }
  } catch {
    // Table doesn't exist - try to create it
    try {
      await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW())`);
    } catch {}
  }
  return NextResponse.json(DEFAULT_SETTINGS);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await req.json();
    const json = JSON.stringify(settings).replace(/'/g, "''"); // escape single quotes for SQL

    // Try to create table first (idempotent)
    try {
      await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW())`);
    } catch {}

    // Use Prisma.sql tagged template to avoid pgbouncer parameter issues
    await prisma.$executeRawUnsafe(
      `INSERT INTO site_settings (key, value, updated_at) VALUES ('homepage', '${json}', NOW()) ON CONFLICT (key) DO UPDATE SET value = '${json}', updated_at = NOW()`
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Settings PUT]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
