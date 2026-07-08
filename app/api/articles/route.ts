import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published");

  const where: any = {};
  if (published === "true") {
    where.isPublished = true;
    where.publishedAt = { lte: new Date() };
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const article = await prisma.article.create({ data });
  return NextResponse.json(article, { status: 201 });
}
