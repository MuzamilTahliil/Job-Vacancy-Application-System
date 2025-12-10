"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spin, message } from "antd";
import { UserRole } from "./auth.service";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function AuthGuard({ children, allowedRoles, redirectTo }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
    setIsChecking(true);
    setIsAuthorized(false);
    
    if (typeof window === "undefined") {
      setIsChecking(false);
      return;
    }

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole") as UserRole;

    // Helper function to get dashboard route based on role
    const getDashboardRoute = (role: UserRole | null): string => {
      if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
        return "/admin/dashboard";
      } else if (role === UserRole.EMPLOYER) {
        return "/employer/dashboard";
      } else if (role === UserRole.JOB_SEEKER) {
        return "/seeker/dashboard";
      }
      return "/";
    };

    // Check if user is authenticated
    if (!token) {
      message.warning("Please login to access this page");
      // Store intended destination so we can redirect after login
      if (pathname !== "/login") {
        localStorage.setItem("intendedPath", pathname);
      }
      // Replace the current history entry to prevent back navigation
      window.history.replaceState(null, "", "/login");
      router.replace("/login");
      setIsChecking(false);
      setIsAuthorized(false);
      return;
    }

    // Check if user has required role
    if (!userRole || !allowedRoles.includes(userRole)) {
      message.error("You don't have permission to access this page");
      
      // Redirect based on user's actual role to their dashboard
      const redirectPath = getDashboardRoute(userRole);
      
      // Replace history to prevent back navigation
      window.history.replaceState(null, "", redirectPath);
      router.replace(redirectPath);
      setIsChecking(false);
      setIsAuthorized(false);
      return;
    }

    // User is authorized
    setIsAuthorized(true);
    setIsChecking(false);
  }, [router, pathname, allowedRoles, redirectTo]);

  // NEVER render children until we confirm authorization
  // Block everything if not mounted, checking, or not authorized
  if (!mounted || isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin 
          size="large" 
          tip={!mounted || isChecking ? "Checking permissions..." : "Access denied. Redirecting..."} 
        />
      </div>
    );
  }

  // Only render children if explicitly authorized
  return <>{children}</>;
}

// Hook to check if user is authenticated
export function useAuth() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole") as UserRole;
      setIsAuthenticated(!!token);
      setUserRole(role);
    }
  }, []);

  return { mounted, isAuthenticated, userRole };
}

