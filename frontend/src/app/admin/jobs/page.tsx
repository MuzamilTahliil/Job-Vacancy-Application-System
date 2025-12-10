"use client";

import { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Input, message, Modal, Form, Select, DatePicker, Spin, Tooltip, Popconfirm } from "antd";
import { SearchOutlined, EditOutlined, EyeOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getJobs, updateJob, createJob, deleteJob, Job, JobType } from "@/app/services/jobs.service";
import { UserRole } from "@/app/services/auth.service";
import { getCurrentUser } from "@/app/services/users.service";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Get current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUserId(user.id);
        setCurrentUserRole(user.role);
      } catch (error) {
        console.error("Error fetching current user:", error);
        // Fallback to localStorage
        if (typeof window !== "undefined") {
          const userId = localStorage.getItem("userId");
          const role = localStorage.getItem("userRole");
          setCurrentUserId(userId ? parseInt(userId) : null);
          setCurrentUserRole(role);
        }
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch jobs from backend
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Get all jobs including inactive ones - we'll filter by isActive: undefined to get all
      const allJobs = await getJobs();
      setJobs(allJobs);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      message.error("Failed to fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
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
        salary: job.salary || "",
        deadline: dayjs(job.deadline),
        isActive: job.isActive,
      });
    }
  };

  const handleView = (id: number) => {
    const job = jobs.find((j) => j.id === id);
    if (job) {
      setViewingJob(job);
      setIsViewModalOpen(true);
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
      await updateJob(editingJob.id, {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        responsibilities: values.responsibilities,
        jobType: values.jobType,
        location: values.location,
        salary: values.salary || undefined,
        deadline: values.deadline.toISOString(),
        isActive: values.isActive,
      });

      // Refresh the list
      await fetchJobs();
      message.success("Job updated successfully!");
      setIsEditModalOpen(false);
      setEditingJob(null);
      editForm.resetFields();
    } catch (error: any) {
      console.error("Error updating job:", error);
      message.error("Failed to update job. Please try again.");
    }
  };

  const handleAddJob = () => {
    setIsAddModalOpen(true);
    addForm.resetFields();
    addForm.setFieldsValue({
      isActive: true,
      deadline: dayjs().add(30, 'day'),
    });
  };

  const handleAddModalCancel = () => {
    setIsAddModalOpen(false);
    addForm.resetFields();
  };

  const handleAddFormSubmit = async (values: any) => {
    try {
      await createJob({
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        responsibilities: values.responsibilities,
        jobType: values.jobType,
        location: values.location,
        salary: values.salary || undefined,
        deadline: values.deadline.toISOString(),
        isActive: values.isActive,
      });

      // Refresh the list
      await fetchJobs();
      message.success("Job created successfully!");
      setIsAddModalOpen(false);
      addForm.resetFields();
    } catch (error: any) {
      console.error("Error creating job:", error);
      message.error("Failed to create job. Please try again.");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    // Search filter
    const matchesSearch =
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.location.toLowerCase().includes(searchText.toLowerCase()) ||
      job.employer?.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      job.employer?.companyName?.toLowerCase().includes(searchText.toLowerCase());

    // Job type filter
    const matchesJobType = jobTypeFilter === "ALL" || job.jobType === jobTypeFilter;

    // Status filter
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && job.isActive) ||
      (statusFilter === "INACTIVE" && !job.isActive);

    return matchesSearch && matchesJobType && matchesStatus;
  });

  const columns: ColumnsType<Job> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: 200,
    },
    {
      title: "Employer",
      dataIndex: ["employer", "fullName"],
      key: "employer",
      width: 180,
      render: (_, record) => record.employer?.fullName || <span className="text-gray-400">null</span>,
    },
    {
      title: "Company",
      dataIndex: ["employer", "companyName"],
      key: "company",
      width: 180,
      render: (_, record) => record.employer?.companyName || <span className="text-gray-400">null</span>,
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
      width: 140,
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
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 150,
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      width: 150,
      render: (salary: string) => salary || <span className="text-gray-400">null</span>,
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      width: 160,
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_, record) => {
        // Check if user can edit/delete this job
        const isAdmin = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SUPER_ADMIN;
        const isOwnJob = record.employerId === currentUserId;
        const isEmployerAdmin = record.employer?.role === UserRole.ADMIN || record.employer?.role === UserRole.SUPER_ADMIN;
        
        // Admin can edit/delete if: it's their own job OR employer is also admin
        // Employer can edit/delete if: it's their own job
        const canEditDelete = isAdmin 
          ? (isOwnJob || isEmployerAdmin)
          : isOwnJob;

        return (
          <Space size="large">
            <Tooltip title="View Job">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleView(record.id)}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              />
            </Tooltip>
            <Tooltip title={canEditDelete ? "Edit Job" : "You can only edit your own jobs (or admins can edit admin-created jobs)"}>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => canEditDelete ? handleEdit(record.id) : undefined}
                disabled={!canEditDelete}
                className={canEditDelete 
                  ? "text-green-500 hover:text-green-700 hover:bg-green-50" 
                  : "text-gray-300 cursor-not-allowed"}
              />
            </Tooltip>
            <Tooltip title={canEditDelete ? "Delete Job" : "You can only delete your own jobs (or admins can delete admin-created jobs)"}>
              <Popconfirm
                title="Delete job"
                description="Are you sure you want to delete this job?"
                onConfirm={() => canEditDelete ? handleDelete(record.id) : undefined}
                okText="Yes"
                cancelText="No"
                disabled={!canEditDelete}
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!canEditDelete}
                  className={canEditDelete 
                    ? "hover:bg-red-50" 
                    : "text-gray-300 cursor-not-allowed"}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Jobs Management</h1>
        <div className="flex items-center justify-between gap-3 mb-4">
          <Input
            size="large"
            placeholder="Search jobs by title, employer, company, or location..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md flex-1"
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
        <div className="flex gap-4 flex-wrap">
          <Select
            size="large"
            placeholder="Filter by Job Type"
            value={jobTypeFilter}
            onChange={(value) => setJobTypeFilter(value)}
            className="w-[200px]"
            allowClear
          >
            <Select.Option value="ALL">All Job Types</Select.Option>
            <Select.Option value={JobType.FULL_TIME}>Full Time</Select.Option>
            <Select.Option value={JobType.PART_TIME}>Part Time</Select.Option>
            <Select.Option value={JobType.CONTRACT}>Contract</Select.Option>
            <Select.Option value={JobType.INTERNSHIP}>Internship</Select.Option>
          </Select>
          <Select
            size="large"
            placeholder="Filter by Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            className="w-[200px]"
            allowClear
          >
            <Select.Option value="ALL">All Status</Select.Option>
            <Select.Option value="ACTIVE">Active</Select.Option>
            <Select.Option value="INACTIVE">Inactive</Select.Option>
          </Select>
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
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} jobs`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          className="bg-white rounded-lg shadow-sm"
          scroll={{ x: 1800 }}
          loading={loading}
          size="middle"
        />
      )}

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
                  <Select.Option value={JobType.FULL_TIME}>Full-time</Select.Option>
                  <Select.Option value={JobType.PART_TIME}>Part-time</Select.Option>
                  <Select.Option value={JobType.CONTRACT}>Contract</Select.Option>
                  <Select.Option value={JobType.INTERNSHIP}>Internship</Select.Option>
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

            <Form.Item
              name="isActive"
              label={<span className="text-gray-700 font-semibold">Active Status</span>}
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select size="large" placeholder="Select status">
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>

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
        onCancel={() => {
          setIsViewModalOpen(false);
          setViewingJob(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsViewModalOpen(false);
            setViewingJob(null);
          }} size="large">
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
                    <Tag color={
                      viewingJob.jobType === JobType.FULL_TIME ? "blue" :
                      viewingJob.jobType === JobType.PART_TIME ? "green" :
                      viewingJob.jobType === JobType.CONTRACT ? "orange" : "purple"
                    } className="text-base px-3 py-1">
                      {viewingJob.jobType.replace('_', ' ')}
                    </Tag>
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
                    {viewingJob.salary || <span className="text-gray-400">null</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Application Deadline</label>
                  <p className="text-gray-900 mt-1 text-lg">
                    {new Date(viewingJob.deadline).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Employer</label>
                  <p className="text-gray-900 mt-1 text-lg">
                    {viewingJob.employer?.fullName || <span className="text-gray-400">null</span>}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Company</label>
                  <p className="text-gray-900 mt-1 text-lg">
                    {viewingJob.employer?.companyName || <span className="text-gray-400">null</span>}
                  </p>
                </div>
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

      {/* Add Job Modal */}
      <Modal
        open={isAddModalOpen}
        onCancel={handleAddModalCancel}
        footer={null}
        width={700}
        className="top-10"
      >
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Add New Job</h2>
          <p className="text-white/90">Create a new job posting</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
          <Form
            form={addForm}
            layout="vertical"
            onFinish={handleAddFormSubmit}
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
                  <Select.Option value={JobType.FULL_TIME}>Full-time</Select.Option>
                  <Select.Option value={JobType.PART_TIME}>Part-time</Select.Option>
                  <Select.Option value={JobType.CONTRACT}>Contract</Select.Option>
                  <Select.Option value={JobType.INTERNSHIP}>Internship</Select.Option>
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

            <Form.Item
              name="isActive"
              label={<span className="text-gray-700 font-semibold">Active Status</span>}
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select size="large" placeholder="Select status">
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item className="mb-0 mt-6">
              <div className="flex justify-end gap-3">
                <Button onClick={handleAddModalCancel} size="large">
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
    </div>
  );
}
