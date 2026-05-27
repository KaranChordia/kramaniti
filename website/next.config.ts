import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === '1';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  ...(isVercel ? {} : {
    basePath: '/kramaniti',
    assetPrefix: '/kramaniti/',
  })
};

export default nextConfig;
