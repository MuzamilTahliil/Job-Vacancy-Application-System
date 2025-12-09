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
  createdAt: string;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    description: "We are looking for an experienced Frontend Developer...",
    requirements: "3+ years of experience with React, TypeScript",
    responsibilities: "Develop and maintain user-facing features",
    jobType: "Full-time",
    location: "Mogadishu",
    salary: "$50,000 - $70,000",
    deadline: "2024-03-15",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
];

export default function EmployerJobsPage() {
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
        ...job,
        deadline: dayjs(job.deadline),
        isActive: job.isActive ? "active" : "inactive",
      });
    }
  };

  const handleView = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      setViewingJob(job);
      setIsViewModalOpen(true);
    }
  };

  const handleAddJob = () => {
    setIsModalOpen(true);
    form.resetFields();
    form.setFieldsValue({
      isActive: "active",
      deadline: dayjs().add(30, 'day'),
    });
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const newJob: Job = {
        id: String(jobs.length + 1),
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD'),
        isActive: values.isActive === "active",
        createdAt: new Date().toISOString(),
      };
      setJobs([...jobs, newJob]);
      message.success("Job created successfully!");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create job");
    }
  };

  const handleEditFormSubmit = async (values: any) => {
    if (!editingJob) return;
    try {
      const updatedJobs = jobs.map((job) =>
        job.id === editingJob.id
          ? {
              ...job,
              ...values,
              deadline: values.deadline.format('YYYY-MM-DD'),
              isActive: values.isActive === "active",
            }
          : job
      );
      setJobs(updatedJobs);
      message.success("Job updated successfully!");
      setIsEditModalOpen(false);
      setEditingJob(null);
    } catch (error) {
      message.error("Failed to update job");
    }
  };

  const columns: ColumnsType<Job> = [
    { title: "Title", dataIndex: "title", key: "title", width: 200 },
    { title: "Job Type", dataIndex: "jobType", key: "jobType", width: 120 },
    { title: "Location", dataIndex: "location", key: "location", width: 120 },
    { title: "Salary", dataIndex: "salary", key: "salary", width: 150 },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record.id)}>View</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>Edit</Button>
          <Popconfirm title="Delete job?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Jobs</h1>
        <div className="flex items-center justify-between gap-3">
          <Input
            size="large"
            placeholder="Search jobs..."
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
        dataSource={jobs.filter((job) =>
          job.title.toLowerCase().includes(searchText.toLowerCase())
        )}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow-sm"
      />

      {/* Add Job Modal */}
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={700}>
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Add New Job</h2>
          <p className="text-white/90">Create a new job posting</p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <Form.Item name="requirements" label="Requirements" rules={[{ required: true }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <Form.Item name="responsibilities" label="Responsibilities" rules={[{ required: true }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="jobType" label="Job Type" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="Full-time">Full-time</Select.Option>
                  <Select.Option value="Part-time">Part-time</Select.Option>
                  <Select.Option value="Contract">Contract</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="salary" label="Salary">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
                <DatePicker size="large" className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </div>
            <Form.Item name="isActive" label="Status" rules={[{ required: true }]}>
              <Select size="large">
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item className="mt-6">
              <div className="flex justify-end gap-3">
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" className="bg-primary-green hover:bg-primary-green-dark border-primary-green">Create</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Edit Modal - Similar structure */}
      <Modal open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} footer={null} width={700}>
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Edit Job</h2>
          <p className="text-white/90">Update job information</p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <Form form={editForm} layout="vertical" onFinish={handleEditFormSubmit}>
            <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <Form.Item name="requirements" label="Requirements" rules={[{ required: true }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <Form.Item name="responsibilities" label="Responsibilities" rules={[{ required: true }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="jobType" label="Job Type" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="Full-time">Full-time</Select.Option>
                  <Select.Option value="Part-time">Part-time</Select.Option>
                  <Select.Option value="Contract">Contract</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="salary" label="Salary">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
                <DatePicker size="large" className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </div>
            <Form.Item name="isActive" label="Status" rules={[{ required: true }]}>
              <Select size="large">
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item className="mt-6">
              <div className="flex justify-end gap-3">
                <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" className="bg-primary-green hover:bg-primary-green-dark border-primary-green">Update</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={isViewModalOpen} onCancel={() => setIsViewModalOpen(false)} footer={[<Button key="close" onClick={() => setIsViewModalOpen(false)}>Close</Button>]} width={700}>
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Job Details</h2>
          <p className="text-white/90">View job information</p>
        </div>
        {viewingJob && (
          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
            <div><label className="font-semibold">Title:</label> <p>{viewingJob.title}</p></div>
            <div><label className="font-semibold">Description:</label> <p className="bg-gray-50 p-4 rounded-lg">{viewingJob.description}</p></div>
            <div><label className="font-semibold">Requirements:</label> <p className="bg-gray-50 p-4 rounded-lg">{viewingJob.requirements}</p></div>
            <div><label className="font-semibold">Responsibilities:</label> <p className="bg-gray-50 p-4 rounded-lg">{viewingJob.responsibilities}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-semibold">Job Type:</label> <p><Tag>{viewingJob.jobType}</Tag></p></div>
              <div><label className="font-semibold">Location:</label> <p>{viewingJob.location}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-semibold">Salary:</label> <p>{viewingJob.salary || "Not specified"}</p></div>
              <div><label className="font-semibold">Deadline:</label> <p>{new Date(viewingJob.deadline).toLocaleDateString()}</p></div>
            </div>
            <div><label className="font-semibold">Status:</label> <p><Tag color={viewingJob.isActive ? "green" : "red"}>{viewingJob.isActive ? "Active" : "Inactive"}</Tag></p></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

