"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, message, Form, Select, DatePicker, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function AddJobPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values: any) => {
    try {
      setLoading(true);
      // Format the deadline
      const formattedValues = {
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD HH:mm:ss'),
        isActive: values.isActive === "active",
      };

      // TODO: Replace with actual API call
      console.log("New job data:", formattedValues);
      
      message.success("Job created successfully!");
      router.push("/admin/jobs");
    } catch (error) {
      message.error("Failed to create job");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Beautiful Header */}
      <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/admin/jobs")}
              className="text-white hover:bg-white/20 border-white/30"
              size="large"
            >
              Back to Jobs
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">Add New Job</h1>
          <p className="text-white/90 text-lg">Create a new job posting for your organization</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="shadow-lg">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            className="mt-4"
            initialValues={{
              isActive: "active",
              deadline: dayjs().add(30, 'day'),
            }}
          >
            <Form.Item
              name="title"
              label={<span className="text-gray-700 font-semibold">Job Title</span>}
              rules={[{ required: true, message: "Please enter job title" }]}
            >
              <Input size="large" placeholder="e.g., Frontend Developer" />
            </Form.Item>

            <Form.Item
              name="description"
              label={<span className="text-gray-700 font-semibold">Description</span>}
              rules={[{ required: true, message: "Please enter job description" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter job description..."
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="requirements"
              label={<span className="text-gray-700 font-semibold">Requirements</span>}
              rules={[{ required: true, message: "Please enter job requirements" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter job requirements..."
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="responsibilities"
              label={<span className="text-gray-700 font-semibold">Responsibilities</span>}
              rules={[{ required: true, message: "Please enter job responsibilities" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter job responsibilities..."
                size="large"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="jobType"
                label={<span className="text-gray-700 font-semibold">Job Type</span>}
                rules={[{ required: true, message: "Please select job type" }]}
              >
                <Select size="large" placeholder="Select job type">
                  <Select.Option value="Full-time">Full-time</Select.Option>
                  <Select.Option value="Part-time">Part-time</Select.Option>
                  <Select.Option value="Contract">Contract</Select.Option>
                  <Select.Option value="Internship">Internship</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="location"
                label={<span className="text-gray-700 font-semibold">Location</span>}
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input size="large" placeholder="e.g., Mogadishu" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="salary"
                label={<span className="text-gray-700 font-semibold">Salary (Optional)</span>}
              >
                <Input size="large" placeholder="e.g., $50,000 - $70,000" />
              </Form.Item>

              <Form.Item
                name="deadline"
                label={<span className="text-gray-700 font-semibold">Application Deadline</span>}
                rules={[{ required: true, message: "Please select deadline" }]}
              >
                <DatePicker
                  size="large"
                  className="w-full"
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="employerId"
                label={<span className="text-gray-700 font-semibold">Employer ID</span>}
                rules={[{ required: true, message: "Please enter employer ID" }]}
              >
                <Input size="large" placeholder="Enter employer ID" />
              </Form.Item>

              <Form.Item
                name="isActive"
                label={<span className="text-gray-700 font-semibold">Active Status</span>}
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select size="large" placeholder="Select status">
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item className="mb-0 mt-8">
              <div className="flex justify-end gap-3">
                <Button onClick={() => router.push("/admin/jobs")} size="large">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                >
                  Create Job
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

