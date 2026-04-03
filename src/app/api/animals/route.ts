import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const supabase = await createClient();

  let query = supabase.from("animals").select("*");

  const orgIdParam = params.get("org_id");
  if (orgIdParam) {
    // Dashboard: filter by specific org
    query = query.eq("org_id", Number(orgIdParam));
  } else {
    // Public: only show animals from approved orgs (or without org)
    const { data: approvedOrgs } = await supabase
      .from("organizations")
      .select("id")
      .eq("status", "approved");
    const approvedOrgIds = (approvedOrgs || []).map((o: { id: number }) => o.id);
    if (approvedOrgIds.length > 0) {
      query = query.or(`org_id.is.null,org_id.in.(${approvedOrgIds.join(",")})`);
    } else {
      query = query.is("org_id", null);
    }
  }

  const type = params.get("type");
  if (type) {
    const types = type.split(",").filter(Boolean);
    if (types.length === 1) query = query.eq("type", types[0]);
    else if (types.length > 1) query = query.in("type", types);
  }

  const sex = params.get("sex");
  if (sex) {
    const sexes = sex.split(",").filter(Boolean);
    if (sexes.length === 1) query = query.eq("sex", sexes[0]);
    else if (sexes.length > 1) query = query.in("sex", sexes);
  }

  const size = params.get("size");
  if (size) {
    const sizes = size.split(",").filter(Boolean);
    if (sizes.length === 1) query = query.eq("size", sizes[0]);
    else if (sizes.length > 1) query = query.in("size", sizes);
  }

  if (params.get("vaccinated") === "1") query = query.eq("vaccinated", true);
  if (params.get("sterilized") === "1") query = query.eq("sterilized", true);
  if (params.get("trained") === "1") query = query.eq("trained", true);

  const status = params.get("status");
  if (status) query = query.eq("status", status);

  const breed = params.get("breed");
  if (breed) {
    const breeds = breed.split(",").filter(Boolean);
    if (breeds.length === 1) query = query.eq("breed", breeds[0]);
    else if (breeds.length > 1) query = query.in("breed", breeds);
  }

  const color = params.get("color");
  if (color) {
    const colors = color.split(",").filter(Boolean);
    if (colors.length > 0) {
      const colorFilters = colors.map((c) => `color.ilike.%${c}%`).join(",");
      query = query.or(colorFilters);
    }
  }

  const q = params.get("q");
  if (q) {
    const pattern = `%${q}%`;
    query = query.or(`name.ilike.${pattern},breed.ilike.${pattern},description.ilike.${pattern}`);
  }

  switch (params.get("sort")) {
    case "name_asc": query = query.order("name", { ascending: true }); break;
    case "name_desc": query = query.order("name", { ascending: false }); break;
    case "age_asc": query = query.order("age_months", { ascending: true }); break;
    case "age_desc": query = query.order("age_months", { ascending: false }); break;
    case "oldest": query = query.order("created_at", { ascending: true }); break;
    case "weight_asc": query = query.order("weight_kg", { ascending: true }); break;
    case "weight_desc": query = query.order("weight_kg", { ascending: false }); break;
    default: query = query.order("created_at", { ascending: false });
  }

  const { data: result } = await query;
  return NextResponse.json(result || []);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = await createClient();

  const {
    name, description, type, breed, sex, age_months, weight_kg,
    size, color, vaccinated, sterilized, trained, photos, status,
    contact_name, contact_phone, contact_email, contact_instagram,
    contact_telegram, contact_facebook, contact_location,
  } = body;

  if (!name || !type) {
    return NextResponse.json(
      { error: "Ім'я та вид тварини обов'язкові" },
      { status: 400 }
    );
  }

  const user = await getSession();

  const { data: animal, error } = await supabase
    .from("animals")
    .insert({
      name,
      description: description || null,
      type,
      breed: breed || null,
      sex: sex || null,
      age_months: age_months || null,
      weight_kg: weight_kg || null,
      size: size || null,
      color: color || null,
      vaccinated: !!vaccinated,
      sterilized: !!sterilized,
      trained: !!trained,
      photos: JSON.stringify(photos || []),
      status: status || "available",
      contact_name: contact_name || null,
      contact_phone: contact_phone || null,
      contact_email: contact_email || null,
      contact_instagram: contact_instagram || null,
      contact_telegram: contact_telegram || null,
      contact_facebook: contact_facebook || null,
      contact_location: contact_location || null,
      org_id: user?.org_id || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(animal, { status: 201 });
}
