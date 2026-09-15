export type TerminalEntry = { slug: string; title: string };

export type TerminalData = {
  locale: "es" | "en";
  projects: TerminalEntry[];
  posts: TerminalEntry[];
  email: string;
};

export type CommandAction =
  | { type: "print"; lines: string[] }
  | { type: "navigate"; href: string; lines: string[] }
  | { type: "theme"; value: "dark" | "light" | "system" | "toggle"; lines: string[] }
  | { type: "clear" };

const HELP: Record<TerminalData["locale"], string[]> = {
  es: [
    "comandos disponibles:",
    "  help                 esta ayuda",
    "  ls [projects|ideas]  listar contenido",
    "  cat <slug>           abrir proyecto o post",
    "  cd <ruta>            navegar (/, projects, ideas, about)",
    "  whoami               sobre sofia",
    "  lang [es|en]         cambiar idioma",
    "  theme [dark|light]   cambiar tema",
    "  contact              email de contacto",
    "  agents               superficies para agentes",
    "  clear                limpiar pantalla",
  ],
  en: [
    "available commands:",
    "  help                 this help",
    "  ls [projects|ideas]  list content",
    "  cat <slug>           open a project or post",
    "  cd <path>            navigate (/, projects, ideas, about)",
    "  whoami               about sofia",
    "  lang [es|en]         switch language",
    "  theme [dark|light]   switch theme",
    "  contact              contact email",
    "  agents               agent-facing surfaces",
    "  clear                clear screen",
  ],
};

const NOT_FOUND = {
  es: (cmd: string) => [
    `sh: ${cmd}: comando no encontrado`,
    "probá `help`",
  ],
  en: (cmd: string) => [`sh: ${cmd}: command not found`, "try `help`"],
};

function list(entries: TerminalEntry[]): string[] {
  return entries.map((e) => `  ${e.slug.padEnd(22)} ${e.title}`);
}

export function runCommand(input: string, data: TerminalData): CommandAction {
  const { locale } = data;
  const [cmd, ...args] = input.trim().split(/\s+/);
  const arg = args.join(" ").replace(/^\.?\//, "").replace(/\/$/, "");

  switch (cmd) {
    case "":
      return { type: "print", lines: [] };
    case "help":
    case "?":
      return { type: "print", lines: HELP[locale] };
    case "clear":
      return { type: "clear" };
    case "ls": {
      if (arg === "projects" || arg === "proyectos")
        return { type: "print", lines: list(data.projects) };
      if (arg === "ideas" || arg === "blog")
        return { type: "print", lines: list(data.posts) };
      return {
        type: "print",
        lines: ["projects/", "ideas/", "about", "llms.txt", "resume.json"],
      };
    }
    case "cat":
    case "open": {
      if (!arg)
        return {
          type: "print",
          lines: [locale === "es" ? "uso: cat <slug>" : "usage: cat <slug>"],
        };
      if (data.projects.some((p) => p.slug === arg))
        return {
          type: "navigate",
          href: `/projects/${arg}`,
          lines: [`→ /projects/${arg}`],
        };
      if (data.posts.some((p) => p.slug === arg))
        return { type: "navigate", href: `/blog/${arg}`, lines: [`→ /blog/${arg}`] };
      if (arg === "about" || arg === "sobre-mi")
        return { type: "navigate", href: "/about", lines: ["→ /about"] };
      return {
        type: "print",
        lines: [
          locale === "es" ? `cat: ${arg}: no existe` : `cat: ${arg}: no such entry`,
          ...list([...data.projects, ...data.posts]),
        ],
      };
    }
    case "cd": {
      const map: Record<string, string> = {
        "": "/",
        "~": "/",
        "..": "/",
        projects: "/projects",
        proyectos: "/projects",
        ideas: "/blog",
        blog: "/blog",
        about: "/about",
        "sobre-mi": "/about",
      };
      const href = map[arg];
      if (href) return { type: "navigate", href, lines: [`→ ${href}`] };
      return {
        type: "print",
        lines: [
          locale === "es"
            ? `cd: ${arg}: no existe el directorio`
            : `cd: ${arg}: no such directory`,
        ],
      };
    }
    case "whoami":
      return { type: "navigate", href: "/about", lines: ["sofia ferro → /about"] };
    case "contact":
    case "mail":
      return { type: "print", lines: [data.email] };
    case "agents":
      return {
        type: "print",
        lines: [
          "Accept: text/markdown  →  markdown",
          "*.md                   →  markdown",
          "/llms.txt              /sitemap.md",
          "/api/resume.json       /api/resume.txt",
          "/api/mcp               (MCP, streamable HTTP)",
        ],
      };
    case "lang": {
      const target = arg === "en" || arg === "es" ? arg : locale === "es" ? "en" : "es";
      return {
        type: "navigate",
        href: `__lang:${target}`,
        lines: [`lang → ${target}`],
      };
    }
    case "theme": {
      const value =
        arg === "dark" || arg === "light" || arg === "system"
          ? arg
          : ("toggle" as const);
      return { type: "theme", value, lines: [`theme → ${value}`] };
    }
    case "sudo":
      return {
        type: "print",
        lines: [
          locale === "es"
            ? "sofia no está en el archivo sudoers. este incidente será reportado."
            : "sofia is not in the sudoers file. this incident will be reported.",
        ],
      };
    default:
      return { type: "print", lines: NOT_FOUND[locale](cmd) };
  }
}
