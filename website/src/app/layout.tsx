import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
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
  title: "Kramaniti | AI Architect & Technology Consulting",
  description: "Bespoke AI agents and automated content engines for scaling founders and B2B SaaS firms.",
  manifest: "/manifest.json",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const colorScheme = localStorage.getItem("kramaniti-theme");
                if (colorScheme) {
                  document.documentElement.setAttribute("data-theme", colorScheme);
                } else {
                  // If no local storage, fallback to system preference
                  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
