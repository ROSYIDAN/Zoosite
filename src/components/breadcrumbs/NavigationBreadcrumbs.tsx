"use client";

import Link from "next/link";
import React from "react";
import { useBreadcrumbs } from "@/components/breadcrumbs/BreadcrumbProvider";

interface NavigationBreadcrumbsProps {
  /** The label for the current (final) page */
  currentPageLabel: string;
  className?: string;
}

/**
 * Client-side breadcrumb that reads the navigation trail from BreadcrumbContext.
 * Automatically prepends "Dashboard" as the root and appends the current page label.
 */
export default function NavigationBreadcrumbs({
  currentPageLabel,
  className = "",
}: NavigationBreadcrumbsProps) {
  const { trail } = useBreadcrumbs();

  // Build full breadcrumb: Dashboard (always first) + trail + current page
  const allSegments = [
    { label: "Dashboard", href: "/dashboard" },
    ...trail.filter(s => s.href !== "/dashboard"), // avoid duplicate Dashboard
  ];

  return (
    <nav
      className={`flex items-center text-sm font-medium text-on-surface-variant bg-surface-container/50 px-4 py-2 rounded-xl w-fit border border-outline-variant/10 ${className}`}
    >
      {allSegments.map((segment, index) => (
        <React.Fragment key={`${segment.href}-${index}`}>
          <Link href={segment.href} className="hover:text-primary transition-colors">
            {segment.label}
          </Link>
          <span className="material-symbols-outlined text-sm mx-2 opacity-40 select-none">
            chevron_right
          </span>
        </React.Fragment>
      ))}
      <span className="text-primary font-bold">{currentPageLabel}</span>
    </nav>
  );
}
