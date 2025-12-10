"use client";

import { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Input, Select, message, Modal, Spin } from "antd";
import { SearchOutlined, EyeOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getApplications, updateApplicationStatus, Application, ApplicationStatus } from "@/app/services/applications.service";
import { getCurrentUser } from "@/app/services/users.service";

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Backend automatically returns only applications for employer's jobs
      const data = await getApplications();
      setApplications(data);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      message.error("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      message.success("Application status updated successfully");
    } catch (error: any) {
      console.error("Error updating application status:", error);
      message.error(error?.response?.data?.message || "Failed to update application status. Please try again.");
    }
  };

  const handleView = (application: Application) => {
    setViewingApplication(application);
    setIsViewModalOpen(true);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.job?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      app.applicant?.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: ColumnsType<Application> = [
    { 
      title: "Job Title", 
      dataIndex: ["job", "title"], 
      key: "jobTitle", 
      width: 150,
      render: (_, record) => record.job?.title || <span className="text-gray-400">null</span>,
    },
    {
      title: "Applicant",
      key: "applicant",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.applicant?.fullName || <span className="text-gray-400">null</span>}</div>
          <div className="text-sm text-gray-500">{record.applicant?.email || <span className="text-gray-400">null</span>}</div>
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
      width: 180,
      render: (status: ApplicationStatus, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 150 }}
        >
          <Select.Option value={ApplicationStatus.PENDING}>
            <Tag color="orange">Pending</Tag>
          </Select.Option>
          <Select.Option value={ApplicationStatus.REVIEWED}>
            <Tag color="blue">Reviewed</Tag>
          </Select.Option>
          <Select.Option value={ApplicationStatus.SHORTLISTED}>
            <Tag color="cyan">Shortlisted</Tag>
          </Select.Option>
          <Select.Option value={ApplicationStatus.ACCEPTED}>
            <Tag color="green">Accepted</Tag>
          </Select.Option>
          <Select.Option value={ApplicationStatus.REJECTED}>
            <Tag color="red">Rejected</Tag>
          </Select.Option>
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
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            View
          </Button>
          {record.resumeUrl && (
            <Button
              type="link"
              icon={<FileTextOutlined />}
              onClick={() => window.open(record.resumeUrl || "", "_blank")}
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
      <div className="mb-4 flex gap-4 flex-wrap">
        <Input
          size="large"
          placeholder="Search applications by job title, applicant name or email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md flex-1 min-w-[300px]"
        />
        <Select 
          size="large" 
          value={statusFilter} 
          onChange={setStatusFilter} 
          style={{ width: 180 }}
        >
          <Select.Option value="ALL">All Status</Select.Option>
          <Select.Option value={ApplicationStatus.PENDING}>Pending</Select.Option>
          <Select.Option value={ApplicationStatus.REVIEWED}>Reviewed</Select.Option>
          <Select.Option value={ApplicationStatus.SHORTLISTED}>Shortlisted</Select.Option>
          <Select.Option value={ApplicationStatus.ACCEPTED}>Accepted</Select.Option>
          <Select.Option value={ApplicationStatus.REJECTED}>Rejected</Select.Option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredApplications}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-lg shadow-sm"
          scroll={{ x: 1200 }}
        />
      )}

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
            <div>
              <label className="font-semibold">Job Title:</label> 
              <p className="text-xl font-bold">{viewingApplication.job?.title || <span className="text-gray-400">null</span>}</p>
            </div>
            <div>
              <label className="font-semibold">Applicant Name:</label> 
              <p className="text-lg">{viewingApplication.applicant?.fullName || <span className="text-gray-400">null</span>}</p>
            </div>
            <div>
              <label className="font-semibold">Email:</label> 
              <p>{viewingApplication.applicant?.email || <span className="text-gray-400">null</span>}</p>
            </div>
            {viewingApplication.applicant?.phoneNumber && (
              <div>
                <label className="font-semibold">Phone:</label> 
                <p>{viewingApplication.applicant.phoneNumber}</p>
              </div>
            )}
            <div>
              <label className="font-semibold">Cover Letter:</label> 
              <p className="bg-gray-50 p-4 rounded-lg">{viewingApplication.coverLetter}</p>
            </div>
            {viewingApplication.resumeUrl && (
              <div>
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  onClick={() => window.open(viewingApplication.resumeUrl || "", "_blank")}
                  className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                >
                  View Resume
                </Button>
              </div>
            )}
            <div>
              <label className="font-semibold">Status:</label> 
              <div className="mt-2">
                <Select
                  value={viewingApplication.status}
                  onChange={(value) => {
                    handleStatusChange(viewingApplication.id, value);
                    setViewingApplication({ ...viewingApplication, status: value });
                  }}
                  style={{ width: 200 }}
                >
                  <Select.Option value={ApplicationStatus.PENDING}>
                    <Tag color="orange">Pending</Tag>
                  </Select.Option>
                  <Select.Option value={ApplicationStatus.REVIEWED}>
                    <Tag color="blue">Reviewed</Tag>
                  </Select.Option>
                  <Select.Option value={ApplicationStatus.SHORTLISTED}>
                    <Tag color="cyan">Shortlisted</Tag>
                  </Select.Option>
                  <Select.Option value={ApplicationStatus.ACCEPTED}>
                    <Tag color="green">Accepted</Tag>
                  </Select.Option>
                  <Select.Option value={ApplicationStatus.REJECTED}>
                    <Tag color="red">Rejected</Tag>
                  </Select.Option>
                </Select>
              </div>
            </div>
            <div>
              <label className="font-semibold">Applied At:</label> 
              <p>{new Date(viewingApplication.appliedAt).toLocaleString()}</p>
            </div>
            {viewingApplication.reviewedAt && (
              <div>
                <label className="font-semibold">Reviewed At:</label> 
                <p>{new Date(viewingApplication.reviewedAt).toLocaleString()}</p>
              </div>
            )}
            {viewingApplication.notes && (
              <div>
                <label className="font-semibold">Notes:</label> 
                <p className="bg-gray-50 p-4 rounded-lg">{viewingApplication.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
