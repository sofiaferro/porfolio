"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface ProjectCarouselProps {
  images: ProjectImage[];
  fallbackImage?: string;
  fallbackAlt?: string;
}

export default function ProjectCarousel({
  images,
  fallbackImage,
  fallbackAlt = "Project image",
}: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageOrientations, setImageOrientations] = useState<boolean[]>([]);

  // Detect image orientation
  useEffect(() => {
    const detectOrientations = async () => {
      const orientations = await Promise.all(
        images.map(async (image, index) => {
          return new Promise<boolean>((resolve) => {
            const img = new window.Image();
            img.onload = () => {
              const isHorizontal = img.width > img.height;
              const isTooSmall = img.width < 400; // Minimum width threshold
              const shouldRenderAsHorizontal = isHorizontal && !isTooSmall;
              resolve(shouldRenderAsHorizontal);
            };
            img.onerror = () => {
              // Default to horizontal if we can't load the image
              resolve(true);
            };
            // Add timeout to prevent hanging
            setTimeout(() => {
              resolve(true); // Default to horizontal
            }, 5000);
            img.src = image.src;
          });
        })
      );
      setImageOrientations(orientations);
    };

    if (images.length > 0) {
      detectOrientations();
    }
  }, [images]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  // If only one image or no images, show fallback
  if (images.length <= 1) {
    const isHorizontal = imageOrientations[0] ?? true;
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
        {/* Placeholder background with cross - only visible when image doesn't fill */}
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-gray-300"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-full bg-gray-300"></div>
            </div>
          </div>
        </div>
        <div className={`absolute inset-0 ${!isHorizontal ? 'flex items-center justify-center' : 'block'}`}>
          {isHorizontal ? (
            <Image
              src={fallbackImage || images[0]?.src || "/placeholder.jpg"}
              alt={fallbackAlt || images[0]?.alt || "Project image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Image
              src={fallbackImage || images[0]?.src || "/placeholder.jpg"}
              alt={fallbackAlt || images[0]?.alt || "Project image"}
              width={400}
              height={300}
              className="object-contain max-h-full max-w-full relative z-10"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Placeholder background with cross - only visible when image doesn't fill */}
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-gray-300"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-full bg-gray-300"></div>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative w-full h-full">
        {images.map((image, index) => {
          // Default to horizontal if orientation not detected yet
          const isHorizontal = imageOrientations[index] ?? true;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              } ${!isHorizontal ? 'flex items-center justify-center' : 'block'}`}
            >
              {isHorizontal ? (
                <Image
                  src={image.src}
                  alt={image.alt || `Project image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt || `Project image ${index + 1}`}
                  width={400}
                  height={300}
                  className="object-contain max-h-full max-w-full relative z-10"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Next image"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex 
                ? "bg-white" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
