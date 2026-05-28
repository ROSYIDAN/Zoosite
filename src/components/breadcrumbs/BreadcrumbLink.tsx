"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBreadcrumbs, BreadcrumbSegment } from "@/components/breadcrumbs/BreadcrumbProvider";
import React from "react";

interface BreadcrumbLinkProps {
  href: string;
  /** The label for this page in the breadcrumb trail */
  breadcrumbLabel: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

/**
 * A wrapper around Next.js <Link> that pushes the current page
 * onto the breadcrumb trail before navigating to the target.
 * 
 * Usage: Replace `<Link href="/animals/lion">` with
 * `<BreadcrumbLink href="/animals/lion" breadcrumbLabel="Caribbean">`
 * 
 * The breadcrumbLabel is the label of the CURRENT page (not the destination).
 * The current page's href is automatically captured.
 */
export default function BreadcrumbLink({
  href,
  breadcrumbLabel,
  children,
  className,
  ...props
}: BreadcrumbLinkProps) {
  const { push } = useBreadcrumbs();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Push the current page's context onto the breadcrumb trail
    push({ label: breadcrumbLabel, href: window.location.pathname });
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </Link>
  );
}
