"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Select, DatePicker, message } from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { createJob, CreateJobDto, JobType } from "@/app/services/jobs.service";
import { getCurrentUser, User } from "@/app/services/users.service";

export default function PostJob() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    form.setFieldsValue({
      jobType: JobType.FULL_TIME,
      deadline: dayjs().add(30, 'day'),
      isActive: true,
    });
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const jobData: CreateJobDto = {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        responsibilities: values.responsibilities,
        jobType: values.jobType,
        location: values.location,
        salary: values.salary,
        deadline: values.deadline.format('YYYY-MM-DD'),
        isActive: values.isActive !== false,
      };
      
      await createJob(jobData);
      message.success("Job posted successfully!");
      form.resetFields();
      form.setFieldsValue({
        jobType: JobType.FULL_TIME,
        deadline: dayjs().add(30, 'day'),
        isActive: true,
      });
      // Redirect to jobs page
      router.push("/employer/jobs");
    } catch (error: any) {
      console.error("Error posting job:", error);
      message.error(error?.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card 
        title={
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Post a New Job</h1>
            {currentUser?.companyName && (
              <p className="text-gray-600">Posting as: <span className="font-semibold text-primary-green">{currentUser.companyName}</span></p>
            )}
          </div>
        }
        className="shadow-lg"
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          size="large"
        >
          <Form.Item 
            label="Job Title" 
            name="title" 
            rules={[{ required: true, message: "Please enter job title" }]}
          >
            <Input placeholder="e.g., Senior Frontend Developer" />
          </Form.Item>

          <Form.Item 
            label="Job Description" 
            name="description" 
            rules={[{ required: true, message: "Please enter job description" }]}
          >
            <Input.TextArea 
              rows={6} 
              placeholder="Provide a detailed description of the job role, what your company does, and what makes this position exciting..."
            />
          </Form.Item>

          <Form.Item 
            label="Requirements" 
            name="requirements" 
            rules={[{ required: true, message: "Please enter job requirements" }]}
          >
            <Input.TextArea 
              rows={6} 
              placeholder="List the required skills, experience, education, and qualifications for this position..."
            />
          </Form.Item>

          <Form.Item 
            label="Responsibilities" 
            name="responsibilities" 
            rules={[{ required: true, message: "Please enter job responsibilities" }]}
          >
            <Input.TextArea 
              rows={6} 
              placeholder="Describe the key duties and responsibilities the candidate will be expected to perform..."
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              label="Job Type" 
              name="jobType" 
              rules={[{ required: true, message: "Please select job type" }]}
            >
              <Select>
                <Select.Option value={JobType.FULL_TIME}>Full-time</Select.Option>
                <Select.Option value={JobType.PART_TIME}>Part-time</Select.Option>
                <Select.Option value={JobType.CONTRACT}>Contract</Select.Option>
                <Select.Option value={JobType.INTERNSHIP}>Internship</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item 
              label="Location" 
              name="location" 
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input placeholder="e.g., Mogadishu, Somalia" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              label="Salary" 
              name="salary"
            >
              <Input placeholder="e.g., $50,000 - $70,000 or Negotiable" />
            </Form.Item>

            <Form.Item 
              label="Application Deadline" 
              name="deadline" 
              rules={[{ required: true, message: "Please select deadline" }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          <Form.Item className="mt-6">
            <div className="flex justify-end gap-3">
              <Button onClick={() => router.push("/employer/jobs")}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
              >
                Post Job
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
