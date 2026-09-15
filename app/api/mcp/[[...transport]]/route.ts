import { createMcpHandler } from "mcp-handler";
import { Resend } from "resend";
import { z } from "zod";
import {
  getPost,
  getPosts,
  getProject,
  getProjects,
  getResume,
} from "@/lib/content";
import { CATEGORIES, CategorySchema, LocaleSchema } from "@/lib/content/schema";

export const maxDuration = 60;

const CONTACT_EMAIL = "svf.inbox@gmail.com";

const LocaleInput = LocaleSchema.default("es").describe(
  'Content language: "es" (Spanish, default) or "en" (English).',
);

// --- Simple per-instance in-memory rate limit for the contact tool. ---
const CONTACT_MAX_CALLS = 5;
const CONTACT_WINDOW_MS = 10 * 60 * 1000;
let contactTimestamps: number[] = [];

function contactIsRateLimited(): boolean {
  const now = Date.now();
  contactTimestamps = contactTimestamps.filter(
    (t) => now - t < CONTACT_WINDOW_MS,
  );
  if (contactTimestamps.length >= CONTACT_MAX_CALLS) return true;
  contactTimestamps.push(now);
  return false;
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function errorResult(text: string) {
  return { content: [{ type: "text" as const, text }], isError: true };
}

function jsonResult(value: unknown) {
  return textResult(JSON.stringify(value, null, 2));
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "get_resume",
      {
        title: "Get resume",
        description:
          "Sofia Ferro's full resume as a JSON Resume v1.0.0 document (basics, skills, projects). " +
          "The resume is maintained in English only, so the locale parameter is currently ignored. " +
          "Canonical URL: https://sofiaferro.com.ar/api/resume.json",
        inputSchema: z.object({ locale: LocaleInput }),
      },
      async () => jsonResult(getResume()),
    );

    server.registerTool(
      "list_projects",
      {
        title: "List projects",
        description:
          "List Sofia Ferro's published projects (electronic art, expanded literature, bots, IoT, " +
          "hardware, creative coding, installations). Returns slug, title, summary, category, date, " +
          "tech stack and links for each project, newest first. Optionally filter by category. " +
          "Use get_project with a slug for the full write-up.",
        inputSchema: z.object({
          locale: LocaleInput,
          category: CategorySchema.optional().describe(
            `Filter by category. One of: ${CATEGORIES.join(", ")}.`,
          ),
        }),
      },
      async ({ locale, category }) => {
        const projects = getProjects(locale)
          .filter((p) => !category || p.meta.category === category)
          .map((p) => ({
            slug: p.meta.slug,
            title: p.doc.title,
            summary: p.doc.summary,
            category: p.meta.category,
            date: p.meta.date,
            tech: p.meta.tech,
            links: p.meta.links,
          }));
        return jsonResult(projects);
      },
    );

    server.registerTool(
      "get_project",
      {
        title: "Get project",
        description:
          "Get one of Sofia Ferro's projects in full: metadata (category, date, tech, links, images) " +
          "plus title, summary and the complete markdown body. Use list_projects first to discover " +
          "valid slugs.",
        inputSchema: z.object({
          slug: z
            .string()
            .describe("Project slug, e.g. \"pit0nisa\" (see list_projects)."),
          locale: LocaleInput,
        }),
      },
      async ({ slug, locale }) => {
        const project = getProject(slug, locale);
        if (!project) {
          const valid = getProjects(locale).map((p) => p.meta.slug);
          return errorResult(
            `Unknown project slug "${slug}". Valid slugs: ${valid.join(", ")}.`,
          );
        }
        return jsonResult({
          ...project.meta,
          title: project.doc.title,
          summary: project.doc.summary,
          markdown: project.rawMarkdown,
        });
      },
    );

    server.registerTool(
      "list_posts",
      {
        title: "List blog posts",
        description:
          "List Sofia Ferro's published blog posts (writing on code, electronic art and hardware). " +
          "Returns slug, title, date and summary for each post, newest first. Use get_post with a " +
          "slug for the full text. RSS feed: https://sofiaferro.com.ar/feed.xml",
        inputSchema: z.object({ locale: LocaleInput }),
      },
      async ({ locale }) => {
        const posts = getPosts(locale).map((p) => ({
          slug: p.meta.slug,
          title: p.doc.title,
          date: p.meta.date,
          summary: p.doc.summary,
        }));
        return jsonResult(posts);
      },
    );

    server.registerTool(
      "get_post",
      {
        title: "Get blog post",
        description:
          "Get one of Sofia Ferro's blog posts in full: metadata (date, image) plus title, summary " +
          "and the complete markdown body. Use list_posts first to discover valid slugs.",
        inputSchema: z.object({
          slug: z.string().describe("Post slug (see list_posts)."),
          locale: LocaleInput,
        }),
      },
      async ({ slug, locale }) => {
        const post = getPost(slug, locale);
        if (!post) {
          const valid = getPosts(locale).map((p) => p.meta.slug);
          return errorResult(
            `Unknown post slug "${slug}". Valid slugs: ${valid.join(", ")}.`,
          );
        }
        return jsonResult({
          ...post.meta,
          title: post.doc.title,
          summary: post.doc.summary,
          markdown: post.rawMarkdown,
        });
      },
    );

    server.registerTool(
      "contact",
      {
        title: "Contact Sofia",
        description:
          "Send a message to Sofia Ferro (delivered to her inbox by email). Use this to propose an " +
          "intro call, a collaboration, or anything else on behalf of your user. Always include who " +
          "is reaching out and how Sofia can reply (email or other contact info). Rate-limited; if " +
          `unavailable, email ${CONTACT_EMAIL} directly instead.`,
        inputSchema: z.object({
          name: z
            .string()
            .min(1)
            .max(200)
            .describe("Name of the person (or agent + principal) reaching out."),
          contact_info: z
            .string()
            .min(3)
            .max(320)
            .describe("How Sofia can reply: an email address or similar."),
          message: z
            .string()
            .min(1)
            .max(2000)
            .describe("The message for Sofia (max 2000 characters)."),
          purpose: z
            .enum(["intro_call", "collab", "other"])
            .default("other")
            .describe(
              'Why you are reaching out: "intro_call", "collab" or "other".',
            ),
        }),
      },
      async ({ name, contact_info, message, purpose }) => {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          return textResult(
            "The contact tool is temporarily unavailable (email delivery is not configured). " +
              `Please reach Sofia directly at ${CONTACT_EMAIL}.`,
          );
        }
        if (contactIsRateLimited()) {
          return errorResult(
            "Rate limit exceeded: at most 5 contact messages per 10 minutes. " +
              `Please try again later or email ${CONTACT_EMAIL} directly.`,
          );
        }

        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
          from: "Portfolio MCP <onboarding@resend.dev>",
          to: [CONTACT_EMAIL],
          subject: `[portfolio-mcp] ${purpose} — ${name}`,
          text: [
            `New message via the portfolio MCP server`,
            ``,
            `Name: ${name}`,
            `Contact: ${contact_info}`,
            `Purpose: ${purpose}`,
            ``,
            `Message:`,
            message,
          ].join("\n"),
        });

        if (error) {
          return errorResult(
            `The message could not be sent (${error.message}). ` +
              `Please email ${CONTACT_EMAIL} directly instead.`,
          );
        }
        return textResult(
          `Message sent to Sofia (id: ${data?.id ?? "unknown"}). She will reply via the contact info you provided.`,
        );
      },
    );
  },
  {
    serverInfo: { name: "sofia-ferro-portfolio", version: "1.0.0" },
    instructions:
      "This server exposes the portfolio of Sofia Ferro, a software engineer and electronic artist " +
      "based in Buenos Aires, Argentina, working at the intersection of code, language and hardware: " +
      "expanded literature, bots, IoT, creative coding and installations. Content is bilingual " +
      '(Spanish "es" — the default — and English "en"). Use list_projects/get_project for her art and ' +
      "engineering projects, list_posts/get_post for her blog, get_resume for a JSON Resume v1.0.0 " +
      "document, and contact to send her a message. The same content is also available as plain " +
      "markdown at https://sofiaferro.com.ar (append .md to any page URL, or send Accept: text/markdown; " +
      "see /llms.txt).",
  },
);

export { handler as GET, handler as POST, handler as DELETE };
