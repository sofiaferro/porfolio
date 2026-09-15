import { getPost, getProject, getPosts, getProjects } from "@/lib/content";
import { LOCALES, LocaleSchema } from "@/lib/content/schema";
import {
  renderAbout,
  renderBlogIndex,
  renderHome,
  renderMarkdownSitemap,
  renderNotFound,
  renderPost,
  renderProject,
  renderProjectsIndex,
} from "@/lib/markdown";

const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  Vary: "Accept",
} as const;

function markdown(body: string, status = 200): Response {
  return new Response(body, { status, headers: MARKDOWN_HEADERS });
}

function resolve(path: string[]): string | undefined {
  if (path.length === 1 && path[0] === "sitemap") return renderMarkdownSitemap();

  const locale = LocaleSchema.safeParse(path[0]);
  if (!locale.success) return undefined;
  const [, section, slug, ...rest] = path;
  if (rest.length > 0) return undefined;

  if (!section) return renderHome(locale.data);
  if (section === "about" && !slug) return renderAbout(locale.data);
  if (section === "projects") {
    if (!slug) return renderProjectsIndex(locale.data);
    const project = getProject(slug, locale.data);
    return project && renderProject(project, locale.data);
  }
  if (section === "blog") {
    if (!slug) return renderBlogIndex(locale.data);
    const post = getPost(slug, locale.data);
    return post && renderPost(post, locale.data);
  }
  return undefined;
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ path?: string[] }> },
): Promise<Response> {
  const { path = [] } = await ctx.params;
  const body = resolve(path);
  if (body === undefined) return markdown(renderNotFound(), 404);
  return markdown(body);
}

export function generateStaticParams(): { path: string[] }[] {
  const params: { path: string[] }[] = [{ path: ["sitemap"] }];
  for (const locale of LOCALES) {
    params.push(
      { path: [locale] },
      { path: [locale, "about"] },
      { path: [locale, "projects"] },
      { path: [locale, "blog"] },
      ...getProjects(locale).map((p) => ({
        path: [locale, "projects", p.meta.slug],
      })),
      ...getPosts(locale).map((p) => ({
        path: [locale, "blog", p.meta.slug],
      })),
    );
  }
  return params;
}
