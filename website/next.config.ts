import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/agent-simulation",
          destination: "/agent-simulation/",
        },
        {
          source: "/KCS/",
          destination: "/KCS",
        },
      ],
    };
  },
};

export default nextConfig;
