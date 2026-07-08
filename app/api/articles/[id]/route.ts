import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data: any = {};
    if (body.title !== undefined) data.title = String(body.title);
    if (body.slug !== undefined) data.slug = String(body.slug);
    if (body.content !== undefined) data.content = String(body.content);
    if (body.imagePath !== undefined) data.imagePath = body.imagePath || null;
    if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
    if (body.publishedAt !== undefined) data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    if (body.metaDescription !== undefined) data.metaDescription = body.metaDescription || null;

    const article = await prisma.article.update({ where: { id: parseInt(params.id) }, data });
    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.article.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ success: true });
}
