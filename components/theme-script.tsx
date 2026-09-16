"use client";

// Applies the stored theme class before first paint. Runs as real JS only in
// the server-rendered HTML; on client renders it's text/plain so React never
// warns about a script tag it can't execute (see Next docs: preventing-flash-
// before-hydration).
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){var c=document.documentElement.classList;c.remove("dark","light");c.add(t)}}catch(e){}})()`;

export function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  );
}
