import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import yaml from "js-yaml";
import {
  type Locale,
  type ProjectMeta,
  type PostMeta,
  type LocalizedDoc,
  type Site,
  ProjectMetaSchema,
  PostMetaSchema,
  LocalizedDocSchema,
  SiteSchema,
} from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Entry<M> = {
  meta: M;
  doc: LocalizedDoc;
  /** Frontmatter-stripped markdown body — served verbatim on AX surfaces. */
  rawMarkdown: string;
};

export type Project = Entry<ProjectMeta>;
export type Post = Entry<PostMeta>;

function readYaml<T>(file: string, parse: (data: unknown) => T): T {
  const data = yaml.load(fs.readFileSync(file, "utf8"));
  return parse(data);
}

function readLocalizedMdx(dir: string, locale: Locale) {
  const { data, content } = matter(
    fs.readFileSync(path.join(dir, `${locale}.mdx`), "utf8"),
  );
  return { doc: LocalizedDocSchema.parse(data), rawMarkdown: content.trim() };
}

function loadCollection<M extends { slug: string; status: string; date: string }>(
  collection: "projects" | "posts",
  locale: Locale,
  parseMeta: (data: unknown) => M,
): Entry<M>[] {
  const base = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = path.join(base, d.name);
      const meta = parseMeta({
        slug: d.name,
        ...(yaml.load(fs.readFileSync(path.join(dir, "meta.yaml"), "utf8")) as object),
      });
      return { meta, ...readLocalizedMdx(dir, locale) };
    })
    .filter((e) => e.meta.status === "published")
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

export const getProjects = cache((locale: Locale): Project[] =>
  loadCollection("projects", locale, (d) => ProjectMetaSchema.parse(d)),
);

export const getProject = cache(
  (slug: string, locale: Locale): Project | undefined =>
    getProjects(locale).find((p) => p.meta.slug === slug),
);

export const getPosts = cache((locale: Locale): Post[] =>
  loadCollection("posts", locale, (d) => PostMetaSchema.parse(d)),
);

export const getPost = cache(
  (slug: string, locale: Locale): Post | undefined =>
    getPosts(locale).find((p) => p.meta.slug === slug),
);

export const getPage = cache(
  (name: string, locale: Locale) =>
    readLocalizedMdx(path.join(CONTENT_DIR, "pages", name), locale),
);

export const getSite = cache(
  (): Site =>
    readYaml(path.join(CONTENT_DIR, "site.yaml"), (d) => SiteSchema.parse(d)),
);

/** JSON Resume v1.0.0 — validated shape lives in content/resume.yaml. */
export const getResume = cache(
  (): Record<string, unknown> =>
    yaml.load(
      fs.readFileSync(path.join(CONTENT_DIR, "resume.yaml"), "utf8"),
    ) as Record<string, unknown>,
);
