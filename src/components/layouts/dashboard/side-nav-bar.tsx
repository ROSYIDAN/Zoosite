"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { useSidebar } from "@/hooks/use-sidebar";
import { useQuizStore } from "@/store/quiz.store";

import { useSession, signOut } from "next-auth/react";
import { UserRole } from "@prisma/client";

/**
 * SideNavBar component for the dashboard layout.
 * Following FE System Law: kebab-case filename, layout component in layouts.
 */
export default function SideNavBar() {
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const { completedLevels } = useQuizStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAdmin = session?.user?.role === UserRole.ADMIN;
  const isUnlocked = isAdmin || (isMounted && completedLevels.includes("hard"));

  return (
    <aside
      className={cn(
        "h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-[#fafaf5] dark:bg-[#1a1c19] border-r border-[#1a1c19]/5 py-6 transition-transform duration-300 ease-in-out z-50",
        isSidebarVisible ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="px-6 mb-8 flex justify-between items-center">
        <SidebarBrand />
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-full hover:bg-[#f4f4ef] dark:hover:bg-[#232621] text-[#1a1c19]/50 dark:text-[#fafaf5]/50 transition-colors"
          title="Hide Sidebar"
        >
          <span className="material-symbols-outlined text-sm">menu_open</span>
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        <SideNavItem href="/dashboard" icon="dashboard" label="Dashboard" active={pathname === "/dashboard"} />
        <SideNavItem href="/animals" icon="database" label="Species Archive" active={pathname.startsWith("/animals")} />
        <SideNavItem href="/habitats" icon="forest" label="Habitats" active={pathname.startsWith("/habitats")} />
        <SideNavItem href="/conservation" icon="nature_people" label="Conservation" active={pathname.startsWith("/conservation")} />
        <SideNavItem href="/native-animals" icon="public" label="Native & Endemic" active={pathname.startsWith("/native-animals")} />
        
        {session?.user && (isAdmin || isMounted) && (
          <div className="mt-4 pt-4 border-t border-[#1a1c19]/5">
            <p className="px-6 mb-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Contributions</p>
            {isUnlocked ? (
              <>
                <SideNavItem href="/request-animal" icon="post_add" label="Request Animal" active={pathname === "/request-animal"} />
                <SideNavItem href="/my-requests" icon="history" label="My Requests" active={pathname === "/my-requests"} />
              </>
            ) : (
              <>
                <SideNavItem href="/request-animal" icon="help_outline" label="Mystery Submission 🔒" active={pathname === "/request-animal"} />
                <SideNavItem href="/my-requests" icon="lock" label="Mystery History 🔒" active={pathname === "/my-requests"} />
              </>
            )}
          </div>
        )}
        
        {session?.user?.role === UserRole.ADMIN && (
          <div className="mt-4 pt-4 border-t border-[#1a1c19]/5">
            <p className="px-6 mb-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Administrative</p>
            <SideNavItem href="/admin" icon="admin_panel_settings" label="Admin Console" active={pathname.startsWith("/admin")} />
          </div>
        )}
      </nav>

      <div className="px-4 mt-auto">
        <div className="mt-4 pt-4 border-t border-[#1a1c19]/5 space-y-1">
          <SideNavItem href="/profile" icon="person" label="My Profile" active={pathname === "/profile"} small />
          <SideNavItem href="/help" icon="help_outline" label="Help Center" small />
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#f4f4ef] dark:hover:bg-[#232621] hover:translate-x-1 transition-transform duration-200 text-[#1a1c19]/70 dark:text-[#fafaf5]/70"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-['Manrope'] font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

/**
 * Sub-component for the sidebar brand section.
 */
function SidebarBrand() {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Digital Conservatory Seal"
        className="w-8 h-8 rounded-lg object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDabdAn8tOKmzN8IZ5Xs9BlbbaAl6Gbmq-E4AvLOmWfnoVx-JqrecxGEnSbEOTZNZk2GIp4pk6g6p4ZFcDM0f7UDD6F501FPWSfGyWbTTH5foE5-xE0i7leb3hDme92u8g-eWWFhAagvt79G3soaKIVOJNWj40Em68VMq-bUgwHW_NdOuqkRunXHwPpNlg6NGQ82TrwHFvye6U0p6Af1OmmXXXxWFuurTeNvkEkhAgFoLyZa3YLaglAEYM0nbODmMSps_L0u2z9xvq9"
      />
      <div>
        <h2 className="text-lg font-bold text-[#154212] dark:text-[#d0e8c5] leading-none">
          The Conservatory
        </h2>
        <p className="text-[10px] text-[#1a1c19]/50 uppercase tracking-widest mt-1">
          Scientific Archive v2.4
        </p>
      </div>
    </div>
  );
}

interface SideNavItemProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  small?: boolean;
}

/**
 * Sub-component for individual sidebar navigation items.
 * DRY principle: extracted repeating JSX.
 */
function SideNavItem({ href, icon, label, active, small }: SideNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg mx-2 hover:translate-x-1 transition-transform duration-200",
        active
          ? "bg-[#2d5a27] text-white"
          : "text-[#1a1c19]/70 dark:text-[#fafaf5]/70 hover:bg-[#f4f4ef] dark:hover:bg-[#232621]",
        small && "text-sm"
      )}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-['Manrope'] font-medium text-sm">{label}</span>
    </Link>
  );
}
