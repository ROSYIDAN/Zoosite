"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { useSidebar } from "@/hooks/use-sidebar";

import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import Image from "next/image";

/**
 * TopNavBar component for the dashboard layout.
 * Following FE System Law: kebab-case filename, layout component in layouts.
 */
export default function TopNavBar() {
  const { isSidebarVisible } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="bg-[#fafaf5]/80 dark:bg-[#1a1c19]/80 backdrop-blur-xl docked full-width top-0 sticky z-30 shadow-[0_8px_32px_rgba(26,28,25,0.06)]">
      <div
        className={cn(
          "flex justify-between items-center w-full px-6 py-3 max-w-[1440px] mx-auto transition-all duration-300",
          isSidebarVisible ? "lg:pl-64" : "lg:pl-6"
        )}
      >
        <div className="flex items-center gap-4 lg:gap-8">
          <span className="text-xl font-bold tracking-tighter text-primary dark:text-[#d0e8c5] brand-font whitespace-nowrap">
            Arboreal Archive
          </span>
          <nav className="hidden xl:flex gap-6 font-['Plus_Jakarta_Sans'] tracking-tight">
            <NavLink href="/dashboard" active={pathname === "/dashboard"}>
              Dashboard
            </NavLink>
            <NavLink href="/animals" active={pathname.startsWith("/animals")}>
              Species Archive
            </NavLink>
            <NavLink href="/habitats" active={pathname.startsWith("/habitats")}>
              Habitats
            </NavLink>
            <NavLink href="/about" active={pathname === "/about"}>
              About
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user?.role === UserRole.ADMIN && (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-primary-container active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              Admin
            </Link>
          )}
          <HeaderAction icon="notifications" label="Notifications" />
          <HeaderAction icon="settings" label="Settings" />

          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            {user?.image ? (
              <Image
                alt={user.name ?? "User avatar"}
                src={user.image}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#d0e8c5] flex items-center justify-center text-xs font-bold text-primary">
                {user?.name?.[0] ?? user?.email?.[0] ?? "U"}
              </div>
            )}
            <span className="hidden sm:inline text-xs font-bold text-primary dark:text-[#d0e8c5]">
              {user?.name ?? user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

/**
 * Sub-component for individual top navigation links.
 */
function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "transition-colors duration-300",
        active
          ? "text-primary dark:text-[#d0e8c5] border-b-2 border-primary pb-1"
          : "text-[#1a1c19]/60 dark:text-[#fafaf5]/60 hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
}

interface HeaderActionProps {
  icon: string;
  label: string;
}

/**
 * Sub-component for header action buttons.
 */
function HeaderAction({ icon, label }: HeaderActionProps) {
  return (
    <button
      className="p-2 rounded-full hover:bg-surface-container-low dark:hover:bg-[#232621] transition-colors duration-300 text-primary"
      title={label}
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
