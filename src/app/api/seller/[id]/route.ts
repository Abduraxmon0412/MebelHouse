import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const seller = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, bio: true, avatar: true },
  });

  if (!seller) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });

  const products = await prisma.product.findMany({
    where: { userId: id },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ seller, products });
}
