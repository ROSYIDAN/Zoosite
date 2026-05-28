import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center text-sm font-medium text-on-surface-variant bg-surface-container/50 px-4 py-2 rounded-xl w-fit border border-outline-variant/10 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary font-bold">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="material-symbols-outlined text-sm mx-2 opacity-40 select-none">
              chevron_right
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
