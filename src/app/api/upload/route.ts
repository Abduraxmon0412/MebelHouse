import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { getAuthUser } from "@/lib/auth";

const utapi = new UTApi();

export async function POST(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: "Tizimga kirish kerak" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "Fayl yuklanmadi" }, { status: 400 });

  const response = await utapi.uploadFiles(file);
  if (response.error) return NextResponse.json({ error: response.error.message }, { status: 500 });

  return NextResponse.json({ url: response.data.ufsUrl });
}
