/**
 * One-time Supabase export before decommissioning. Run locally:
 *   pnpm tsx scripts/export-supabase.ts
 * Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (falls back to
 * SUPABASE_ANON_KEY) from the environment or .env.local.
 * Dumps every table to content/_export/*.json and downloads any
 * Supabase Storage asset referenced in rows into public/images/blog/.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "content", "_export");
const ASSET_DIR = path.join(ROOT, "public", "images", "blog");
const TABLES = ["projects", "blog_posts", "content", "blog_comments"];

function loadDotenv() {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadDotenv();

const url = process.env.SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error(
    "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY). " +
      "Run `vercel env pull .env.local` first or set them in the environment.",
  );
  process.exit(1);
}

async function dumpTable(table: string): Promise<unknown[]> {
  const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: { apikey: key!, authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.warn(`  ! ${table}: HTTP ${res.status} ${await res.text()}`);
    return [];
  }
  return (await res.json()) as unknown[];
}

const STORAGE_RE = /https?:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/[^\s"')]+/g;

function findStorageUrls(rows: unknown[]): Set<string> {
  const found = new Set<string>();
  for (const m of JSON.stringify(rows).matchAll(STORAGE_RE)) found.add(m[0]);
  return found;
}

async function downloadAsset(assetUrl: string): Promise<string | null> {
  const name = decodeURIComponent(assetUrl.split("/").pop() ?? "asset");
  const dest = path.join(ASSET_DIR, name);
  const res = await fetch(assetUrl, {
    headers: { apikey: key!, authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.warn(`  ! asset ${assetUrl}: HTTP ${res.status}`);
    return null;
  }
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return `/images/blog/${name}`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(ASSET_DIR, { recursive: true });

  const storageUrls = new Set<string>();
  for (const table of TABLES) {
    const rows = await dumpTable(table);
    fs.writeFileSync(
      path.join(OUT, `${table}.json`),
      JSON.stringify(rows, null, 2),
    );
    for (const u of findStorageUrls(rows)) storageUrls.add(u);
    console.log(`✓ ${table}: ${rows.length} rows`);
  }

  const assetMap: Record<string, string> = {};
  for (const u of storageUrls) {
    const local = await downloadAsset(u);
    if (local) assetMap[u] = local;
  }
  fs.writeFileSync(
    path.join(OUT, "asset-map.json"),
    JSON.stringify(assetMap, null, 2),
  );
  console.log(
    `✓ ${Object.keys(assetMap).length}/${storageUrls.size} storage assets downloaded to public/images/blog/`,
  );
  console.log(`Export complete → content/_export/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
