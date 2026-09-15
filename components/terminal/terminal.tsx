"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { runCommand, type TerminalData } from "./commands";

type Line = { prompt?: string; text: string };

function applyTheme(value: "dark" | "light" | "system" | "toggle") {
  const root = document.documentElement;
  let next: "dark" | "light" | "system";
  if (value === "toggle") {
    const isDark =
      root.classList.contains("dark") ||
      (!root.classList.contains("light") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    next = isDark ? "light" : "dark";
  } else {
    next = value;
  }
  root.classList.remove("dark", "light");
  if (next !== "system") root.classList.add(next);
  try {
    if (next === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", next);
  } catch {}
}

export function Terminal({ data }: { data: TerminalData }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const promptLabel = `sofia@web:${pathname === "/" ? "~" : "~" + pathname}$`;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (!typing && (e.key === "`" || e.key === "º")) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const input = value;
    setValue("");
    setHistIndex(-1);
    if (input.trim()) setHistory((h) => [input, ...h].slice(0, 50));

    const action = runCommand(input, data);
    if (action.type === "clear") {
      setLines([]);
      return;
    }
    const echoed: Line[] = [
      { prompt: promptLabel, text: input },
      ...action.lines.map((text) => ({ text })),
    ];
    setLines((l) => [...l, ...echoed].slice(-200));

    if (action.type === "navigate") {
      if (action.href.startsWith("__lang:")) {
        const target = action.href.slice(7) as "es" | "en";
        router.replace(pathname, { locale: target });
      } else {
        router.push(action.href);
      }
    } else if (action.type === "theme") {
      applyTheme(action.value);
    }
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIndex + 1, history.length - 1);
      if (history[next]) {
        setHistIndex(next);
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIndex - 1;
      setHistIndex(next);
      setValue(next >= 0 ? history[next] : "");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="terminal-panel"
        className="fixed bottom-4 right-4 cursor-pointer border border-[var(--hairline)] bg-[var(--background)] px-3 py-1.5 text-sm shadow-sm hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        <span aria-hidden="true">&gt;_</span>
        <span className="sr-only">terminal</span>
      </button>

      {open && (
        <section
          id="terminal-panel"
          aria-label="terminal"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--hairline)] bg-[var(--background)]"
        >
          <div className="mx-auto max-w-3xl px-6 py-3">
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              className="max-h-56 overflow-y-auto text-sm leading-6"
            >
              {lines.length === 0 && (
                <p className="opacity-60">
                  {data.locale === "es"
                    ? "escribí `help` para ver los comandos. `esc` cierra."
                    : "type `help` to see commands. `esc` closes."}
                </p>
              )}
              {lines.map((l, i) => (
                <p key={i} className="whitespace-pre-wrap">
                  {l.prompt && (
                    <span className="text-[var(--accent)]">{l.prompt} </span>
                  )}
                  {l.text}
                </p>
              ))}
            </div>
            <form onSubmit={submit} className="mt-2 flex items-baseline gap-2">
              <label htmlFor="terminal-input" className="shrink-0 text-sm">
                <span className="text-[var(--accent)]">{promptLabel}</span>
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onInputKey}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full bg-transparent text-sm caret-[var(--accent)] outline-none"
              />
            </form>
          </div>
        </section>
      )}
    </>
  );
}
