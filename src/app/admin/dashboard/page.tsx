"use client";

import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BuildOutlined,
  FileTextOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  applicants: number;
  postedDate: string;
  status: string;
}

// Mock data - replace with actual API calls
const stats = {
  totalUsers: 150,
  totalJobSeekers: 120,
  totalJobs: 45,
  totalApplications: 230,
};

// Top 5 jobs with most applicants
const topJobs = [
  { id: "1", title: "Frontend Developer", company: "ABC Corp", applicants: 45 },
  { id: "2", title: "Backend Developer", company: "XYZ Ltd", applicants: 38 },
  { id: "3", title: "UI/UX Designer", company: "Tech Solutions", applicants: 32 },
  { id: "4", title: "Full Stack Developer", company: "Digital Innovations", applicants: 28 },
  { id: "5", title: "DevOps Engineer", company: "Cloud Systems", applicants: 25 },
];

// Recently added jobs (only 4 for 2x2 grid)
const recentJobs = [
  { id: "1", title: "Frontend Developer", company: "ABC Corp", location: "Mogadishu", postedDate: "2 hours ago" },
  { id: "2", title: "Backend Developer", company: "XYZ Ltd", location: "Hargeisa", postedDate: "5 hours ago" },
  { id: "3", title: "UI/UX Designer", company: "Tech Solutions", location: "Hargeisa", postedDate: "1 day ago" },
  { id: "4", title: "Full Stack Developer", company: "Digital Innovations", location: "Mogadishu", postedDate: "2 days ago" },
];

// All jobs for table
const allJobs: Job[] = [
  { id: "1", title: "Frontend Developer", company: "ABC Corp", location: "Mogadishu", applicants: 45, postedDate: "2024-01-15", status: "open" },
  { id: "2", title: "Backend Developer", company: "XYZ Ltd", location: "Hargeisa", applicants: 38, postedDate: "2024-01-20", status: "open" },
  { id: "3", title: "UI/UX Designer", company: "Tech Solutions", location: "Hargeisa", applicants: 32, postedDate: "2024-02-01", status: "open" },
  { id: "4", title: "Full Stack Developer", company: "Digital Innovations", location: "Mogadishu", applicants: 28, postedDate: "2024-02-05", status: "open" },
  { id: "5", title: "DevOps Engineer", company: "Cloud Systems", location: "Mogadishu", applicants: 25, postedDate: "2024-02-10", status: "open" },
  { id: "6", title: "Data Scientist", company: "AI Analytics", location: "Hargeisa", applicants: 20, postedDate: "2024-02-12", status: "closed" },
];

export default function AdminDashboard() {
  const jobColumns: ColumnsType<Job> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
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
      sorter: (a, b) => a.applicants - b.applicants,
      render: (count: number) => (
        <Tag color="blue">{count} applicants</Tag>
      ),
    },
    {
      title: "Posted Date",
      dataIndex: "postedDate",
      key: "postedDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "open" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-[#059669] border-0">
            <Statistic
              title={<span className="text-white/90">Total Users</span>}
              value={stats.totalUsers}
              prefix={<UserOutlined className="text-white" />}
              valueStyle={{ color: "#ffffff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-primary-green border-0">
            <Statistic
              title={<span className="text-white/90">Job Seekers</span>}
              value={stats.totalJobSeekers}
              prefix={<TeamOutlined className="text-white" />}
              valueStyle={{ color: "#ffffff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-primary-green-light border-0">
            <Statistic
              title="Total Jobs"
              value={stats.totalJobs}
              prefix={<BuildOutlined className="text-primary-green" />}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gray-100 border-0">
            <Statistic
              title="Applications"
              value={stats.totalApplications}
              prefix={<FileTextOutlined className="text-gray-600" />}
              valueStyle={{ color: "#4b5563" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Top Jobs Chart and Recent Jobs */}
      <Row gutter={[24, 24]} className="mb-8">
        {/* Left: Job Stats Bar Chart */}
        <Col xs={24} lg={12}>
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Job Stats</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary-green-light"></div>
                  <span className="text-sm text-gray-600">Job Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary-green"></div>
                  <span className="text-sm text-gray-600">Job Applied</span>
                </div>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="relative">
              {/* Y-axis labels */}
              <div className="flex items-end justify-between h-64 mb-2">
                {/* Y-axis */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>5K</span>
                  <span>4K</span>
                  <span>3K</span>
                  <span>2K</span>
                  <span>1K</span>
                  <span>0</span>
                </div>
                
                {/* Chart bars */}
                <div className="flex-1 ml-8 flex items-end justify-between gap-2 h-full">
                  {[
                    { day: "Mon", views: 2300, applied: 1600 },
                    { day: "Tue", views: 1600, applied: 2200 },
                    { day: "Wed", views: 2400, applied: 3100 },
                    { day: "Thu", views: 3200, applied: 1200 },
                    { day: "Fri", views: 2400, applied: 4500 },
                    { day: "Sat", views: 4500, applied: 3100 },
                    { day: "Sun", views: 2400, applied: 2500 },
                  ].map((data, index) => {
                    const maxValue = 5000;
                    const viewsHeight = (data.views / maxValue) * 100;
                    const appliedHeight = (data.applied / maxValue) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full">
                        <div className="flex items-end gap-1 w-full h-full">
                          {/* Job Views Bar */}
                          <div
                            className="flex-1 bg-primary-green-light rounded-t hover:bg-primary-green transition-colors cursor-pointer relative group"
                            style={{ height: `${viewsHeight}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {data.views.toLocaleString()}
                            </div>
                          </div>
                          {/* Job Applied Bar */}
                          <div
                            className="flex-1 bg-primary-green rounded-t hover:bg-primary-green-dark transition-colors cursor-pointer relative group"
                            style={{ height: `${appliedHeight}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {data.applied.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {/* X-axis label */}
                        <div className="text-xs text-gray-600 mt-2">{data.day}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right: Recently Added Jobs - 2x2 Grid */}
        <Col xs={24} lg={12}>
          <Card className="h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recently Added Jobs
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 border-l-4 border-primary-green hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-1">{job.title}</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <BuildOutlined className="text-primary-green" />
                      <span className="truncate">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <EnvironmentOutlined className="text-primary-green" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                      <CalendarOutlined className="text-primary-green" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Jobs Table */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Jobs</h2>
        <Table
          columns={jobColumns}
          dataSource={allJobs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="bg-white"
        />
      </Card>
    </div>
  );
}
