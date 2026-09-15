import "@dniproanimals/env/load";
import { env } from "@dniproanimals/env";
import type { NextConfig } from "next";
import "@dniproanimals/env/load";

const remotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
];

if (process.env.R2_PUBLIC_URL) {
  const publicUrl = process.env.R2_PUBLIC_URL.replace(/\/$/, "");
  remotePatterns.push(new URL(`${publicUrl}/**`));
}

let supabaseHostname = "bmxcvlhiiushaegvkunx.supabase.co";
try {
  if (env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseHostname = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  }
} catch {
  // Fallback to default if URL is empty or invalid
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/lost-animals",
        destination: "/animals",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
