"use client";

import { useRouter } from "next/navigation";
import { Input, Avatar, Badge } from "antd";
import { SearchOutlined, BellOutlined, SettingOutlined } from "@ant-design/icons";

export default function EmployerHeader() {
  const router = useRouter();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="rounded-lg"
          size="large"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        <Badge count={3}>
          <BellOutlined className="text-xl text-gray-600 cursor-pointer hover:text-primary-green transition-colors" />
        </Badge>
        <SettingOutlined className="text-xl text-gray-600 cursor-pointer hover:text-primary-green transition-colors" />
        <Avatar
          size={40}
          className="cursor-pointer border-2 border-primary-green hover:border-primary-green-dark transition-colors"
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Employer"
          onClick={() => router.push("/employer/profile")}
        />
      </div>
    </div>
  );
}

