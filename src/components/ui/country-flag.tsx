import { cn } from "@/lib/utils";

interface CountryFlagProps {
  flag: string | null | undefined;
  alt?: string;
  className?: string;
  fallbackEmoji?: string;
}

export default function CountryFlag({
  flag,
  alt = "flag",
  className,
  fallbackEmoji = "🌍",
}: CountryFlagProps) {
  if (!flag) {
    return <span className={cn("text-xl leading-none", className)}>{fallbackEmoji}</span>;
  }

  if (flag.startsWith("http")) {
    return (
      <img
        src={flag}
        alt={alt}
        className={cn(
          "w-6 h-4 object-cover inline-block rounded border border-outline-variant/20 shrink-0",
          className
        )}
      />
    );
  }

  return <span className={cn("text-xl leading-none", className)}>{flag}</span>;
}
