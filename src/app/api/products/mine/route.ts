import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Tizimga kirish kerak" }, { status: 401 });

  const products = await prisma.product.findMany({
    where: { userId: auth.userId },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}
