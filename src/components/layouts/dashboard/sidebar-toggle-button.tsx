"use client";

import { cn } from "@/lib/utils";

import { useSidebar } from "@/hooks/use-sidebar";

/**
 * SidebarToggleButton component for showing the sidebar when it's hidden.
 * Following FE System Law: kebab-case filename, layout component in layouts.
 */
export default function SidebarToggleButton() {
  const { isSidebarVisible, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "fixed left-0 top-6 z-40 p-2 bg-[#2d5a27] text-white rounded-r-xl shadow-lg hover:bg-[#154212] hover:pl-4 transition-all duration-300 hidden lg:flex items-center justify-center",
        isSidebarVisible
          ? "-translate-x-full opacity-0 pointer-events-none delay-0"
          : "translate-x-0 opacity-100 delay-300"
      )}
      title="Show Sidebar"
    >
      <span className="material-symbols-outlined">chevron_right</span>
    </button>
  );
}
