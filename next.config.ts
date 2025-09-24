import type { NextConfig } from "next";

const ALLOWED_DEV_ORIGINS: string[] = process.env.ALLOWED_DEV_ORIGINS ? process.env.ALLOWED_DEV_ORIGINS.split(',') : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`https://repository-images.githubusercontent.com/**`),
      new URL('https://picsum.photos/**'),
      {protocol: 'https', hostname: 'cdn.sanity.io', port: '', pathname: '/images/**' }
    ]
  },
  allowedDevOrigins: ALLOWED_DEV_ORIGINS,
};

export default nextConfig;
