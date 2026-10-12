import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  async redirects() {
    return [
      // Retired Insights (Oct 2026). Each points at the closest current article.
      { source: "/insights/death-of-disconnected-ops", destination: "/insights/alignment-turns-scattered-intelligence-into-systems/", permanent: true },
      { source: "/insights/agentic-workflows-vs-basic-automation", destination: "/insights/design-the-escalation-before-the-assistant/", permanent: true },
      { source: "/insights/cinematic-standard-ai-world", destination: "/insights/the-founders-judgment-is-a-content-standard/", permanent: true },
      { source: "/insights/spatial-ai-and-the-death-of-physical-staging", destination: "/insights/audit-the-backstage-before-you-scale-the-frontstage/", permanent: true },
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
