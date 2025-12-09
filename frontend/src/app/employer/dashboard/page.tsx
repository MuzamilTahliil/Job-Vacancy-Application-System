"use client";

import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BuildOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Job {
  id: string;
  title: string;
  location: string;
  applicants: number;
  postedDate: string;
  status: string;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    location: "Mogadishu",
    applicants: 15,
    postedDate: "2024-01-15",
    status: "Active",
  },
  {
    id: "2",
    title: "Backend Developer",
    location: "Hargeisa",
    applicants: 8,
    postedDate: "2024-01-20",
    status: "Active",
  },
];

const columns: ColumnsType<Job> = [
  {
    title: "Job Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Applicants",
    dataIndex: "applicants",
    key: "applicants",
  },
  {
    title: "Posted Date",
    dataIndex: "postedDate",
    key: "postedDate",
    render: (date: string) => new Date(date).toLocaleDateString(),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
    ),
  },
];

export default function EmployerDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Employer Dashboard</h1>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-[#059669] text-white">
            <Statistic
              title={<span className="text-white">Total Jobs</span>}
              value={12}
              prefix={<BuildOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-primary-green text-white">
            <Statistic
              title={<span className="text-white">Active Jobs</span>}
              value={8}
              prefix={<BuildOutlined />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-primary-green-light">
            <Statistic
              title="Total Applications"
              value={45}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gray-100">
            <Statistic
              title="Job Seekers Viewed"
              value={120}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Jobs */}
      <Card title="Recent Jobs" className="mb-6">
        <Table
          columns={columns}
          dataSource={mockJobs}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
