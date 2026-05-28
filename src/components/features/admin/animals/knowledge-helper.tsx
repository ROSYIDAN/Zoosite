"use client";

import { cn } from "@/lib/utils";

interface KnowledgeHelperProps {
  label: string;
  commonName?: string;
  className?: string;
}

export default function KnowledgeHelper({ label, commonName, className }: KnowledgeHelperProps) {
  const isEnabled = !!commonName && commonName.trim().length > 0;

  if (!isEnabled) {
    return (
      <span
        className={cn(
          "inline-flex items-center text-[10px] font-bold tracking-wider uppercase select-none text-neutral-400/20 cursor-not-allowed pb-0.5 transition-all duration-300 ease-out",
          className
        )}
        title="Enter a 'Common Name' first to unlock Google search details"
      >
        Google
      </span>
    );
  }

  const searchQuery = `${label} of ${commonName}`;
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

  return (
    <a
      href={googleSearchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center text-[10px] font-bold tracking-wider uppercase select-none transition-all duration-300 ease-out cursor-pointer",
        "text-neutral-400/50 hover:scale-[1.02] border-b border-transparent pb-0.5 group",
        className
      )}
      title={`Search "${searchQuery}" on Google`}
    >
      <span className="transition-colors duration-300 group-hover:text-[#4285F4]">G</span>
      <span className="transition-colors duration-300 group-hover:text-[#EA4335]">O</span>
      <span className="transition-colors duration-300 group-hover:text-[#FBBC05]">O</span>
      <span className="transition-colors duration-300 group-hover:text-[#4285F4]">G</span>
      <span className="transition-colors duration-300 group-hover:text-[#34A853]">L</span>
      <span className="transition-colors duration-300 group-hover:text-[#EA4335]">E</span>
    </a>
  );
}
