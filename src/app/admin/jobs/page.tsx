"use client";

import { useState } from "react";
import { Table, Button, Tag, Space, Input, message, Popconfirm, Modal, Form, Select, DatePicker } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
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

// Mock data - replace with actual API calls
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

export default function JobsPage() {
  const [jobs, setJobs] = useState(mockJobs);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id));
    message.success("Job deleted successfully");
  };

  const handleEdit = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      setEditingJob(job);
      setIsEditModalOpen(true);
      editForm.setFieldsValue({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        jobType: job.jobType,
        location: job.location,
        salary: job.salary,
        deadline: dayjs(job.deadline),
        employerId: job.employerId,
        isActive: job.isActive ? "active" : "inactive",
      });
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    setEditingJob(null);
    editForm.resetFields();
  };

  const handleEditFormSubmit = async (values: any) => {
    if (!editingJob) return;

    try {
      const formattedValues = {
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD HH:mm:ss'),
        isActive: values.isActive === "active",
      };

      const updatedJobs = jobs.map((job) =>
        job.id === editingJob.id
          ? {
              ...job,
              title: values.title,
              description: values.description,
              requirements: values.requirements,
              responsibilities: values.responsibilities,
              jobType: values.jobType,
              location: values.location,
              salary: values.salary || undefined,
              deadline: formattedValues.deadline,
              isActive: formattedValues.isActive,
              employerId: values.employerId,
              updatedAt: new Date().toISOString(),
            }
          : job
      );

      setJobs(updatedJobs);
      message.success("Job updated successfully!");
      setIsEditModalOpen(false);
      setEditingJob(null);
      editForm.resetFields();
    } catch (error) {
      message.error("Failed to update job");
      console.error(error);
    }
  };

  const handleView = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      setViewingJob(job);
      setIsViewModalOpen(true);
    }
  };

  const handleViewModalCancel = () => {
    setIsViewModalOpen(false);
    setViewingJob(null);
  };

  const handleAddJob = () => {
    setIsModalOpen(true);
    form.resetFields();
    form.setFieldsValue({
      isActive: "active",
      deadline: dayjs().add(30, 'day'),
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const formattedValues = {
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD HH:mm:ss'),
        isActive: values.isActive === "active",
      };

      const now = new Date().toISOString();
      const newJob: Job = {
        id: String(jobs.length + 1),
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        responsibilities: values.responsibilities,
        jobType: values.jobType,
        location: values.location,
        salary: values.salary || undefined,
        deadline: formattedValues.deadline,
        isActive: formattedValues.isActive,
        employerId: values.employerId,
        createdAt: now,
        updatedAt: now,
      };

      setJobs([...jobs, newJob]);
      message.success("Job created successfully!");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create job");
      console.error(error);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.location.toLowerCase().includes(searchText.toLowerCase()) ||
      job.employerId.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Job> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 250,
      render: (text: string) => (
        <span className="text-gray-700" title={text}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </span>
      ),
    },
    {
      title: "Job Type",
      dataIndex: "jobType",
      key: "jobType",
      width: 120,
      render: (jobType: string) => <Tag>{jobType}</Tag>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 120,
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      width: 150,
      render: (salary: string) => salary || <span className="text-gray-400">Not specified</span>,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      width: 150,
      sorter: (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      render: (deadline: string) => new Date(deadline).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Employer ID",
      dataIndex: "employerId",
      key: "employerId",
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete job"
            description="Are you sure you want to delete this job?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Jobs Management</h1>
        <div className="flex items-center justify-between gap-3">
          <Input
            size="large"
            placeholder="Search jobs by title, company, or location..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddJob}
            size="large"
            className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
          >
            Add Job
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredJobs}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow-sm"
        scroll={{ x: 1500 }}
      />

      {/* Add Job Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={700}
        className="top-10"
      >
        {/* Beautiful Header */}
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Add New Job</h2>
          <p className="text-white/90">Create a new job posting for your organization</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
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

            <Form.Item className="mb-0 mt-6">
              <div className="flex justify-end gap-3">
                <Button onClick={handleModalCancel} size="large">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                >
                  Create Job
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Edit Job Modal */}
      <Modal
        open={isEditModalOpen}
        onCancel={handleEditModalCancel}
        footer={null}
        width={700}
        className="top-10"
      >
        {/* Beautiful Header */}
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Edit Job</h2>
          <p className="text-white/90">Update job posting information</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditFormSubmit}
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

            <Form.Item className="mb-0 mt-6">
              <div className="flex justify-end gap-3">
                <Button onClick={handleEditModalCancel} size="large">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                >
                  Update Job
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* View Job Modal */}
      <Modal
        open={isViewModalOpen}
        onCancel={handleViewModalCancel}
        footer={[
          <Button key="close" onClick={handleViewModalCancel} size="large">
            Close
          </Button>,
        ]}
        width={700}
        className="top-10"
      >
        {/* Beautiful Header */}
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Job Details</h2>
          <p className="text-white/90">View complete job posting information</p>
        </div>

        {viewingJob && (
          <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Job ID</label>
                  <p className="text-gray-900 mt-1 font-medium">{viewingJob.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <p className="mt-1">
                    <Tag color={viewingJob.isActive ? "green" : "red"} className="text-base px-3 py-1">
                      {viewingJob.isActive ? "Active" : "Inactive"}
                    </Tag>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Job Title</label>
                <p className="text-gray-900 mt-1 text-2xl font-bold">{viewingJob.title}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Description</label>
                <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {viewingJob.description}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Requirements</label>
                <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {viewingJob.requirements}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Responsibilities</label>
                <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {viewingJob.responsibilities}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Job Type</label>
                  <p className="mt-2">
                    <Tag className="text-base px-3 py-1">{viewingJob.jobType}</Tag>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Location</label>
                  <p className="text-gray-900 mt-1 text-lg">{viewingJob.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Salary</label>
                  <p className="text-gray-900 mt-1 text-lg">
                    {viewingJob.salary || <span className="text-gray-400">Not specified</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Application Deadline</label>
                  <p className="text-gray-900 mt-1 text-lg">
                    {new Date(viewingJob.deadline).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Employer ID</label>
                <p className="text-gray-900 mt-1 text-lg font-medium">{viewingJob.employerId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Created At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(viewingJob.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Updated At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(viewingJob.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
