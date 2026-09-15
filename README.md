# sofiaferro.com.ar

Portfolio personal de Sofia Ferro, construido agent-first (AX): además de la
web para humanos, cada superficie está pensada para que agentes de IA la
consuman sin fricción.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind 4 ·
next-intl (es/en) · contenido en MDX bilingüe bajo `content/` · pnpm · Vercel.

## Superficies para agentes

| Superficie | URL |
|---|---|
| Markdown por content negotiation | cualquier URL con `Accept: text/markdown` |
| Markdown por sufijo | cualquier URL + `.md` (ej. `/es/projects/pit0nisa.md`) |
| Sitemap markdown | `/sitemap.md` |
| llms.txt | `/llms.txt` |
| JSON Resume v1.0.0 | `/api/resume.json` |
| CV texto plano | `/api/resume.txt` (también `curl sofiaferro.com.ar`) |
| MCP server (streamable HTTP, sin auth) | `/api/mcp` |
| Catálogo ARD | `/.well-known/ai-catalog.json` |
| RSS | `/feed.xml` |
| Agent Skill | `.claude/skills/sofia-ferro-portfolio/` |

## Contenido

Una entrada = un directorio: `content/{projects,posts}/<slug>/{meta.yaml, es.mdx, en.mdx}`.
`meta.yaml` guarda los hechos independientes del idioma; cada `*.mdx` solo lo
traducible (title, summary) + cuerpo CommonMark. `lib/content` (schemas zod)
es la única fuente de verdad para páginas, endpoints markdown, JSON-LD,
resume, MCP y llms.txt.

```sh
pnpm dev              # desarrollo
pnpm build            # build de producción
pnpm check:content    # paridad es/en + validación de frontmatter
bash scripts/verify-ax.sh <url>   # verificación de superficies AX
```

En la web, el terminal (`` ` `` o el botón `>_`) navega con `ls`, `cat <slug>`,
`cd`, `lang`, `theme` — puro azúcar sobre las rutas reales: sin JS el sitio es
HTML semántico plano.
