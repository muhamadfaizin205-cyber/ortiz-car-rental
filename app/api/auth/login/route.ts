import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { compareSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !compareSync(password, user.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ id: user.id, email: user.email });

  const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
