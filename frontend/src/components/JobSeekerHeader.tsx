"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input, Avatar, Badge, Button } from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { logout } from "@/app/services/auth.service";
import { getCurrentUser, User } from "@/app/services/users.service";

export default function JobSeekerHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    { key: "/", label: "Home" },
    { key: "/about", label: "About" },
    { key: "/jobs", label: "Jobs" },
    { key: "/applications", label: "View Applications" },
    { key: "/contact", label: "Contact" },
  ];

  // Check if pathname matches the menu item (for nested routes)
  const isActive = (key: string) => {
    if (key === "/" && pathname === "/") return true;
    if (key !== "/" && pathname?.startsWith(key)) return true;
    return false;
  };

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
                  isActive(item.key)
                    ? "text-primary-green border-b-2 border-primary-green bg-primary-green-light"
                    : "text-gray-600 hover:text-primary-green hover:bg-primary-green-light"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Right Side Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Badge count={0}>
            <BellOutlined 
              className="text-xl text-gray-600 cursor-pointer hover:text-primary-green transition-colors" 
              onClick={() => router.push("/notifications")}
            />
          </Badge>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className="cursor-pointer border-2 border-primary-green hover:border-primary-green-dark transition-colors"
            onClick={() => router.push("/seeker/profile")}
          >
            {currentUser?.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <Button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-500"
          >
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-800 rounded-lg hover:bg-primary-green-light hover:text-primary-green transition-all duration-300"
        >
          <UserOutlined className="text-xl" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="px-4 py-4 flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => router.push(item.key)}
              className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 text-left ${
                isActive(item.key)
                  ? "text-primary-green border-b-2 border-primary-green bg-primary-green-light"
                  : "text-gray-600 hover:text-primary-green hover:bg-primary-green-light"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 text-left"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

