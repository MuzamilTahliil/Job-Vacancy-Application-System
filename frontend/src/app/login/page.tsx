"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message } from "antd";
import { login, UserRole } from "@/app/services/auth.service";

// Helper function to get dashboard route based on role
function getDashboardRoute(role: UserRole): string {
  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return "/admin/dashboard";
  } else if (role === UserRole.EMPLOYER) {
    return "/employer/dashboard";
  } else if (role === UserRole.JOB_SEEKER) {
    return "/"; // Job seekers go to home page
  }
  return "/";
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole") as UserRole;
      
      if (token && userRole) {
        // Get the intended destination or use dashboard
        const intendedPath = localStorage.getItem("intendedPath");
        if (intendedPath) {
          localStorage.removeItem("intendedPath");
          router.replace(intendedPath);
        } else {
          router.replace(getDashboardRoute(userRole));
        }
      }
    }
  }, [router]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await login(values);
      
      // Get role from response
      const role = response.user?.role as UserRole;
      
      // Debug logging
      console.log("Login response:", response);
      console.log("User role:", role);
      
      if (!role) {
        message.error("Unable to determine user role. Please contact support.");
        setLoading(false);
        return;
      }

      message.success("Login successful!");
      
      // Determine redirect path based on role
      let redirectPath = getDashboardRoute(role);
      
      console.log("✅ Login successful! User role:", role);
      console.log("📍 Default dashboard path:", redirectPath);
      
      // Get intended destination if user was redirected from protected route
      const intendedPath = localStorage.getItem("intendedPath");
      
      // Only use intended path if user has permission for it
      if (intendedPath) {
        localStorage.removeItem("intendedPath");
        // Validate if user can access intended path based on role
        if (
          (intendedPath.startsWith("/admin") && (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN)) ||
          (intendedPath.startsWith("/employer") && role === UserRole.EMPLOYER) ||
          (intendedPath.startsWith("/seeker") && role === UserRole.JOB_SEEKER)
        ) {
          redirectPath = intendedPath;
          console.log("📍 Using intended path:", redirectPath);
        }
      }
      
      // Redirect to the appropriate dashboard
      console.log("🚀 Redirecting to:", redirectPath);
      router.push(redirectPath);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
      message.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-green-light to-white">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl shadow-xl border-none overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-base text-gray-600">Sign in to your account to continue</p>
          </div>
          <Form layout="vertical" onFinish={onFinish} className="mt-8">
            <Form.Item
              label={<span className="font-medium text-gray-700">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
              className="mb-4"
            >
              <Input size="large" placeholder="Enter your email" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Password</span>}
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
              className="mb-4"
            >
              <Input.Password size="large" placeholder="Enter your password" className="rounded-lg" />
            </Form.Item>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="h-12 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none hover:from-primary-green-dark hover:to-[#047857] transition-all duration-300 hover:-translate-y-1"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account? <a href="/register" className="text-primary-green font-semibold hover:text-primary-green-dark hover:underline">Sign up here</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
