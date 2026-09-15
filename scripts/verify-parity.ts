/**
 * Content parity check, run as `pnpm check:content`.
 * Fails if any project/post lacks a locale, has invalid meta/frontmatter,
 * or references an image that doesn't exist under public/.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";
import {
  LOCALES,
  LocalizedDocSchema,
  PostMetaSchema,
  ProjectMetaSchema,
} from "../lib/content/schema";

const ROOT = process.cwd();
const errors: string[] = [];

function checkCollection(
  collection: "projects" | "posts",
  metaSchema: typeof ProjectMetaSchema | typeof PostMetaSchema,
) {
  const base = path.join(ROOT, "content", collection);
  if (!fs.existsSync(base)) {
    console.warn(`(skip) content/${collection} does not exist yet`);
    return 0;
  }
  const dirs = fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const d of dirs) {
    const dir = path.join(base, d.name);
    const rel = `content/${collection}/${d.name}`;

    const metaFile = path.join(dir, "meta.yaml");
    if (!fs.existsSync(metaFile)) {
      errors.push(`${rel}: missing meta.yaml`);
      continue;
    }
    const parsed = metaSchema.safeParse({
      slug: d.name,
      ...(loadYaml(fs.readFileSync(metaFile, "utf8")) as object),
    });
    if (!parsed.success) {
      errors.push(`${rel}/meta.yaml: ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
    } else if ("images" in parsed.data) {
      for (const img of parsed.data.images) {
        if (
          img.src.startsWith("/") &&
          !fs.existsSync(path.join(ROOT, "public", img.src))
        ) {
          errors.push(`${rel}: image not found in public/: ${img.src}`);
        }
      }
    }

    for (const locale of LOCALES) {
      const mdx = path.join(dir, `${locale}.mdx`);
      if (!fs.existsSync(mdx)) {
        errors.push(`${rel}: missing ${locale}.mdx`);
        continue;
      }
      const { data, content } = matter(fs.readFileSync(mdx, "utf8"));
      const doc = LocalizedDocSchema.safeParse(data);
      if (!doc.success) {
        errors.push(`${rel}/${locale}.mdx frontmatter: ${doc.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
      }
      if (!content.trim()) {
        errors.push(`${rel}/${locale}.mdx: empty body`);
      }
    }
  }
  return dirs.length;
}

const nProjects = checkCollection("projects", ProjectMetaSchema);
const nPosts = checkCollection("posts", PostMetaSchema);

if (errors.length) {
  console.error(`✗ content check failed (${errors.length} errors):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ content ok: ${nProjects} projects, ${nPosts} posts, both locales`);
