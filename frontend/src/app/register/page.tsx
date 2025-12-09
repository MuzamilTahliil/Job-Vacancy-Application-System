"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Radio, message } from "antd";
import { register, UserRole } from "@/app/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const selectedRole = Form.useWatch("role", form);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Map role values to match backend enum
      const registrationData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role === "JOB_SEEKER" ? UserRole.JOB_SEEKER : UserRole.EMPLOYER,
        ...(values.role === "EMPLOYER" && values.companyName && { companyName: values.companyName }),
      };

      const response = await register(registrationData);
      message.success("Registration successful! Please sign in.");
      router.push("/login");
    } catch (error: any) {
      message.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-green-light to-white mt-12">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl shadow-xl border-none overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-base text-gray-600">Join JobHub and start your journey today</p>
          </div>
          <Form form={form} layout="vertical" onFinish={onFinish} className="mt-8">
            <Form.Item
              label={<span className="font-medium text-gray-700">Full Name</span>}
              name="fullName"
              rules={[{ required: true, message: "Please enter your full name!" }]}
              className="mb-4"
            >
              <Input size="large" placeholder="Enter your full name" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
              className="mb-4"
            >
              <Input size="large" placeholder="Enter your email" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
              className="mb-4"
            >
              <Input.Password size="large" placeholder="Create a password" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium text-gray-700">I am a</span>}
              name="role"
              rules={[{ required: true, message: "Please select your role!" }]}
              className="mb-4"
            >
              <Radio.Group size="large" className="w-full flex gap-3">
                <Radio.Button value={UserRole.JOB_SEEKER} className="flex-1 text-center h-12 leading-[46px] rounded-lg border-gray-300 hover:border-primary-green hover:text-primary-green">
                  Job Seeker
                </Radio.Button>
                <Radio.Button value={UserRole.EMPLOYER} className="flex-1 text-center h-12 leading-[46px] rounded-lg border-gray-300 hover:border-primary-green hover:text-primary-green">
                  Employer
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {selectedRole === UserRole.EMPLOYER && (
              <Form.Item
                label={<span className="font-medium text-gray-700">Company Name</span>}
                name="companyName"
                rules={[{ required: false, message: "Please enter your company name!" }]}
                className="mb-4"
              >
                <Input size="large" placeholder="Enter your company name (optional)" className="rounded-lg" />
              </Form.Item>
            )}

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="h-12 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none hover:from-primary-green-dark hover:to-[#047857] transition-all duration-300 hover:-translate-y-1"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account? <a href="/login" className="text-primary-green font-semibold hover:text-primary-green-dark hover:underline">Sign in here</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
