import { createClient } from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Файл не надано" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Дозволені лише зображення (JPEG, PNG, WebP, GIF)" },
      { status: 400 },
    );
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "Файл занадто великий (максимум 10 МБ)" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("photos")
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json(
      { error: "Помилка завантаження: " + error.message },
      { status: 500 },
    );
  }

  const { data: urlData } = supabase.storage
    .from("photos")
    .getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl });
}
