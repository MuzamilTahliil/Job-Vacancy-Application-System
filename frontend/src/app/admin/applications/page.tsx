"use client";

import { useState } from "react";
import { Table, Button, Tag, Space, Input, Select, message, Modal } from "antd";
import { SearchOutlined, EyeOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Application {
  id: string;
  coverLetter: string;
  resumeUrl?: string;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  reviewedAt?: string;
  notes?: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - replace with actual API calls
const mockApplications: Application[] = [
  {
    id: "1",
    coverLetter: "I am very interested in this position and believe my skills align perfectly...",
    resumeUrl: "/resumes/john-doe.pdf",
    status: "PENDING",
    appliedAt: "2024-01-15T10:00:00Z",
    jobId: "job-001",
    jobTitle: "Frontend Developer",
    applicantId: "user-001",
    applicantName: "John Doe",
    applicantEmail: "john@example.com",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    coverLetter: "I have 5 years of experience in backend development...",
    resumeUrl: "/resumes/jane-smith.pdf",
    status: "REVIEWED",
    appliedAt: "2024-01-20T10:00:00Z",
    reviewedAt: "2024-01-21T10:00:00Z",
    notes: "Strong candidate, good experience",
    jobId: "job-002",
    jobTitle: "Backend Developer",
    applicantId: "user-002",
    applicantName: "Jane Smith",
    applicantEmail: "jane@example.com",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-21T10:00:00Z",
  },
  {
    id: "3",
    coverLetter: "I am excited to apply for this UI/UX Designer position...",
    resumeUrl: "/resumes/bob-johnson.pdf",
    status: "ACCEPTED",
    appliedAt: "2024-02-01T10:00:00Z",
    reviewedAt: "2024-02-02T10:00:00Z",
    notes: "Excellent portfolio, hired",
    jobId: "job-003",
    jobTitle: "UI/UX Designer",
    applicantId: "user-003",
    applicantName: "Bob Johnson",
    applicantEmail: "bob@example.com",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-02T10:00:00Z",
  },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(mockApplications);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);

  const handleStatusChange = (id: string, newStatus: string) => {
    const now = new Date().toISOString();
    setApplications(
      applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status: newStatus as Application["status"],
              reviewedAt: newStatus !== "PENDING" ? now : app.reviewedAt,
              updatedAt: now,
            }
          : app
      )
    );
    message.success("Application status updated");
  };

  const handleView = (application: Application) => {
    setViewingApplication(application);
    setIsViewModalOpen(true);
  };

  const handleViewModalCancel = () => {
    setIsViewModalOpen(false);
    setViewingApplication(null);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchText.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: ColumnsType<Application> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
      width: 150,
      sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
    },
    {
      title: "Job ID",
      dataIndex: "jobId",
      key: "jobId",
      width: 120,
    },
    {
      title: "Applicant",
      key: "applicant",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.applicantName}</div>
          <div className="text-sm text-gray-500">{record.applicantEmail}</div>
          <div className="text-xs text-gray-400">ID: {record.applicantId}</div>
        </div>
      ),
    },
    {
      title: "Cover Letter",
      dataIndex: "coverLetter",
      key: "coverLetter",
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <span className="text-gray-700" title={text}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </span>
      ),
    },
    {
      title: "Resume",
      dataIndex: "resumeUrl",
      key: "resumeUrl",
      width: 100,
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-green">
            View Resume
          </a>
        ) : (
          <span className="text-gray-400">No resume</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Select.Option value="PENDING">
            <Tag color="orange">Pending</Tag>
          </Select.Option>
          <Select.Option value="REVIEWED">
            <Tag color="blue">Reviewed</Tag>
          </Select.Option>
          <Select.Option value="ACCEPTED">
            <Tag color="green">Accepted</Tag>
          </Select.Option>
          <Select.Option value="REJECTED">
            <Tag color="red">Rejected</Tag>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      width: 150,
      ellipsis: true,
      render: (notes: string) => notes || <span className="text-gray-400">No notes</span>,
    },
    {
      title: "Applied At",
      dataIndex: "appliedAt",
      key: "appliedAt",
      width: 150,
      sorter: (a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime(),
      render: (appliedAt: string) => new Date(appliedAt).toLocaleDateString(),
    },
    {
      title: "Reviewed At",
      dataIndex: "reviewedAt",
      key: "reviewedAt",
      width: 150,
      render: (reviewedAt: string) =>
        reviewedAt ? new Date(reviewedAt).toLocaleDateString() : <span className="text-gray-400">Not reviewed</span>,
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
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (updatedAt: string) => new Date(updatedAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Applications</h1>
      </div>

      <div className="mb-4 flex gap-4">
        <Input
          size="large"
          placeholder="Search applications..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
        />
        <Select
          size="large"
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="REVIEWED">Reviewed</Select.Option>
          <Select.Option value="ACCEPTED">Accepted</Select.Option>
          <Select.Option value="REJECTED">Rejected</Select.Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredApplications}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow-sm"
        scroll={{ x: 1800 }}
      />

      {/* View Application Modal */}
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
          <h2 className="text-3xl font-bold mb-2">Application Details</h2>
          <p className="text-white/90">View complete application information</p>
        </div>

        {viewingApplication && (
          <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Application ID</label>
                  <p className="text-gray-900 mt-1 font-medium">{viewingApplication.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <p className="mt-1">
                    <Tag
                      color={
                        viewingApplication.status === "ACCEPTED"
                          ? "green"
                          : viewingApplication.status === "REJECTED"
                          ? "red"
                          : viewingApplication.status === "REVIEWED"
                          ? "blue"
                          : "orange"
                      }
                      className="text-base px-3 py-1"
                    >
                      {viewingApplication.status}
                    </Tag>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Job Title</label>
                  <p className="text-gray-900 mt-1 text-xl font-bold">{viewingApplication.jobTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Job ID</label>
                  <p className="text-gray-900 mt-1">{viewingApplication.jobId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Applicant Name</label>
                  <p className="text-gray-900 mt-1 text-xl font-bold">{viewingApplication.applicantName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Applicant Email</label>
                  <p className="text-gray-900 mt-1 text-lg">{viewingApplication.applicantEmail}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Applicant ID</label>
                <p className="text-gray-900 mt-1">{viewingApplication.applicantId}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Cover Letter</label>
                <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {viewingApplication.coverLetter}
                </p>
              </div>

              {viewingApplication.resumeUrl && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Resume</label>
                  <div className="mt-2">
                    <Button
                      type="primary"
                      icon={<FileTextOutlined />}
                      onClick={() => window.open(viewingApplication.resumeUrl, "_blank")}
                      className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                    >
                      View Resume
                    </Button>
                  </div>
                </div>
              )}

              {viewingApplication.notes && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Notes</label>
                  <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {viewingApplication.notes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Applied At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(viewingApplication.appliedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Reviewed At</label>
                  <p className="text-gray-900 mt-1">
                    {viewingApplication.reviewedAt
                      ? new Date(viewingApplication.reviewedAt).toLocaleString()
                      : <span className="text-gray-400">Not reviewed yet</span>}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Created At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(viewingApplication.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Updated At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(viewingApplication.updatedAt).toLocaleString()}
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

