import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
  }

  const token = signToken({ userId: user.id, username: user.username });
  const res = NextResponse.json({ user: { id: user.id, name: user.name, username: user.username } });
  res.cookies.set("token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
  return res;
}
