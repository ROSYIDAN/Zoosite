"use client";

import { useState } from "react";
import TopNavBar from "./top-nav-bar";
import SideNavBar from "./side-nav-bar";
import SidebarToggleButton from "./sidebar-toggle-button";
import MobileBottomNav from "@/components/features/dashboard/mobile-bottom-nav";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

import { SidebarProvider, useSidebar } from "@/hooks/use-sidebar";

/**
 * Internal layout content that consumes SidebarContext.
 */
function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarVisible } = useSidebar();

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col">
      <TopNavBar />

      <div className="flex flex-1 overflow-hidden relative">
        <SideNavBar />
        <SidebarToggleButton />

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 p-6 md:p-10 space-y-12 overflow-y-auto",
            isSidebarVisible ? "lg:ml-64" : "lg:ml-0"
          )}
        >
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}

/**
 * DashboardLayout component providing the main shell for dashboard pages.
 * Following FE System Law: kebab-case filename, layout component in layouts.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
