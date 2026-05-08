import "@dniproanimals/env/load";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bmxcvlhiiushaegvkunx.supabase.co",
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
