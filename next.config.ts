import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
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
