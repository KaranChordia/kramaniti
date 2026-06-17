import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clarity Blueprint | Kramaniti',
  description:
    'A reflective Kramaniti blueprint that turns diagnostic answers into practical strategy, systems, and presence recommendations.',
};

export default function BlueprintLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
