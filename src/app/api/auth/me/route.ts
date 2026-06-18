import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, name: true, username: true, bio: true, avatar: true },
  });
  return NextResponse.json({ user });
}
