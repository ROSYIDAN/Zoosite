"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

// Modify the props to accept typical Next.js ImageProps, with some being optional
interface ImageWithSkeletonProps extends Omit<ImageProps, "className"> {
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  fallbackSrc?: string;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = "",
  containerClassName = "w-full h-full",
  skeletonClassName = "bg-surface-container-high animate-pulse",
  fallbackSrc,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  React.useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false);
  }, [src]);
  // We don't need imgRef for Next Image since it triggers onLoad reliably even from cache
  // Next.js Image component handles complete/cache state internally very well.
  React.useEffect(() => {
    // Left empty for compatibility, Next.js handles onLoad automatically.
  }, []);

  const positionClass = containerClassName?.includes("absolute") ? "" : "relative";

  return (
    <div className={`${positionClass} overflow-hidden ${containerClassName}`}>
      {/* Skeleton / Placeholder */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isLoaded
            ? `opacity-0 pointer-events-none ${skeletonClassName.replace(/\banimate-pulse\b/g, '')}`
            : `opacity-100 ${skeletonClassName}`
          }`}
      />

      {/* Actual Image */}
      {imgSrc && (
        <Image
          src={imgSrc}
          alt={alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (fallbackSrc && imgSrc !== fallbackSrc) {
              setImgSrc(fallbackSrc);
            } else {
              setIsLoaded(true);
            }
          }}
          className={`${className} transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          {...props}
        />
      )}
    </div>
  );
}
