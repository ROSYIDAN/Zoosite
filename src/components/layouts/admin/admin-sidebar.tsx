import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SignOutButton from "@/components/features/auth/sign-out-button";

interface AdminNavItemProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  small?: boolean;
}

function AdminNavItem({ href, icon, label, active, small }: AdminNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl hover:translate-x-1 transition-all duration-200",
        active
          ? "bg-primary-container text-white"
          : "text-[#1a1c19]/70 hover:bg-surface-container",
        small && "py-2 text-sm"
      )}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="font-['Manrope'] font-medium text-sm">{label}</span>
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r border-[#1a1c19]/8 bg-[#fafaf5] flex flex-col py-6 z-50">
      {/* Brand */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-[20px]">forest</span>
        </div>
        <div>
          <h2 className="text-base font-bold text-primary font-['Plus_Jakarta_Sans'] leading-none">
            The Conservatory
          </h2>
          <p className="text-[10px] text-[#1a1c19]/50 uppercase tracking-widest mt-1 font-['Manrope']">
            Admin Console
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-3 space-y-1">
        <AdminNavItem 
          href="/admin" 
          icon="dashboard" 
          label="Admin Dashboard" 
          active={pathname === "/admin"} 
        />
        <AdminNavItem 
          href="/admin/requests" 
          icon="pending_actions" 
          label="Animal Requests" 
          active={pathname.startsWith("/admin/requests")} 
        />
        <AdminNavItem 
          href="/admin/quiz" 
          icon="quiz" 
          label="Quiz Questions" 
          active={pathname.startsWith("/admin/quiz")} 
        />
        <AdminNavItem 
          href="/admin/animals/create" 
          icon="add_circle" 
          label="Register Animal" 
          active={pathname === "/admin/animals/create"} 
        />
        <AdminNavItem href="/dashboard" icon="visibility" label="Public Dashboard" />
        <AdminNavItem 
          href="/admin/animals" 
          icon="database" 
          label="Species Archive" 
          active={pathname === "/admin/animals"}
        />
        <AdminNavItem 
          href="/admin/countries" 
          icon="public" 
          label="Manage Countries" 
          active={pathname === "/admin/countries"}
        />
        <AdminNavItem href="/habitats" icon="forest" label="Habitats" />
      </div>

      {/* Footer */}
      <div className="px-3 mt-auto pt-4 border-t border-[#1a1c19]/8 mx-3 space-y-1">
        <AdminNavItem href="/help" icon="help_outline" label="Help Center" small />
        <SignOutButton className="flex w-full items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#1a1c19]/70 hover:bg-surface-container hover:translate-x-1 transition-all duration-200">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-['Manrope'] font-medium text-sm">Sign Out</span>
        </SignOutButton>
      </div>
    </nav>
  );
}
