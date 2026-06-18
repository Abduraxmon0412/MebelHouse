import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, username, password } = await req.json();

  if (!name || !username || !password) {
    return NextResponse.json({ error: "Barcha maydonlar to'ldirilishi shart" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "Bu login band, boshqa tanlang" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, username, passwordHash },
  });

  const token = signToken({ userId: user.id, username: user.username });
  const res = NextResponse.json({ user: { id: user.id, name: user.name, username: user.username } });
  res.cookies.set("token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
  return res;
}
