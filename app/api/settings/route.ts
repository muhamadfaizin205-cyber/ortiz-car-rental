import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Try to read from site_settings table
    const rows: any[] = await prisma.$queryRawUnsafe(
      `SELECT value FROM site_settings WHERE key = 'homepage' LIMIT 1`
    );
    if (rows.length > 0 && rows[0].value) {
      return NextResponse.json(JSON.parse(rows[0].value));
    }
  } catch {
    // Table might not exist yet, return defaults
  }
  return NextResponse.json(DEFAULT_SETTINGS);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await req.json();
    const json = JSON.stringify(settings);

    // Create table if not exists
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW())`
    );

    // Upsert settings
    await prisma.$executeRawUnsafe(
      `INSERT INTO site_settings (key, value, updated_at) VALUES ('homepage', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
      json
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
