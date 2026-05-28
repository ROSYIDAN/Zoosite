"use client";

import "./panda-sprite.css";
import { cn } from "@/lib/utils";

type SpriteSize = "sm" | "md" | "lg" | "xl";
type SpriteSpeed = "slow" | "normal" | "fast";

interface PandaSpriteProps {
  /** Rendered size of each frame: sm=128px, md=192px, lg=256px, xl=384px */
  size?: SpriteSize;
  /** Animation speed: slow=1.6s, normal=1s, fast=0.5s */
  speed?: SpriteSpeed;
  /** Adds a gentle up/down floating motion */
  enableFloat?: boolean;
  /** Additional className for the outer wrapper */
  className?: string;
}

export default function PandaSprite({
  size = "lg",
  speed = "normal",
  enableFloat = false,
  className,
}: PandaSpriteProps) {
  return (
    <div
      className={cn(
        "panda-wrapper",
        enableFloat && "panda-wrapper--float",
        className
      )}
    >
      <div
        className={cn(
          "panda-sprite",
          `panda-sprite--${size}`,
          `panda-sprite--${speed}`
        )}
      />
    </div>
  );
}
