import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Geist } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PwaRuntime } from "@/components/pwa/PwaRuntime";
import { GlobalShockwave } from "@/components/GlobalShockwave";
import { RouteAwareAssistant } from "@/components/assistant/RouteAwareAssistant";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: "Kramaniti | Practical AI Systems for Business",
  description: "Kramaniti helps businesses improve their workflows, build practical AI systems, and communicate their value clearly.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Kramaniti | Practical AI Systems for Business",
    description: "Clear strategy, practical AI systems, and stronger business communication.",
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 512,
        height: 512,
        alt: "Kramaniti mark",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Kramaniti | Practical AI Systems for Business",
    description: "Clear strategy, practical AI systems, and stronger business communication.",
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
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
    "apple-mobile-web-app-title": "Kramaniti",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#C9A84C",
  }
};

export const viewport = {
  colorScheme: "light",
  themeColor: "#C9A84C",
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
    <html lang="en" suppressHydrationWarning data-theme="dark" data-scroll-behavior="smooth" className={cn("font-sans", geist.variable)}>
      <head>
        <meta name="msapplication-navbutton-color" content="#C9A84C" />
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
                localStorage.removeItem("kramaniti-theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
              } catch (e) {}
            `
          }}
        />
        <GlobalShockwave />
        <PwaRuntime />
        {children}
        <RouteAwareAssistant />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
