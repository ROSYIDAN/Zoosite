import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * QuickActions component for landing on high-interest pages.
 * Following FE System Law: kebab-case filename, smart domain component in features.
 */
export default function QuickActions() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ActionCard
        href="/regions"
        icon="public"
        title="Browse Regions"
        description="Global biodiversity maps"
        containerColor="bg-primary-fixed"
        iconColor="text-primary"
      />

      <ActionCard
        href="/habitats"
        icon="eco"
        title="Browse Habitats"
        description="Explore by ecosystem"
        containerColor="bg-secondary-fixed"
        iconColor="text-on-secondary-container"
      />

      <ActionCard
        href="/favorites"
        icon="favorite"
        title="My Zoo"
        description="Your saved animals"
        containerColor="bg-tertiary-fixed"
        iconColor="text-red-700"
      />
    </section>
  );
}

interface ActionCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  containerColor: string;
  iconColor: string;
}

/**
 * Sub-component for individual quick action cards.
 * DRY principle: extracted repeating JSX.
 */
function ActionCard({
  href,
  icon,
  title,
  description,
  containerColor,
  iconColor,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "bg-surface-container-low p-6 rounded-2xl flex items-center gap-4 hover:bg-surface-container-high transition-colors cursor-pointer group"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform",
          containerColor,
          iconColor
        )}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-on-surface font-headline">{title}</h3>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
    </Link>
  );
}
