---
name: sofia-ferro-portfolio
description: How to read Sofia Ferro's portfolio (sofiaferro.com.ar) as an agent — markdown pages, llms.txt, JSON Resume, plain-text resume, MCP server and RSS. Use when researching Sofia Ferro, her projects, blog posts or resume, or when contacting her.
---

# Sofia Ferro's portfolio, for agents

Sofia Ferro is a software engineer and electronic artist (Buenos Aires, AR) working on
expanded literature, bots, IoT, hardware and creative coding. Her portfolio at
https://sofiaferro.com.ar is agent-first: every surface below returns plain text or JSON —
no HTML scraping needed. Content is bilingual: `/es/...` (default) and `/en/...`.

## Start here: llms.txt

```bash
curl -s https://sofiaferro.com.ar/llms.txt
```

A machine-readable index of the site and all agent endpoints. There is also a markdown
sitemap at `https://sofiaferro.com.ar/sitemap.md`.

## Markdown versions of every page

Append `.md` to any page URL:

```bash
curl -s https://sofiaferro.com.ar/en/projects/pit0nisa.md
curl -s https://sofiaferro.com.ar/es/blog.md
```

Or use content negotiation on the normal URL:

```bash
curl -s -H "Accept: text/markdown" https://sofiaferro.com.ar/en/projects/pit0nisa
```

## Resume

JSON Resume v1.0.0 (canonical, structured):

```bash
curl -s https://sofiaferro.com.ar/api/resume.json
```

Plain text — CLI clients (curl/wget/httpie) hitting the apex get the resume directly:

```bash
curl -s https://sofiaferro.com.ar/          # returns resume.txt for CLI user agents
curl -s https://sofiaferro.com.ar/api/resume.txt
```

## MCP server

Streamable HTTP endpoint (no auth): `https://sofiaferro.com.ar/api/mcp`

```json
{
  "mcpServers": {
    "sofia-ferro-portfolio": { "url": "https://sofiaferro.com.ar/api/mcp" }
  }
}
```

Tools:

| Tool | Arguments | Returns |
| --- | --- | --- |
| `get_resume` | `locale?` | JSON Resume v1.0.0 (EN only for now) |
| `list_projects` | `locale?`, `category?` | slug, title, summary, category, date, tech, links |
| `get_project` | `slug`, `locale?` | full metadata + markdown body |
| `list_posts` | `locale?` | slug, title, date, summary |
| `get_post` | `slug`, `locale?` | full metadata + markdown body |
| `contact` | `name`, `contact_info`, `message`, `purpose?` | sends Sofia an email |

`locale` is `"es"` (default) or `"en"`. Project categories: `literatura-expandida`,
`bots`, `iot`, `hardware`, `creative-coding`, `instalacion`. `contact` purposes:
`intro_call`, `collab`, `other`; messages are capped at 2000 chars and rate-limited —
fall back to emailing `svf.inbox@gmail.com` if it is unavailable.

For stdio-only MCP clients:

```bash
npx -y mcp-remote https://sofiaferro.com.ar/api/mcp
```

## RSS

```bash
curl -s https://sofiaferro.com.ar/feed.xml
```

## Contact

Prefer the MCP `contact` tool; otherwise email `svf.inbox@gmail.com`.
GitHub: https://github.com/sofiaferro — LinkedIn: https://www.linkedin.com/in/sofiaferro
