import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Studio | Kramaniti',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignStudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

