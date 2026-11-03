import { NextRequest, NextResponse } from "next/server";

const KOSH_HOSTS = new Set(["kosh.kramaniti.com", "kosh.localhost"]);
const SPASHT_HOSTS = new Set(["spasht.kramaniti.com", "spasht.localhost"]);
const PRODUCTION_MAIN_HOST = "www.kramaniti.com";
const MAIN_SITE_SECTIONS = ["/insights", "/audit", "/build", "/retainer", "/founder", "/work", "/experience"];
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

// On a product host, an old /kosh/... or /spasht/... path 308s to the clean path,
// so each page has one public URL. The rewrite below still serves it internally.
function redirectPrefixedProductPath(request: NextRequest, product: "kosh" | "spasht") {
  const prefix = `/${product}`;
  const { pathname } = request.nextUrl;
  if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) return null;
  // Internal Next.js data requests for the rewritten route must not be redirected.
  if (request.headers.has("rsc") || request.headers.has("next-router-prefetch")) return null;
  const destination = request.nextUrl.clone();
  destination.pathname = pathname.slice(prefix.length) || "/";
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

  if (product) {
    // Main-site sections linked from product pages (for example template background
    // reading) live on www, so send them there instead of a product-host 404.
    const mainSection = MAIN_SITE_SECTIONS.find(
      (section) => request.nextUrl.pathname === section || request.nextUrl.pathname.startsWith(`${section}/`),
    );
    if (mainSection && hostname.endsWith(".kramaniti.com")) {
      const destination = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${PRODUCTION_MAIN_HOST}`);
      return NextResponse.redirect(destination, 308);
    }
    const prefixedRedirect = redirectPrefixedProductPath(request, product);
    if (prefixedRedirect) return prefixedRedirect;
  }

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
