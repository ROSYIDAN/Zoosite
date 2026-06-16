"use client";

import React, { useState, useMemo } from "react";
import Image, { ImageProps } from "next/image";
import { parseMediaUrl } from "@/lib/media-utils";

// Modify the props to accept typical Next.js ImageProps, with some being optional
interface ImageWithSkeletonProps extends Omit<ImageProps, "className"> {
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  fallbackSrc?: string;
  fetchPriority?: "high" | "low" | "auto";
  isCard?: boolean;
}

export default function ImageWithSkeleton({
  src,
  alt,
  className = "",
  containerClassName = "w-full h-full",
  skeletonClassName = "bg-surface-container-high animate-pulse",
  fallbackSrc,
  priority,
  loading,
  fetchPriority,
  style,
  isCard = false,
  ...props
}: ImageWithSkeletonProps) {
  const isPriority = !!priority;

  // Parse layout hash from the original src (e.g. #fit=cover&x=30&y=20)
  const parsed = useMemo(() => {
    if (typeof src === "string") return parseMediaUrl(src);
    return {
      url: undefined,
      options: { fit: "cover" as const, x: 50, y: 50 },
      style: { objectFit: "cover" as const, objectPosition: "50% 50%" },
      cardStyle: { objectFit: "cover" as const, objectPosition: "50% 50%" }
    };
  }, [src]);

  const cleanSrc = parsed.url ?? src;

  const [isLoaded, setIsLoaded] = useState(isPriority);
  const [imgSrc, setImgSrc] = useState(cleanSrc);

  React.useEffect(() => {
    const nextClean = typeof src === "string" ? (src.split("#")[0] || src) : src;
    setImgSrc(nextClean);
    setIsLoaded(isPriority);
  }, [src, isPriority]);

  const positionClass = containerClassName?.includes("absolute") ? "" : "relative";

  // Get the style from parsed options. If isCard is true, use cardStyle. Otherwise use style.
  const targetStyle = isCard ? parsed.cardStyle : parsed.style;

  // Merge: auto-parsed hash styles as base, caller's explicit style wins
  const mergedStyle: React.CSSProperties = { ...targetStyle, ...style };

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
          unoptimized={
            (typeof imgSrc === "string" && (imgSrc.startsWith("http://") || imgSrc.startsWith("https://"))) ||
            props.unoptimized
          }
          priority={isPriority}
          loading={isPriority ? "eager" : (loading ?? "lazy")}
          fetchPriority={isPriority ? "high" : fetchPriority}
          style={mergedStyle}
          {...props}
        />
      )}
    </div>
  );
}

