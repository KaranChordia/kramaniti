import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  async redirects() {
    return [
      // Kosh moved from /library to /kosh. Keep every old and shared link working.
      { source: "/library", destination: "/kosh/", permanent: true },
      { source: "/library/", destination: "/kosh/", permanent: true },
      { source: "/library/resources", destination: "/kosh/", permanent: true },
      { source: "/library/resources/", destination: "/kosh/", permanent: true },
      { source: "/library/resources/:id", destination: "/kosh/:id/", permanent: true },
      { source: "/library/resources/:id/", destination: "/kosh/:id/", permanent: true },
      { source: "/library/:path*", destination: "/kosh/:path*", permanent: true },
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
