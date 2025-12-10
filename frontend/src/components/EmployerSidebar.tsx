"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  DashboardOutlined,
  TeamOutlined,
  BuildOutlined,
  FileTextOutlined,
  ProfileOutlined,
  LogoutOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { logout } from "@/app/services/auth.service";

export default function EmployerSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    {
      key: "/employer/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    // {
    //   key: "/employer/job-seekers",
    //   icon: <TeamOutlined />,
    //   label: "Job Seekers",
    // },
    {
      key: "/employer/jobs",
      icon: <BuildOutlined />,
      label: "Jobs",
    },
    {
      key: "/employer/applications",
      icon: <FileTextOutlined />,
      label: "Applications",
    },
    {
      key: "/employer/job-viewers",
      icon: <EyeOutlined />,
      label: "Job Viewers",
    },
    {
      key: "/employer/profile",
      icon: <ProfileOutlined />,
      label: "Profile",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  const handleMenuClick = (key: string) => {
    if (key === "logout") {
      handleLogout();
    } else {
      router.push(key);
    }
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50 overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">J</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-primary-green font-bold text-xl">Job</span>
              <span className="text-gray-800 font-bold text-xl">Vacancy</span>
            </div>
            <p className="text-xs text-gray-500">Employer Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.key;
            const isLogout = item.key === "logout";
            
            return (
              <li key={item.key}>
                <button
                  onClick={() => handleMenuClick(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-green text-white shadow-md"
                      : isLogout
                      ? "text-red-500 hover:bg-red-50"
                      : "text-gray-700 hover:bg-primary-green-light hover:text-primary-green"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

