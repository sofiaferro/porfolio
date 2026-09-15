import Image from "next/image";
import { MDXRemote } from "next-mdx-remote-client/rsc";

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt ?? caption ?? ""}
        width={1200}
        height={800}
        className="h-auto w-full border border-[var(--hairline)]"
      />
      {caption && (
        <figcaption className="mt-2 text-sm opacity-70">{caption}</figcaption>
      )}
    </figure>
  );
}

function Video({ src, title }: { src: string; title?: string }) {
  return (
    <video
      src={src}
      controls
      className="my-6 w-full border border-[var(--hairline)]"
      title={title}
    />
  );
}

const components = { Figure, Video };

export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose-terminal">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
