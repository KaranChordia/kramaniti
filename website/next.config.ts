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
      // Kosh moved from /library to /kosh, then to kosh.kramaniti.com. Send old links straight to the Kosh host in one hop.
      { source: "/library", destination: "https://kosh.kramaniti.com/", permanent: true },
      { source: "/library/", destination: "https://kosh.kramaniti.com/", permanent: true },
      { source: "/library/resources", destination: "https://kosh.kramaniti.com/", permanent: true },
      { source: "/library/resources/", destination: "https://kosh.kramaniti.com/", permanent: true },
      { source: "/library/resources/:id", destination: "https://kosh.kramaniti.com/:id/", permanent: true },
      { source: "/library/resources/:id/", destination: "https://kosh.kramaniti.com/:id/", permanent: true },
      { source: "/library/:path*", destination: "https://kosh.kramaniti.com/:path*", permanent: true },
      { source: "/clarity-square/:path*", destination: "/spasht/:path*", permanent: true },
      { source: "/clarity-circle/:path*", destination: "/spasht/:path*", permanent: true },
      { source: "/assets/brand/clarity-square-mark-gold.png", destination: "/assets/brand/spasht-mark-gold.png", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/api/clarity-square/:path*", destination: "/api/spasht/:path*" },
        { source: "/api/clarity-circle/:path*", destination: "/api/spasht/:path*" },
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
