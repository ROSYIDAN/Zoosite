"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  delay?: string;
}

function AdminCard({ href, title, description, icon, color, delay }: AdminCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-[#1a1c19]/8 bg-white p-8 transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_50px_rgba(45,90,39,0.12)] hover:-translate-y-1",
        delay
      )}
    >
      {/* Background Accent */}
      <div 
        className={cn(
          "absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-150",
          color
        )} 
      />
      
      <div className="relative z-10">
        <div className={cn(
          "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
          color
        )}>
          <span className="material-symbols-outlined text-[28px]">{icon}</span>
        </div>
        
        <h3 className="mb-2 font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#1a1c19]">
          {title}
        </h3>
        <p className="font-['Manrope'] text-sm leading-relaxed text-[#1a1c19]/60">
          {description}
        </p>
        
        <div className="mt-8 flex items-center gap-2 font-['Manrope'] text-sm font-bold text-[#2d5a27] transition-all duration-300 group-hover:gap-3">
          <span>Get Started</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </div>
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-[1px] w-12 bg-[#2d5a27]/30" />
          <span className="font-['Manrope'] text-[12px] font-bold uppercase tracking-[0.2em] text-[#2d5a27]">
            Management Suite
          </span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tight text-[#154212] lg:text-5xl">
          The Conservatory Dashboard
        </h1>
        <p className="mt-4 font-['Manrope'] text-lg text-[#1a1c19]/60 max-w-2xl">
          Welcome back. Control the archive, manage educational content, and oversee the digital ecosystem from one central command center.
        </p>
      </header>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminCard
          href="/admin/animals/create"
          title="Register Animal"
          description="Add new species to the archive. Upload media, define taxonomy, and set habitat details."
          icon="add_circle"
          color="bg-[#2d5a27]"
        />
        <AdminCard
          href="/admin/quiz"
          title="Quiz Management"
          description="Create and edit educational challenges. Review question performance and update patterns."
          icon="quiz"
          color="bg-[#4a6b3c]"
        />
        <AdminCard
          href="/admin/animals"
          title="Species Archive"
          description="Browse and edit existing animal records. Manage distribution data and conservation status."
          icon="database"
          color="bg-[#6b8e23]"
        />
        <AdminCard
          href="/admin/requests"
          title="Animal Requests"
          description="Review and approve new species requests from the community. Correct fields or apply user suspensions."
          icon="pending_actions"
          color="bg-[#3d6b2c]"
        />
        
        {/* Placeholder for future features */}
        <div className="group relative overflow-hidden rounded-3xl border border-dashed border-[#1a1c19]/20 bg-transparent p-8 transition-all duration-300">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a1c19]/5 text-[#1a1c19]/30">
            <span className="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <h3 className="mb-2 font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#1a1c19]/30">
            Coming Soon
          </h3>
          <p className="font-['Manrope'] text-sm leading-relaxed text-[#1a1c19]/30">
            Additional administrative modules are currently under development.
          </p>
        </div>
      </div>

      {/* Footer Info / Stats Placeholder */}
      <footer className="mt-16 rounded-3xl bg-[#2d5a27]/5 p-8 border border-[#2d5a27]/10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-['Manrope'] text-[10px] uppercase tracking-widest text-[#2d5a27]/60 mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#154212]">All Systems Operational</span>
            </div>
          </div>
          <div>
            <p className="font-['Manrope'] text-[10px] uppercase tracking-widest text-[#2d5a27]/60 mb-1">Latest Version</p>
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#154212]">v2.4.0 "Amazonas"</span>
          </div>
          <div>
            <p className="font-['Manrope'] text-[10px] uppercase tracking-widest text-[#2d5a27]/60 mb-1">Environment</p>
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#154212]">Production Instance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
