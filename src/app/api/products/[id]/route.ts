import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
      user: { select: { id: true, name: true, bio: true, avatar: true } },
    },
  });
  if (!product) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Tizimga kirish kerak" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.userId !== auth.userId) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
