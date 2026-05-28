"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

export interface BreadcrumbSegment {
  label: string;
  href: string;
}

interface BreadcrumbContextType {
  /** The current breadcrumb trail leading to this page */
  trail: BreadcrumbSegment[];
  /** Push a new segment onto the trail (called before navigating) */
  push: (segment: BreadcrumbSegment) => void;
  /** Replace the entire trail (used for hard-setting from server pages) */
  setTrail: (trail: BreadcrumbSegment[]) => void;
  /** Clear the trail */
  clear: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  trail: [],
  push: () => {},
  setTrail: () => {},
  clear: () => {},
});

export function useBreadcrumbs() {
  return useContext(BreadcrumbContext);
}

const STORAGE_KEY = "zoosite-breadcrumb-trail";

/**
 * BreadcrumbProvider wraps the application and maintains a navigation trail.
 * The trail is persisted in sessionStorage so it survives page navigations
 * but resets when the browser tab is closed.
 */
export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [trail, setTrailState] = useState<BreadcrumbSegment[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restore trail from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTrailState(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist trail to sessionStorage whenever it changes
  useEffect(() => {
    if (hydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trail));
    }
  }, [trail, hydrated]);

  // When the user navigates to a page that's already in the trail,
  // truncate the trail to that point (handles back navigation / clicking breadcrumb links)
  useEffect(() => {
    if (!hydrated) return;
    if (pathname === "/dashboard" || pathname === "/") {
      setTrailState([]);
      return;
    }
    const existingIndex = trail.findIndex(s => s.href === pathname);
    if (existingIndex !== -1) {
      // User navigated to a page already in the trail — truncate after it
      setTrailState(prev => prev.slice(0, existingIndex));
    }
  }, [pathname, hydrated]);

  const push = useCallback((segment: BreadcrumbSegment) => {
    setTrailState(prev => {
      // Don't push duplicates
      if (prev.length > 0 && prev[prev.length - 1].href === segment.href) {
        return prev;
      }
      return [...prev, segment];
    });
  }, []);

  const setTrail = useCallback((newTrail: BreadcrumbSegment[]) => {
    setTrailState(newTrail);
  }, []);

  const clear = useCallback(() => {
    setTrailState([]);
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ trail, push, setTrail, clear }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
