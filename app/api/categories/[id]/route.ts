import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(params.id) },
    include: { _count: { select: { cars: true } }, cars: { orderBy: { sortOrder: "asc" }, take: 6 } },
  });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data: Record<string, any> = {};
    if (body.name != null) data.name = String(body.name);
    if (body.slug != null) data.slug = String(body.slug);
    if (body.description !== undefined) data.description = body.description || null;
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

    const category = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data,
      include: { _count: { select: { cars: true } } },
    });
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.category.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
