"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, message, Form, Select, DatePicker, Card, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  jobType: string;
  location: string;
  salary?: string;
  deadline: string;
  isActive: boolean;
  employerId: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - replace with actual API call
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    description: "We are looking for an experienced Frontend Developer...",
    requirements: "3+ years of experience with React, TypeScript, and modern frontend frameworks",
    responsibilities: "Develop and maintain user-facing features, collaborate with design team",
    jobType: "Full-time",
    location: "Mogadishu",
    salary: "$50,000 - $70,000",
    deadline: "2024-03-15",
    isActive: true,
    employerId: "emp-001",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Backend Developer",
    description: "Join our team as a Backend Developer...",
    requirements: "5+ years of experience with Node.js, Express, and databases",
    responsibilities: "Design and implement scalable backend services, API development",
    jobType: "Part-time",
    location: "Hargeisa",
    salary: "$40,000 - $60,000",
    deadline: "2024-03-20",
    isActive: true,
    employerId: "emp-002",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    description: "We need a creative UI/UX Designer...",
    requirements: "Portfolio demonstrating strong design skills, proficiency in Figma",
    responsibilities: "Create user-centered designs, conduct user research",
    jobType: "Contract",
    location: "Hargeisa",
    salary: "$45,000 - $65,000",
    deadline: "2024-02-01",
    isActive: false,
    employerId: "emp-003",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
];

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchJob = async () => {
      try {
        setFetching(true);
        const foundJob = mockJobs.find((j) => j.id === jobId);
        if (foundJob) {
          setJob(foundJob);
          form.setFieldsValue({
            title: foundJob.title,
            description: foundJob.description,
            requirements: foundJob.requirements,
            responsibilities: foundJob.responsibilities,
            jobType: foundJob.jobType,
            location: foundJob.location,
            salary: foundJob.salary,
            deadline: dayjs(foundJob.deadline),
            employerId: foundJob.employerId,
            isActive: foundJob.isActive ? "active" : "inactive",
          });
        } else {
          message.error("Job not found");
          router.push("/admin/jobs");
        }
      } catch (error) {
        message.error("Failed to load job");
        router.push("/admin/jobs");
      } finally {
        setFetching(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, form, router]);

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
      console.log("Updated job data:", formattedValues);
      
      message.success("Job updated successfully!");
      router.push("/admin/jobs");
    } catch (error) {
      message.error("Failed to update job");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold mb-2">Edit Job</h1>
          <p className="text-white/90 text-lg">Update job posting information</p>
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
                  Update Job
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

