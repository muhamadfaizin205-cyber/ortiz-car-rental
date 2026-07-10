import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { image } = await req.json();
  
  if (!image || !image.startsWith("data:image/")) {
    return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
  }

  // Image is already a base64 data URL, return it directly
  // It will be stored as imagePath in the database
  return NextResponse.json({ url: image });
}
