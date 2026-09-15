import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// uuid → slug map for blog URLs indexed under the old Supabase-era site
import legacyRedirects from "./content/_export/redirects.json";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Canonical host: apex → www, done in-app so /.well-known/* (MCP
      // Registry domain verification) and CLI clients (curl → resume.txt)
      // keep working on the bare domain.
      {
        source: "/:path((?!\\.well-known).*)",
        has: [{ type: "host", value: "sofiaferro.com.ar" }],
        missing: [
          {
            type: "header",
            key: "user-agent",
            value: "(curl|wget|HTTPie|http)/.*",
          },
        ],
        destination: "https://www.sofiaferro.com.ar/:path",
        permanent: true,
      },
      ...legacyRedirects.flatMap(({ uuid, slug }) =>
        ["es", "en"].map((locale) => ({
          source: `/${locale}/blog/${uuid}`,
          destination: `/${locale}/blog/${slug}`,
          permanent: true,
        })),
      ),
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // .md suffix URLs: /es/projects/pit0nisa.md → markdown handler
        {
          source: "/:path*.md",
          destination: "/md/:path*",
        },
        // Content negotiation: agents sending Accept: text/markdown get markdown
        {
          source: "/:path*",
          has: [{ type: "header", key: "accept", value: "(.*text/markdown.*)" }],
          destination: "/md/:path*",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Vary", value: "Accept" }],
      },
      {
        source: "/llms.txt",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
      {
        source: "/.well-known/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
