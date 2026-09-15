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
  // Skip static assets, markdown negotiation targets, and API/AX endpoints.
  matcher: [
    "/((?!api|md|_next|_vercel|\\.well-known|images|mdq-cyborg|budin-cam|favicon\\.ico|robots\\.txt|sitemap.*|llms\\.txt|feed\\.xml|.*\\.md$).*)",
  ],
};
