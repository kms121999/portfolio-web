import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`https://repository-images.githubusercontent.com/**`),
      new URL('https://picsum.photos/**')
    ]
  },
};

export default nextConfig;
