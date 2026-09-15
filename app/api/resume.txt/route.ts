import { getResume } from "@/lib/content";

export const dynamic = "force-static";

/** The slice of the JSON Resume shape this renderer reads. */
type Resume = {
  basics?: {
    name?: string;
    label?: string;
    email?: string;
    url?: string;
    summary?: string;
    location?: { countryCode?: string; region?: string };
    profiles?: { network?: string; username?: string; url?: string }[];
  };
  skills?: { name?: string; keywords?: string[] }[];
  projects?: { name?: string; description?: string; url?: string; keywords?: string[] }[];
};

const WIDTH = 72;

function wrap(text: string, indent = ""): string {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = indent;
  for (const word of words) {
    if (line !== indent && line.length + 1 + word.length > WIDTH) {
      lines.push(line);
      line = indent;
    }
    line += (line === indent ? "" : " ") + word;
  }
  if (line.trim()) lines.push(line);
  return lines.join("\n");
}

function heading(title: string): string {
  return `${title.toUpperCase()}\n${"-".repeat(title.length)}`;
}

export function GET(): Response {
  const resume = getResume() as Resume;
  const { basics, skills = [], projects = [] } = resume;

  const name = basics?.name ?? "";
  const sections: string[] = [];

  sections.push(
    [
      "=".repeat(WIDTH),
      name.toUpperCase(),
      basics?.label ?? "",
      "=".repeat(WIDTH),
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const field = (label: string, value: string) =>
    `${`${label}:`.padEnd(10)}${value}`;
  const contact = [
    basics?.email && field("Email", basics.email),
    basics?.url && field("Web", basics.url),
    basics?.location &&
      field(
        "Location",
        [basics.location.region, basics.location.countryCode]
          .filter(Boolean)
          .join(", "),
      ),
    ...(basics?.profiles ?? []).map((p) =>
      field(p.network ?? "Profile", p.url ?? p.username ?? ""),
    ),
  ].filter((l): l is string => Boolean(l));
  sections.push(contact.join("\n"));

  if (basics?.summary) {
    sections.push(`${heading("Summary")}\n${wrap(basics.summary)}`);
  }

  if (skills.length > 0) {
    const lines = skills.map(
      (s) => `* ${s.name ?? ""}${s.keywords?.length ? `: ${s.keywords.join(", ")}` : ""}`,
    );
    sections.push(`${heading("Skills")}\n${lines.join("\n")}`);
  }

  if (projects.length > 0) {
    const blocks = projects.map((p) =>
      [
        `* ${p.name ?? ""}${p.keywords?.length ? ` [${p.keywords.join(", ")}]` : ""}`,
        p.description && wrap(p.description, "  "),
        p.url && `  ${p.url}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    sections.push(`${heading("Projects")}\n${blocks.join("\n\n")}`);
  }

  return new Response(`${sections.join("\n\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
