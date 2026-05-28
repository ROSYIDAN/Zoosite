"use client";

import { cn } from "@/lib/utils";

interface NavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
  lastFetched?: string;
}

export default function NavigationControls({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  lastFetched,
}: NavigationControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight text-primary font-headline">
          Trending Research
        </h2>
        {lastFetched && (
          <span className="text-[10px] text-on-surface-variant font-medium opacity-60">
            Last updated: {new Date(lastFetched).toLocaleTimeString()}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <NavigationButton
          icon="chevron_left"
          label="Previous"
          onClick={onPrev}
          disabled={prevDisabled}
        />
        <NavigationButton
          icon="chevron_right"
          label="Next"
          onClick={onNext}
          disabled={nextDisabled}
        />
      </div>
    </div>
  );
}

function NavigationButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-8 h-8 rounded-full border flex items-center justify-center transition-colors shrink-0",
        disabled
          ? "border-outline-variant/30 text-outline-variant/30 cursor-not-allowed"
          : "border-outline-variant hover:bg-surface-container text-primary"
      )}
      title={label}
    >
      <span className="material-symbols-outlined text-sm">{icon}</span>
    </button>
  );
}
