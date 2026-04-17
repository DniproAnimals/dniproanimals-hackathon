import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

/** Public client without cookies — safe for static generation and ISR */
export function createPublicClient() {
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from Server Component — safe to ignore
        }
      },
    },
  });
}

// Types for client-side usage
export type Animal = {
  id: number;
  name: string;
  description: string | null;
  type: string;
  breed: string | null;
  sex: string | null;
  age_months: number | null;
  weight_kg: number | null;
  size: string | null;
  color: string | null;
  vaccinated: boolean | null;
  sterilized: boolean | null;
  trained: boolean | null;
  commands: string | null;
  photos: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_instagram: string | null;
  contact_telegram: string | null;
  contact_facebook: string | null;
  contact_location: string | null;
  org_id: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type AdoptionRequest = {
  id: number;
  animal_id: number;
  name: string;
  email: string;
  phone: string;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  location: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

export type LostAnimal = {
  id: number;
  title: string;
  description: string;
  type: string;
  animal_type: string | null;
  breed: string | null;
  sex: string | null;
  color: string | null;
  size: string | null;
  location: string | null;
  last_seen_location: string | null;
  last_seen_date: string | null;
  contact_name: string;
  contact_phone: string;
  photos: string;
  resolved: boolean | null;
  created_at: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string | null;
  photo: string | null;
  description: string | null;
  phone: string | null;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  org_id: number | null;
  created_at: string;
};

export type Organization = {
  id: number;
  name: string;
  description: string | null;
  photo: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  telegram: string | null;
  facebook: string | null;
  website: string | null;
  owner_id: number;
  status: string | null;
  monobank_jar_id: string | null;
  created_at: string;
};

export type Notification = {
  id: number;
  org_id: number | null;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean | null;
  created_at: string;
};
