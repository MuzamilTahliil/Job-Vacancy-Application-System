"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "./Header";
import JobSeekerHeader from "./JobSeekerHeader";
import { UserRole } from "@/app/services/auth.service";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole") as UserRole;
      setUserRole(role);
    }
  }, [pathname]);

  // Don't show header on admin and employer routes (they have their own headers)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/employer")) {
    return null;
  }
  
  // Show JobSeekerHeader for job seekers
  if (userRole === UserRole.JOB_SEEKER) {
    return <JobSeekerHeader />;
  }
  
  // Show regular Header for everyone else (not logged in or other roles)
  return <Header />;
}

