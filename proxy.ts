import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intl = createIntlMiddleware(routing);

// CLI clients hitting the apex get the plain-text resume instead of HTML.
const CLI_UA = /^(curl|wget|httpie|http)\//i;

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") ?? "";

  if (pathname === "/" && CLI_UA.test(ua)) {
    return NextResponse.rewrite(new URL("/api/resume.txt", request.url));
  }

  return intl(request);
}

export const config = {
  // Skip API/AX endpoints, internals, and any path with a file extension
  // (favicons, images, robots.txt, sitemap.xml, llms.txt, *.md, …).
  matcher: ["/((?!api|md/|_next|_vercel|\\.well-known|apple-icon|.*\\..*).*)"],
};
