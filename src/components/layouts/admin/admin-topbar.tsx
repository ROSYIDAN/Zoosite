"use client";

import Link from "next/link";

export default function AdminTopbar() {
  return (
    <header className="fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-6 h-16 bg-[#fafaf5]/90 backdrop-blur-xl border-b border-[#1a1c19]/8">
      {/* Empty spacer to keep actions on the right */}
      <div />
      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-full border border-primary-container px-3 py-1.5 text-xs font-bold text-primary-container transition-all hover:bg-surface-container active:scale-[0.98] mr-2"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          User Portal
        </Link>
        <button className="p-2 rounded-full hover:bg-surface-container transition-colors text-primary" title="Notifications">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-px bg-outline-variant" />
        <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Admin Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBki11XWmHnADCH0F8vls-aKxBAfCXkOaEFA0qJitd53ordS4wfLkH5EWoQsW7pX6xNvmfywm-a15qA2LiXSpZ2M-AjtA2zgG6H2gPl_WZiHhE4WBWyjgBYykR69NhD7fMQDT9E-jPUPVCkkYuciElAqbSADTRxYZsJZBmMCsE6uZByYhC0uq_ZtI9Dz0WQt0-tNfQD50ngyXvlqcTL0gzZseCCqG88Sl9C97keZFdF5gZc4KFYlpYkB13CE0IlPSZ5P6zh9mRBci9I"
          />
        </div>
      </div>
    </header>
  );
}
