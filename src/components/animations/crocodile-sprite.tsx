"use client";

import "./crocodile-sprite.css";
import { cn } from "@/lib/utils";

type SpriteSize = "sm" | "md" | "lg" | "xl";
type SpriteSpeed = "slow" | "normal" | "fast";

interface CrocodileSpriteProps {
  size?: SpriteSize;
  speed?: SpriteSpeed;
  enableFloat?: boolean;
  className?: string;
}

export default function CrocodileSprite({
  size = "lg",
  speed = "normal",
  enableFloat = false,
  className,
}: CrocodileSpriteProps) {
  return (
    <div className={cn("crocodile-wrapper", enableFloat && "crocodile-wrapper--float", className)}>
      <div className={cn("crocodile-sprite", `crocodile-sprite--${size}`, `crocodile-sprite--${speed}`)} />
    </div>
  );
}
