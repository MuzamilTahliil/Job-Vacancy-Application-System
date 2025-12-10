"use client";

import dynamic from "next/dynamic";
import { AuthGuard } from "@/app/services/auth-guard";
import { UserRole } from "@/app/services/auth.service";

const EmployerSidebar = dynamic(() => import("@/components/EmployerSidebar"), {
  ssr: false,
});

const EmployerHeader = dynamic(() => import("@/components/EmployerHeader"), {
  ssr: false,
});

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={[UserRole.EMPLOYER]}>
      <div className="min-h-screen bg-gray-50">
        <EmployerSidebar />
        <div className="ml-64">
          <EmployerHeader />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

