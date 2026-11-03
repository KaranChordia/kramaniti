import { KOSH_URL } from "@/lib/seo";

export const metadata = {
  title: "Account recovery | Kramaniti Kosh",
  robots: { index: false, follow: false },
  alternates: { canonical: `${KOSH_URL}/account/` },
  openGraph: { url: `${KOSH_URL}/account/` },
};
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
