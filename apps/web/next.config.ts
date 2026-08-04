import "@dniproanimals/env/load";
import { env } from "@dniproanimals/env";
import type { NextConfig } from "next";

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
