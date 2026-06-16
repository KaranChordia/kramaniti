import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PwaRuntime } from "@/components/pwa/PwaRuntime";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Kramaniti",
  title: "Kramaniti | Practical AI Systems for Brand Growth",
  description: "Kramaniti helps brands identify high-impact workflows, build practical AI infrastructure, and turn those systems into clear brand communication.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/assets/pwa/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/assets/pwa/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/assets/pwa/favicon-32.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kramaniti",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#C9A84C",
  }
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C9A84C" },
    { media: "(prefers-color-scheme: dark)", color: "#C9A84C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark" data-scroll-behavior="smooth">
      <head>
        <meta name="color-scheme" content="dark light" />
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const colorScheme = localStorage.getItem("kramaniti-theme");
                document.documentElement.setAttribute("data-theme", colorScheme || "dark");
              } catch (e) {}
            `,
          }}
        />
        <PwaRuntime />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
