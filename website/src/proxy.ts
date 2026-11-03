import { NextRequest, NextResponse } from "next/server";

const KOSH_HOSTS = new Set(["kosh.kramaniti.com", "kosh.localhost"]);
const SPASHT_HOSTS = new Set(["spasht.kramaniti.com", "spasht.localhost"]);
const PRODUCTION_MAIN_HOST = "www.kramaniti.com";
const PRODUCT_ORIGINS = {
  kosh: "https://kosh.kramaniti.com",
  spasht: "https://spasht.kramaniti.com",
} as const;

function hostnameWithoutPort(hostname: string) {
  return hostname.split(":")[0].toLowerCase();
}

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js"
  );
}

function rewriteProductPath(pathname: string, product: "kosh" | "spasht") {
  const prefix = `/${product}`;

  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    return pathname;
  }

  if (pathname.startsWith("/api/")) {
    const apiProductPrefix = `/api/${product}`;
    if (pathname === apiProductPrefix || pathname.startsWith(`${apiProductPrefix}/`)) {
      return pathname;
    }
    return `${apiProductPrefix}${pathname.slice("/api".length)}`;
  }

  return pathname === "/" ? `${prefix}/` : `${prefix}${pathname}`;
}

function redirectLegacyProductPath(request: NextRequest, hostname: string) {
  if (hostname !== PRODUCTION_MAIN_HOST) return null;

  const product = request.nextUrl.pathname.startsWith("/kosh")
    ? "kosh"
    : request.nextUrl.pathname.startsWith("/spasht")
      ? "spasht"
      : null;
  if (!product) return null;

  const destination = new URL(request.nextUrl);
  const prefix = `/${product}`;
  const remainder = request.nextUrl.pathname.slice(prefix.length) || "/";
  destination.hostname = new URL(PRODUCT_ORIGINS[product]).hostname;
  destination.pathname = remainder.startsWith("/") ? remainder : `/${remainder}`;
  return NextResponse.redirect(destination, 308);
}

export function proxy(request: NextRequest) {
  const hostname = hostnameWithoutPort(request.headers.get("host") ?? request.nextUrl.hostname);
  const legacyRedirect = redirectLegacyProductPath(request, hostname);
  if (legacyRedirect) return legacyRedirect;

  const product = KOSH_HOSTS.has(hostname)
    ? "kosh"
    : SPASHT_HOSTS.has(hostname)
      ? "spasht"
      : null;

  if (!product || isPublicAsset(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const pathname = rewriteProductPath(request.nextUrl.pathname, product);
  if (pathname === request.nextUrl.pathname) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = pathname;
  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
