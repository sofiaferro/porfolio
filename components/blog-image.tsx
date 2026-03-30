"use client";

interface BlogImageProps {
  src: string;
  alt: string;
}

export default function BlogImage({ src, alt }: BlogImageProps) {
  return (
    <div className="w-full h-24 md:h-32 rounded overflow-hidden mb-3 bg-gray-100">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
