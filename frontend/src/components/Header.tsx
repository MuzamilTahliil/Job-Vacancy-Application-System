"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { UserRole, logout } from "@/app/services/auth.service";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole") as UserRole;
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUserRole(null);
    router.push("/");
  };

  const handleDashboard = () => {
    if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
      router.push("/admin/dashboard");
    } else if (userRole === UserRole.EMPLOYER) {
      router.push("/employer/dashboard");
    } else if (userRole === UserRole.JOB_SEEKER) {
      router.push("/seeker/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleSignIn = () => {
    // Clear any intended path when clicking sign in from header (user-initiated)
    if (typeof window !== "undefined") {
      localStorage.removeItem("intendedPath");
    }
    router.push("/login");
  };

  const menuItems = [
    { key: "/", label: "Home" },
    { key: "/about", label: "About" },
    { key: "/jobs", label: "Jobs" },
    { key: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-gradient-to-br from-white to-gray-50 shadow-md fixed top-0 left-0 right-0 z-50 border-b-2 border-primary-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center text-2xl sm:text-3xl font-bold tracking-tight">
            <span className="text-primary-green bg-gradient-to-r from-primary-green to-primary-green-dark bg-clip-text text-transparent">Job</span>
            <span className="text-gray-800 ml-1">Vacancy</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center mx-8">
          <div className="flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => router.push(item.key)}
                className={`px-5 py-2 mx-1 rounded-lg text-base font-medium transition-all duration-300 ${
                  pathname === item.key
                    ? "text-primary-green border-b-2 border-primary-green bg-primary-green-light"
                    : "text-gray-600 hover:text-primary-green hover:bg-primary-green-light"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                onClick={handleDashboard}
                className="h-10 px-6 text-primary-green border-primary-green font-medium rounded-lg hover:text-primary-green-dark hover:border-primary-green-dark hover:bg-primary-green-light transition-all duration-300 hover:-translate-y-0.5"
              >
                Dashboard
              </Button>
              <Button
                type="primary"
                onClick={handleLogout}
                className="h-10 px-6 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none shadow-lg hover:shadow-xl hover:from-primary-green-dark hover:to-[#047857] transition-all duration-300 hover:-translate-y-1"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSignIn}
                className="h-10 px-6 text-primary-green border-primary-green font-medium rounded-lg hover:text-primary-green-dark hover:border-primary-green-dark hover:bg-primary-green-light transition-all duration-300 hover:-translate-y-0.5"
              >
                Sign In
              </Button>
              <Button
                type="primary"
                onClick={() => router.push("/register")}
                className="h-10 px-6 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none shadow-lg hover:shadow-xl hover:from-primary-green-dark hover:to-[#047857] transition-all duration-300 hover:-translate-y-1"
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-800 rounded-lg hover:bg-primary-green-light hover:text-primary-green transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <CloseOutlined className="text-xl" /> : <MenuOutlined className="text-xl" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slideDown">
          <div className="px-4 py-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  router.push(item.key);
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 text-left ${
                  pathname === item.key
                    ? "text-primary-green border-b-2 border-primary-green bg-primary-green-light"
                    : "text-gray-600 hover:text-primary-green hover:bg-primary-green-light"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="px-4 pb-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  block
                  onClick={() => {
                    handleDashboard();
                    setIsMenuOpen(false);
                  }}
                  className="h-12 text-primary-green border-primary-green font-medium rounded-lg"
                >
                  Dashboard
                </Button>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="h-12 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  block
                  onClick={() => {
                    handleSignIn();
                    setIsMenuOpen(false);
                  }}
                  className="h-12 text-primary-green border-primary-green font-medium rounded-lg"
                >
                  Sign In
                </Button>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    router.push("/register");
                    setIsMenuOpen(false);
                  }}
                  className="h-12 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

