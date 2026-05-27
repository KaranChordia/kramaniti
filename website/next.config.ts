import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/kramaniti',
  assetPrefix: '/kramaniti/',
  trailingSlash: true,
};

export default nextConfig;
