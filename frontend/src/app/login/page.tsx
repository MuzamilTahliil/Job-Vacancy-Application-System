"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message } from "antd";
import { login } from "@/app/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await login(values);
      // Store user role if available in response
      if (response.user?.role) {
        localStorage.setItem("userRole", response.user.role);
      }
      message.success("Login successful!");
      
      // Redirect based on user role
      const role = response.user?.role || localStorage.getItem("userRole");
      if (role === "employer") {
        router.push("/employer/dashboard");
      } else if (role === "seeker") {
        router.push("/seeker/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      message.error(error.message || "Login failed. Please try again.");
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
