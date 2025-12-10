"use client";

import { useState, useEffect } from "react";
import { Table, Tag, Spin, message, Card } from "antd";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getJobViewersForEmployer, JobViewer } from "@/app/services/jobs.service";

export default function JobViewersPage() {
  const [viewers, setViewers] = useState<JobViewer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViewers();
  }, []);

  const fetchViewers = async () => {
    try {
      setLoading(true);
      const data = await getJobViewersForEmployer();
      setViewers(data);
    } catch (error: any) {
      console.error("Error fetching job viewers:", error);
      message.error("Failed to fetch job viewers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<JobViewer> = [
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
      width: 200,
    },
    {
      title: "Job Seeker Name",
      key: "viewerName",
      width: 180,
      render: (_, record) => record.viewer?.fullName || <span className="text-gray-400">Anonymous</span>,
    },
    {
      title: "Email",
      key: "email",
      width: 200,
      render: (_, record) => record.viewer?.email || <span className="text-gray-400">null</span>,
    },
    {
      title: "Phone",
      key: "phone",
      width: 150,
      render: (_, record) => record.viewer?.phoneNumber || <span className="text-gray-400">null</span>,
    },
    {
      title: "Viewed At",
      dataIndex: "viewedAt",
      key: "viewedAt",
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.viewedAt).getTime() - new Date(b.viewedAt).getTime(),
      defaultSortOrder: 'descend',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Viewers</h1>
        <p className="text-gray-600">See which job seekers have viewed your job postings</p>
      </div>

      <Card className="bg-white rounded-lg shadow-sm">
        {viewers.length > 0 ? (
          <Table
            columns={columns}
            dataSource={viewers}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        ) : (
          <div className="text-center py-16">
            <EyeOutlined className="text-5xl text-gray-300 mb-4" />
            <p className="text-lg text-gray-600 mb-2">No job viewers yet</p>
            <p className="text-gray-500">Job seekers who view your jobs will appear here</p>
          </div>
        )}
      </Card>
    </div>
  );
}

