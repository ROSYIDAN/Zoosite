import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * MobileBottomNav component for navigation on small viewports.
 * Following FE System Law: kebab-case filename, smart domain component in features.
 */
export default function MobileBottomNav() {
  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 bg-[#fafaf5]/90 backdrop-blur-xl flex justify-around items-center py-4 px-6 border-t border-outline-variant/10 z-50"
      )}
    >
      <NavItem href="/dashboard" icon="dashboard" label="Home" active />
      <NavItem href="/animals" icon="database" label="Archive" />
      <NavItem href="/regions" icon="explore" label="Explore" />
      <NavItem href="/profile" icon="person" label="Profile" />
    </nav>
  );
}

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}

/**
 * Sub-component for individual mobile navigation items.
 * DRY principle: extracted repeating JSX.
 */
function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1",
        active ? "text-primary" : "text-on-surface-variant opacity-60"
      )}
    >
      <span
        className="material-symbols-outlined"
        style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
      >
        {icon}
      </span>
      <span className="text-[10px] font-bold">{label}</span>
    </Link>
  );
}
