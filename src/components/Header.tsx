"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole(null);
    router.push("/");
  };

  const handleDashboard = () => {
    if (userRole === "employer") {
      router.push("/employer/dashboard");
    } else if (userRole === "seeker") {
      router.push("/seeker/dashboard");
    }
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
                type="primary"
                onClick={handleDashboard}
                className="h-10 px-6 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none hover:from-primary-green-dark hover:to-[#047857] transition-all duration-300 hover:-translate-y-0.5"
              >
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                className="h-10 px-5 text-gray-600 border-gray-300 rounded-lg hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all duration-300"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => router.push("/login")}
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
          <Menu
            mode="vertical"
            selectedKeys={[pathname]}
            items={menuItems.map((item) => ({
              key: item.key,
              label: (
                <Link href={item.key} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>
              ),
            }))}
            className="border-none bg-transparent mb-4"
          />
          <div className="px-4 pb-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    handleDashboard();
                    setIsMenuOpen(false);
                  }}
                  className="h-12 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none"
                >
                  Dashboard
                </Button>
                <Button
                  block
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="h-12 text-gray-600 border-gray-300 rounded-lg hover:text-red-500 hover:border-red-500"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button block className="h-12 text-primary-green border-primary-green font-medium rounded-lg">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    type="primary"
                    block
                    className="h-12 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

