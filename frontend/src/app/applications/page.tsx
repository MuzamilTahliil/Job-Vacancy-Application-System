"use client";

import { useState, useEffect } from "react";
import { Table, Tag, Spin, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getApplications, Application, ApplicationStatus } from "@/app/services/applications.service";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplications();
      setApplications(data);
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      message.error("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ApplicationStatus): string => {
    const colors: Record<ApplicationStatus, string> = {
      [ApplicationStatus.PENDING]: "orange",
      [ApplicationStatus.REVIEWED]: "blue",
      [ApplicationStatus.SHORTLISTED]: "cyan",
      [ApplicationStatus.ACCEPTED]: "green",
      [ApplicationStatus.REJECTED]: "red",
    };
    return colors[status] || "default";
  };

  const columns: ColumnsType<Application> = [
    {
      title: "Job Title",
      dataIndex: ["job", "title"],
      key: "jobTitle",
      render: (_, record) => record.job?.title || <span className="text-gray-400">null</span>,
    },
    {
      title: "Company",
      key: "company",
      render: (_, record) => record.job?.employer?.companyName || <span className="text-gray-400">null</span>,
    },
    {
      title: "Location",
      dataIndex: ["job", "location"],
      key: "location",
      render: (_, record) => record.job?.location || <span className="text-gray-400">null</span>,
    },
    {
      title: "Applied At",
      dataIndex: "appliedAt",
      key: "appliedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ApplicationStatus) => (
        <Tag color={getStatusColor(status)}>{status.replace('_', ' ')}</Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-24">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
}

