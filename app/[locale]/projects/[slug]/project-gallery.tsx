"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface ProjectGalleryProps {
  images: ProjectImage[];
  projectTitle: string;
}

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
        <Image
          src={images[currentImageIndex].src}
          alt={
            images[currentImageIndex].alt ||
            `Imagen ${currentImageIndex + 1} de ${projectTitle}`
          }
          style={{ objectFit: "contain" }}
          fill
          className="object-cover transition-opacity duration-300"
        />

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Image Caption */}
      {images[currentImageIndex].caption && (
        <p className="text-sm text-muted-foreground mt-3 text-center font-mono">
          {images[currentImageIndex].caption}
        </p>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? "bg-primary"
                  : "bg-muted hover:bg-muted-foreground/50"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Grid (for smaller galleries) */}
      {images.length > 1 && images.length <= 6 && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentImageIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || `Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
