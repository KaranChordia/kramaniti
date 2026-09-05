import type { Viewport } from "next";
// Kosh reading and editing support user zoom independently of the public site's viewport.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};
export default function KoshLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
