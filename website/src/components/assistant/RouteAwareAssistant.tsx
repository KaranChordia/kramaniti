'use client';

import { usePathname } from 'next/navigation';
import { KramanitiAssistant } from './KramanitiAssistant';

const HIDDEN_ASSISTANT_ROUTES = ['/clarity-square', '/client-hub', '/hq', '/agent-simulation'];

export function RouteAwareAssistant() {
  const pathname = usePathname();
  const shouldHide = HIDDEN_ASSISTANT_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (shouldHide) return null;

  return <KramanitiAssistant />;
}
