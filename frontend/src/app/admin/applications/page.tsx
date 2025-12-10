"use client";

import { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Input, message, Modal, Select, Spin, Tooltip } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getApplications, updateApplicationStatus, Application, ApplicationStatus } from "@/app/services/applications.service";
import { getCurrentUser } from "@/app/services/users.service";
import { UserRole } from "@/app/services/auth.service";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
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

  // Fetch applications from backend
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const allApplications = await getApplications();
      setApplications(allApplications);
      if (allApplications.length === 0) {
        message.info("No applications found.");
      }
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      const errorMessage = error?.response?.data?.message || "Failed to fetch applications. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: number) => {
    const application = applications.find((a) => a.id === id);
    if (application) {
      setViewingApplication(application);
      setIsViewModalOpen(true);
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      message.success("Application status updated successfully!");
      await fetchApplications();
      // Update the viewing application if it's the one being updated
      if (viewingApplication?.id === applicationId) {
        setViewingApplication({ ...viewingApplication, status: newStatus });
      }
    } catch (error: any) {
      console.error("Error updating application status:", error);
      message.error(error?.response?.data?.message || "Failed to update application status. Please try again.");
    }
  };

  const handleViewModalCancel = () => {
    setIsViewModalOpen(false);
    setViewingApplication(null);
  };

  const filteredApplications = applications.filter((application) => {
    // Search filter
    const matchesSearch =
      application.job?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      application.applicant?.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      application.applicant?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      application.coverLetter?.toLowerCase().includes(searchText.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === "ALL" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ApplicationStatus) => {
    const colors: Record<ApplicationStatus, string> = {
      [ApplicationStatus.PENDING]: "default",
      [ApplicationStatus.REVIEWED]: "blue",
      [ApplicationStatus.SHORTLISTED]: "cyan",
      [ApplicationStatus.REJECTED]: "red",
      [ApplicationStatus.ACCEPTED]: "green",
    };
    return colors[status] || "default";
  };

  const columns: ColumnsType<Application> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      fixed: "left",
    },
    {
      title: "Job Title",
      dataIndex: ["job", "title"],
      key: "jobTitle",
      width: 200,
      render: (_, record) => record.job?.title || <span className="text-gray-400">null</span>,
    },
    {
      title: "Applicant Name",
      dataIndex: ["applicant", "fullName"],
      key: "applicantName",
      width: 180,
      render: (_, record) => record.applicant?.fullName || <span className="text-gray-400">null</span>,
    },
    {
      title: "Applicant Email",
      dataIndex: ["applicant", "email"],
      key: "applicantEmail",
      width: 200,
      render: (_, record) => record.applicant?.email || <span className="text-gray-400">null</span>,
    },
    {
      title: "Cover Letter",
      dataIndex: "coverLetter",
      key: "coverLetter",
      ellipsis: true,
      width: 250,
      render: (text: string) => (
        <span className="text-gray-700" title={text}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: ApplicationStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Applied At",
      dataIndex: "appliedAt",
      key: "appliedAt",
      width: 160,
      sorter: (a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime(),
      render: (appliedAt: string) => new Date(appliedAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space size="large">
          <Tooltip title="View Application">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Applications Management</h1>
        <div className="flex gap-4 flex-wrap mb-4">
          <Input
            size="large"
            placeholder="Search applications by job title, applicant name, email, or cover letter..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md flex-1 min-w-[300px]"
          />
          <Select
            size="large"
            placeholder="Filter by Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            className="w-[200px]"
            allowClear
          >
            <Select.Option value="ALL">All Status</Select.Option>
            <Select.Option value={ApplicationStatus.PENDING}>Pending</Select.Option>
            <Select.Option value={ApplicationStatus.REVIEWED}>Reviewed</Select.Option>
            <Select.Option value={ApplicationStatus.SHORTLISTED}>Shortlisted</Select.Option>
            <Select.Option value={ApplicationStatus.REJECTED}>Rejected</Select.Option>
            <Select.Option value={ApplicationStatus.ACCEPTED}>Accepted</Select.Option>
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
          dataSource={filteredApplications}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} applications`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          className="bg-white rounded-lg shadow-sm"
          scroll={{ x: 1500 }}
          loading={loading}
          size="middle"
        />
      )}

      {/* View Application Modal */}
      <Modal
        open={isViewModalOpen}
        onCancel={handleViewModalCancel}
        footer={null}
        width={800}
        className="top-10"
      >
        {viewingApplication && (
          <>
            {/* Beautiful Header */}
            <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
              <h2 className="text-3xl font-bold mb-2">Application Details</h2>
              <p className="text-white/90">View full application information</p>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              {/* Job Information */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary-green">
                  Job Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 text-sm font-medium block mb-2">Job Title</label>
                    <p className="text-gray-800 text-base">{viewingApplication.job?.title || <span className="text-gray-400">null</span>}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm font-medium block mb-2">Job Type</label>
                    <p className="text-gray-800 text-base">{viewingApplication.job?.jobType || <span className="text-gray-400">null</span>}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm font-medium block mb-2">Location</label>
                    <p className="text-gray-800 text-base">{viewingApplication.job?.location || <span className="text-gray-400">null</span>}</p>
                  </div>
                </div>
              </div>

              {/* Applicant Information */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary-green">
                  Applicant Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 text-sm font-medium block mb-2">Full Name</label>
                    <p className="text-gray-800 text-base font-semibold">{viewingApplication.applicant?.fullName || <span className="text-gray-400">null</span>}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm font-medium block mb-2">Email</label>
                    <p className="text-gray-800 text-base">{viewingApplication.applicant?.email || <span className="text-gray-400">null</span>}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm font-medium block mb-2">Phone Number</label>
                    <p className="text-gray-800 text-base">{viewingApplication.applicant?.phoneNumber || <span className="text-gray-400">null</span>}</p>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary-green">
                  Application Details
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-gray-500 text-sm font-medium block mb-2">Status</label>
                    <Tag color={getStatusColor(viewingApplication.status)} className="text-base py-1 px-3">
                      {viewingApplication.status}
                    </Tag>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm font-medium block mb-2">Applied At</label>
                    <p className="text-gray-800 text-base">{new Date(viewingApplication.appliedAt).toLocaleString()}</p>
                  </div>
                  {viewingApplication.reviewedAt && (
                    <div>
                      <label className="text-gray-500 text-sm font-medium block mb-2">Reviewed At</label>
                      <p className="text-gray-800 text-base">{new Date(viewingApplication.reviewedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="text-gray-500 text-sm font-medium block mb-2">Update Status</label>
                  {(() => {
                    const isOwnJob = viewingApplication.job?.employerId === currentUserId;
                    const isJobOwnerAdmin = viewingApplication.job?.employer?.role === UserRole.ADMIN || viewingApplication.job?.employer?.role === UserRole.SUPER_ADMIN;
                    const isCurrentUserAdmin = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SUPER_ADMIN;
                    const canUpdate = isOwnJob || (isCurrentUserAdmin && isJobOwnerAdmin);

                    if (!canUpdate) {
                      return (
                        <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                          <p className="text-gray-600 text-sm">
                            You can only update the status of applications for your own jobs or jobs created by admins.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <Select
                        value={viewingApplication.status}
                        onChange={(value) => handleStatusChange(viewingApplication.id, value)}
                        className="w-full"
                        size="large"
                      >
                        <Select.Option value={ApplicationStatus.PENDING}>Pending</Select.Option>
                        <Select.Option value={ApplicationStatus.REVIEWED}>Reviewed</Select.Option>
                        <Select.Option value={ApplicationStatus.SHORTLISTED}>Shortlisted</Select.Option>
                        <Select.Option value={ApplicationStatus.REJECTED}>Rejected</Select.Option>
                        <Select.Option value={ApplicationStatus.ACCEPTED}>Accepted</Select.Option>
                      </Select>
                    );
                  })()}
                </div>

                <div className="mb-4">
                  <label className="text-gray-500 text-sm font-medium block mb-2">Cover Letter</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-base whitespace-pre-wrap">{viewingApplication.coverLetter}</p>
                  </div>
                </div>

                {viewingApplication.resumeUrl && (
                  <div className="mb-4">
                    <label className="text-gray-500 text-sm font-medium block mb-2">Resume</label>
                    <a
                      href={viewingApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-base"
                    >
                      View Resume
                    </a>
                  </div>
                )}

                {viewingApplication.notes && (
                  <div className="mb-4">
                    <label className="text-gray-500 text-sm font-medium block mb-2">Notes</label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-800 text-base whitespace-pre-wrap">{viewingApplication.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <Button onClick={handleViewModalCancel} size="large">
                Close
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
