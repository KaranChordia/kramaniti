import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/clarity-circle/:path*",
        destination: "/clarity-square/:path*",
        permanent: true,
      },
      {
        source: "/api/clarity-circle/:path*",
        destination: "/api/clarity-square/:path*",
        permanent: true,
      },
    ];
  },
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
