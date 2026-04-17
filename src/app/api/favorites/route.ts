import { getSession } from "@/shared/lib/auth";
import { createClient } from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json([]);

  const supabase = await createClient();

  const { data: favs } = await supabase
    .from("favorites")
    .select("animal_id, animals(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const result = (favs || [])
    .map((f: Record<string, unknown>) => f.animals)
    .filter(Boolean);
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { animal_id } = await request.json();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("animal_id", animal_id)
    .single();

  if (existing) {
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("animal_id", animal_id);
    return NextResponse.json({ favorited: false });
  } else {
    await supabase.from("favorites").insert({ user_id: user.id, animal_id });
    return NextResponse.json({ favorited: true });
  }
}
