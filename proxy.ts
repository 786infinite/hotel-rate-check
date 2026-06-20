import { NextRequest, NextResponse } from "next/server";

// Staff-only paths behind Basic Auth. NOTE: /api/payments/webhook and
// /api/payments/status stay PUBLIC (Stripe calls the webhook; the customer
// status page polls status) — only the price-setting create-checkout is locked.
const PROTECTED_PATHS = [
  "/quote-link-builder",
  "/rate-search",
  "/api/tbo",
  "/api/payments/create-checkout",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Hotel Rate Check Internal"',
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

function notConfiguredResponse() {
  return new NextResponse("Internal page protection is not configured.", {
    status: 503,
    headers: {
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

function getBasicAuthCredentials(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return null;
  }

  const encodedCredentials = authHeader.replace("Basic ", "").trim();

  try {
    const decodedCredentials = atob(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decodedCredentials.slice(0, separatorIndex),
      password: decodedCredentials.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const adminUsername = process.env.HRC_ADMIN_USERNAME;
  const adminPassword = process.env.HRC_ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return notConfiguredResponse();
  }

  const credentials = getBasicAuthCredentials(request);

  if (
    !credentials ||
    credentials.username !== adminUsername ||
    credentials.password !== adminPassword
  ) {
    return unauthorizedResponse();
  }

  const response = NextResponse.next();

  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");

  return response;
}

export const config = {
  matcher: [
    "/quote-link-builder/:path*",
    "/rate-search/:path*",
    "/api/tbo/:path*",
    "/api/payments/create-checkout",
  ],
};
