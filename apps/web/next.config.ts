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

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
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
