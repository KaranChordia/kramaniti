import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Kramaniti | Practical AI Systems for Brand Growth",
  description: "Kramaniti helps brands identify high-impact workflows, build practical AI infrastructure, and turn those systems into clear brand communication.",
  manifest: "/manifest.json",
  icons: {
    icon: "/kramaniti/assets/brand/kramaniti-mark-gold.png",
    apple: "/kramaniti/assets/brand/kramaniti-mark-gold.png",
    shortcut: "/kramaniti/assets/brand/kramaniti-mark-gold.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kramaniti"
  }
};

export const viewport = {
  themeColor: "#0A0A0F",
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
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const colorScheme = localStorage.getItem("kramaniti-theme");
              document.documentElement.setAttribute("data-theme", colorScheme || "dark");
            } catch (e) {}
          `}
        </Script>
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
