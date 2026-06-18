import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search = searchParams.get("search");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: { name: category } } : {}),
      ...(minPrice || maxPrice
        ? { price: { gte: minPrice ? Number(minPrice) : undefined, lte: maxPrice ? Number(maxPrice) : undefined } }
        : {}),
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Tizimga kirish kerak" }, { status: 401 });

  const { title, description, price, categoryId, images } = await req.json();

  if (!title || !price || !categoryId) {
    return NextResponse.json({ error: "Nomi, narxi va kategoriya kiritilishi shart" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: Number(price),
      userId: auth.userId,
      categoryId,
    },
  });

  if (images && images.length > 0) {
    for (const img of images as { url: string; isPrimary: boolean }[]) {
      await prisma.image.create({
        data: { url: img.url, isPrimary: img.isPrimary, productId: product.id },
      });
    }
  }

  return NextResponse.json({ product }, { status: 201 });
}
