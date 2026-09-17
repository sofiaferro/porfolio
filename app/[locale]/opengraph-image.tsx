import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const site = getSite();
  const tagline =
    site.tagline[locale as "es" | "en"] ?? site.tagline.es ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0b0c09",
          color: "#e9ebe1",
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 28, color: "#6fef49", display: "flex" }}>
          svf@porfolio:~$ whoami
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            marginTop: 24,
            display: "flex",
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            fontSize: 30,
            marginTop: 24,
            opacity: 0.8,
            display: "flex",
            maxWidth: 900,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    size,
  );
}
