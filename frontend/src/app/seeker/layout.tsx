"use client";

import dynamic from "next/dynamic";
import { AuthGuard } from "@/app/services/auth-guard";
import { UserRole } from "@/app/services/auth.service";

const JobSeekerHeader = dynamic(() => import("@/components/JobSeekerHeader"), {
  ssr: false,
});

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={[UserRole.JOB_SEEKER]}>
      <div className="min-h-screen bg-gray-50">
        <JobSeekerHeader />
        <div className="pt-20">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

