"use client";

import dynamic from "next/dynamic";

const EmployerSidebar = dynamic(() => import("@/components/EmployerSidebar"), {
  ssr: false,
});

const EmployerHeader = dynamic(() => import("@/components/EmployerHeader"), {
  ssr: false,
});

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <EmployerSidebar />
      <div className="ml-64">
        <EmployerHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

