"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  setSidebarVisible: (visible: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

/**
 * Provider component for global sidebar state.
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  const setSidebarVisible = (visible: boolean) => setIsSidebarVisible(visible);

  return (
    <SidebarContext.Provider
      value={{ isSidebarVisible, toggleSidebar, setSidebarVisible }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

/**
 * Hook to consume sidebar state.
 * Throws error if used outside of SidebarProvider.
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
