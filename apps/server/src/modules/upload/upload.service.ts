import { env } from "@dniproanimals/env";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
);

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024;

export const uploadService = {
  async uploadImage(input: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
  }) {
    if (!ALLOWED_TYPES.includes(input.mimeType)) {
      throw new Error("Only images are allowed (JPEG, PNG, WebP, GIF)");
    }
    if (input.buffer.byteLength > MAX_SIZE) {
      throw new Error("File is too large (max 10MB)");
    }

    const ext = input.filename.split(".").pop() || "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("photos")
      .upload(name, input.buffer, {
        contentType: input.mimeType,
        upsert: false,
      });
    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("photos").getPublicUrl(name);
    return { url: data.publicUrl };
  },
};
