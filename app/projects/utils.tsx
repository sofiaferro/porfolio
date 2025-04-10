import React from "react";

// Basic markdown parser supporting *italic* and **bold**
export function parseDescription(text: string) {
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

  return text.split(regex).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    } else if (/^\*[^*]+\*$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    } else if (/^\[[^\]]+\]\([^)]+\)$/.test(part)) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [_, text, url] = match;
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary underline hover:text-primary/80 hover:underline-offset-4 transition-all duration-200"
            >
            {text}
          </a>
        );
      }
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

