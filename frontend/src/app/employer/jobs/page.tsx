"use client";

import { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Input, message, Popconfirm, Modal, Form, Select, DatePicker, Spin, Tooltip } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { getJobs, createJob, updateJob, deleteJob, Job, JobType, CreateJobDto, getJobViewsForEmployer } from "@/app/services/jobs.service";
import { getCurrentUser } from "@/app/services/users.service";

export default function EmployerJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [jobViews, setJobViews] = useState<Record<number, number>>({});
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchCurrentUser();
    fetchJobs();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUserId(user.id);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const allJobs = await getJobs();
      let userId = currentUserId;
      
      // Filter jobs for current employer
      if (!userId) {
        // If user not loaded yet, fetch it
        const user = await getCurrentUser();
        userId = user.id;
        setCurrentUserId(user.id);
      }
      
      const myJobs = allJobs.filter(j => j.employerId === userId);
      setJobs(myJobs);

      // Fetch view counts for all jobs
      try {
        const views = await getJobViewsForEmployer();
        const viewsMap: Record<number, number> = {};
        views.forEach(v => {
          viewsMap[v.jobId] = v.viewCount;
        });
        setJobViews(viewsMap);
      } catch (error) {
        console.error("Error fetching views:", error);
        // Continue even if views fail to load
      }
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      message.error("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter((job) => job.id !== id));
      message.success("Job deleted successfully");
      fetchJobs();
    } catch (error: any) {
      console.error("Error deleting job:", error);
      message.error(error?.response?.data?.message || "Failed to delete job. Please try again.");
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsEditModalOpen(true);
    editForm.setFieldsValue({
      ...job,
      deadline: dayjs(job.deadline),
      jobType: job.jobType,
    });
  };

  const handleView = async (id: number) => {
    try {
      const job = jobs.find(j => j.id === id);
      if (job) {
        setViewingJob(job);
        setIsViewModalOpen(true);
      }
    } catch (error: any) {
      message.error("Failed to load job details");
    }
  };

  const handleAddJob = () => {
    setIsModalOpen(true);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      deadline: dayjs().add(30, 'day'),
      jobType: JobType.FULL_TIME,
    });
  };

  const handleFormSubmit = async (values: any) => {
    try {
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
      message.success("Job created successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchJobs();
    } catch (error: any) {
      console.error("Error creating job:", error);
      message.error(error?.response?.data?.message || "Failed to create job. Please try again.");
    }
  };

  const handleEditFormSubmit = async (values: any) => {
    if (!editingJob) return;
    try {
      const jobData: Partial<CreateJobDto> = {
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
      
      await updateJob(editingJob.id, jobData);
      message.success("Job updated successfully!");
      setIsEditModalOpen(false);
      setEditingJob(null);
      fetchJobs();
    } catch (error: any) {
      console.error("Error updating job:", error);
      message.error(error?.response?.data?.message || "Failed to update job. Please try again.");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchText.toLowerCase()) ||
    job.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Job> = [
    { 
      title: "Title", 
      dataIndex: "title", 
      key: "title", 
      width: 200,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    { 
      title: "Job Type", 
      dataIndex: "jobType", 
      key: "jobType", 
      width: 120,
      render: (jobType: JobType) => {
        const colors: Record<JobType, string> = {
          [JobType.FULL_TIME]: "blue",
          [JobType.PART_TIME]: "green",
          [JobType.CONTRACT]: "orange",
          [JobType.INTERNSHIP]: "purple",
        };
        return <Tag color={colors[jobType]}>{jobType.replace('_', ' ')}</Tag>;
      },
    },
    { title: "Location", dataIndex: "location", key: "location", width: 120 },
    { 
      title: "Salary", 
      dataIndex: "salary", 
      key: "salary", 
      width: 150,
      render: (salary: string) => salary || <span className="text-gray-400">null</span>,
    },
    {
      title: "Views",
      key: "views",
      width: 100,
      render: (_, record) => (
        <span className="font-medium text-primary-green">{jobViews[record.id] || 0}</span>
      ),
    },
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
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      width: 120,
      render: (deadline: string) => new Date(deadline).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record.id)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm 
              title="Are you sure you want to delete this job?" 
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
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

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredJobs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-lg shadow-sm"
          scroll={{ x: 1000 }}
        />
      )}

      {/* Add Job Modal */}
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={700}>
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Add New Job</h2>
          <p className="text-white/90">Create a new job posting for your company</p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="title" label="Job Title" rules={[{ required: true, message: "Please enter job title" }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <Form.Item name="requirements" label="Requirements" rules={[{ required: true, message: "Please enter requirements" }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <Form.Item name="responsibilities" label="Responsibilities" rules={[{ required: true, message: "Please enter responsibilities" }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="jobType" label="Job Type" rules={[{ required: true, message: "Please select job type" }]}>
                <Select size="large">
                  <Select.Option value={JobType.FULL_TIME}>Full-time</Select.Option>
                  <Select.Option value={JobType.PART_TIME}>Part-time</Select.Option>
                  <Select.Option value={JobType.CONTRACT}>Contract</Select.Option>
                  <Select.Option value={JobType.INTERNSHIP}>Internship</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter location" }]}>
                <Input size="large" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="salary" label="Salary">
                <Input size="large" placeholder="e.g., $50,000 - $70,000" />
              </Form.Item>
              <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: "Please select deadline" }]}>
                <DatePicker size="large" className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </div>
            <Form.Item className="mt-6">
              <div className="flex justify-end gap-3">
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" className="bg-primary-green hover:bg-primary-green-dark border-primary-green">
                  Create Job
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} footer={null} width={700}>
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Edit Job</h2>
          <p className="text-white/90">Update job information</p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <Form form={editForm} layout="vertical" onFinish={handleEditFormSubmit}>
            <Form.Item name="title" label="Job Title" rules={[{ required: true, message: "Please enter job title" }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <Form.Item name="requirements" label="Requirements" rules={[{ required: true, message: "Please enter requirements" }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <Form.Item name="responsibilities" label="Responsibilities" rules={[{ required: true, message: "Please enter responsibilities" }]}>
              <Input.TextArea rows={4} size="large" />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="jobType" label="Job Type" rules={[{ required: true, message: "Please select job type" }]}>
                <Select size="large">
                  <Select.Option value={JobType.FULL_TIME}>Full-time</Select.Option>
                  <Select.Option value={JobType.PART_TIME}>Part-time</Select.Option>
                  <Select.Option value={JobType.CONTRACT}>Contract</Select.Option>
                  <Select.Option value={JobType.INTERNSHIP}>Internship</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter location" }]}>
                <Input size="large" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="salary" label="Salary">
                <Input size="large" placeholder="e.g., $50,000 - $70,000" />
              </Form.Item>
              <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: "Please select deadline" }]}>
                <DatePicker size="large" className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </div>
            <Form.Item className="mt-6">
              <div className="flex justify-end gap-3">
                <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" className="bg-primary-green hover:bg-primary-green-dark border-primary-green">
                  Update Job
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal 
        open={isViewModalOpen} 
        onCancel={() => setIsViewModalOpen(false)} 
        footer={[<Button key="close" onClick={() => setIsViewModalOpen(false)}>Close</Button>]} 
        width={700}
      >
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Job Details</h2>
          <p className="text-white/90">View job information</p>
        </div>
        {viewingJob && (
          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
            <div><label className="font-semibold">Title:</label> <p className="text-lg">{viewingJob.title}</p></div>
            <div><label className="font-semibold">Description:</label> <p className="bg-gray-50 p-4 rounded-lg">{viewingJob.description}</p></div>
            <div><label className="font-semibold">Requirements:</label> <p className="bg-gray-50 p-4 rounded-lg">{viewingJob.requirements}</p></div>
            <div><label className="font-semibold">Responsibilities:</label> <p className="bg-gray-50 p-4 rounded-lg">{viewingJob.responsibilities}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-semibold">Job Type:</label> <p><Tag>{viewingJob.jobType.replace('_', ' ')}</Tag></p></div>
              <div><label className="font-semibold">Location:</label> <p>{viewingJob.location}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-semibold">Salary:</label> <p>{viewingJob.salary || <span className="text-gray-400">null</span>}</p></div>
              <div><label className="font-semibold">Deadline:</label> <p>{new Date(viewingJob.deadline).toLocaleDateString()}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="font-semibold">Views:</label> <p className="font-medium text-primary-green">{jobViews[viewingJob.id] || 0}</p></div>
              <div><label className="font-semibold">Status:</label> <p><Tag color={viewingJob.isActive ? "green" : "red"}>{viewingJob.isActive ? "Active" : "Inactive"}</Tag></p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
