import React from "react";

export function parseDescription(text: string) {
  // Soporta: **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

  return text.split(regex).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    } else if (/^\*[^*]+\*$/.test(part)) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    } else if (/^`[^`]+`$/.test(part)) {
      return (
        <code
          key={i}
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm font-mono px-1 rounded"
          >
          {part.slice(1, -1)}
        </code>
      );
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

    return <span key={i}>{part}</span>;
  });
}
