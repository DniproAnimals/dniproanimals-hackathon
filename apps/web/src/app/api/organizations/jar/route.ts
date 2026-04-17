import { getSession } from "@/shared/lib/auth";
import { createClient } from "@/shared/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const user = await getSession();
  if (!user || !user.org_id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("owner_id")
    .eq("id", user.org_id)
    .single();

  if (!org || org.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Тільки власник може змінювати банку" },
      { status: 403 },
    );
  }

  const { monobank_jar_id } = await request.json();

  await supabase
    .from("organizations")
    .update({ monobank_jar_id: monobank_jar_id || null })
    .eq("id", user.org_id);

  return NextResponse.json({ success: true });
}
