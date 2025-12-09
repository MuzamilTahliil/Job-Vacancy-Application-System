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
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
}

const mockApplications: Application[] = [
  {
    id: "1",
    coverLetter: "I am very interested in this position...",
    resumeUrl: "/resumes/john-doe.pdf",
    status: "PENDING",
    appliedAt: "2024-01-15T10:00:00Z",
    jobTitle: "Frontend Developer",
    applicantName: "John Doe",
    applicantEmail: "john@example.com",
  },
];

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState(mockApplications);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);

  const handleStatusChange = (id: string, newStatus: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: newStatus as Application["status"] } : app
      )
    );
    message.success("Application status updated");
  };

  const handleView = (application: Application) => {
    setViewingApplication(application);
    setIsViewModalOpen(true);
  };

  const columns: ColumnsType<Application> = [
    { title: "Job Title", dataIndex: "jobTitle", key: "jobTitle", width: 150 },
    {
      title: "Applicant",
      key: "applicant",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.applicantName}</div>
          <div className="text-sm text-gray-500">{record.applicantEmail}</div>
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
        <span title={text}>{text.length > 50 ? `${text.substring(0, 50)}...` : text}</span>
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
          <Select.Option value="PENDING"><Tag color="orange">Pending</Tag></Select.Option>
          <Select.Option value="REVIEWED"><Tag color="blue">Reviewed</Tag></Select.Option>
          <Select.Option value="ACCEPTED"><Tag color="green">Accepted</Tag></Select.Option>
          <Select.Option value="REJECTED"><Tag color="red">Rejected</Tag></Select.Option>
        </Select>
      ),
    },
    {
      title: "Applied At",
      dataIndex: "appliedAt",
      key: "appliedAt",
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>View</Button>
          {record.resumeUrl && (
            <Button
              type="link"
              icon={<FileTextOutlined />}
              onClick={() => window.open(record.resumeUrl, "_blank")}
            >
              Resume
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Applications</h1>
      <div className="mb-4 flex gap-4">
        <Input
          size="large"
          placeholder="Search applications..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
        />
        <Select size="large" value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}>
          <Select.Option value="all">All Status</Select.Option>
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="REVIEWED">Reviewed</Select.Option>
          <Select.Option value="ACCEPTED">Accepted</Select.Option>
          <Select.Option value="REJECTED">Rejected</Select.Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={applications.filter((app) => {
          const matchesSearch = app.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
            app.applicantName.toLowerCase().includes(searchText.toLowerCase());
          const matchesStatus = statusFilter === "all" || app.status === statusFilter;
          return matchesSearch && matchesStatus;
        })}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow-sm"
      />

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsViewModalOpen(false)}>Close</Button>]}
        width={700}
      >
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Application Details</h2>
          <p className="text-white/90">View application information</p>
        </div>
        {viewingApplication && (
          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
            <div><label className="font-semibold">Job Title:</label> <p className="text-xl font-bold">{viewingApplication.jobTitle}</p></div>
            <div><label className="font-semibold">Applicant Name:</label> <p className="text-lg">{viewingApplication.applicantName}</p></div>
            <div><label className="font-semibold">Email:</label> <p>{viewingApplication.applicantEmail}</p></div>
            <div><label className="font-semibold">Cover Letter:</label> <p className="bg-gray-50 p-4 rounded-lg">{viewingApplication.coverLetter}</p></div>
            {viewingApplication.resumeUrl && (
              <div>
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  onClick={() => window.open(viewingApplication.resumeUrl, "_blank")}
                  className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                >
                  View Resume
                </Button>
              </div>
            )}
            <div><label className="font-semibold">Applied At:</label> <p>{new Date(viewingApplication.appliedAt).toLocaleString()}</p></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

