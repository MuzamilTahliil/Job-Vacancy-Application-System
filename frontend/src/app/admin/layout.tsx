"use client";

import dynamic from "next/dynamic";
import { AuthGuard } from "@/app/services/auth-guard";
import { UserRole } from "@/app/services/auth.service";

const AdminSidebar = dynamic(() => import("@/components/AdminSidebar"), {
  ssr: false,
});

const AdminHeader = dynamic(() => import("@/components/AdminHeader"), {
  ssr: false,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <AdminHeader />
        <div className="ml-64 pt-16">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
