"use client";

import AdminSidebar from "./admin-sidebar";
import AdminTopbar from "./admin-topbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafaf5]">
      <AdminSidebar />
      <AdminTopbar />
      <main className="ml-64 pt-16">
        {children}
      </main>
    </div>
  );
}
