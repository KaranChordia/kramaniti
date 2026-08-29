import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Clarity Plan | Kramaniti',
  description:
    'A private Kramaniti plan that turns your answers into clear next steps for the work, the system, and the communication.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlueprintLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
