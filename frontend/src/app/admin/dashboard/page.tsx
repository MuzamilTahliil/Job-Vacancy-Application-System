"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Spin, Avatar } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BuildOutlined,
  FileTextOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getUsers } from "@/app/services/users.service";
import { getJobs, Job } from "@/app/services/jobs.service";
import { getApplications } from "@/app/services/applications.service";
import { getAllJobSeekers } from "@/app/services/profiles.service";
import { getCurrentUser, User } from "@/app/services/users.service";
import { UserRole } from "@/app/services/auth.service";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobSeekers: 0,
    totalJobs: 0,
    totalApplications: 0,
    myJobs: 0,
    myApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [users, jobSeekers, jobs, applications, user] = await Promise.all([
        getUsers(),
        getAllJobSeekers(),
        getJobs(),
        getApplications(),
        getCurrentUser(),
      ]);

      // Set current user
      setCurrentUser(user);

      // Calculate statistics
      const jobSeekerCount = users.filter(u => u.role === UserRole.JOB_SEEKER).length;
      const myJobsCount = jobs.filter(j => j.employerId === user.id).length;
      const myApplicationsCount = applications.filter(a => a.job?.employerId === user.id).length;

      setStats({
        totalUsers: users.length,
        totalJobSeekers: jobSeekerCount,
        totalJobs: jobs.length,
        totalApplications: applications.length,
        myJobs: myJobsCount,
        myApplications: myApplicationsCount,
      });

      // Get recent jobs (last 4)
      const sortedJobs = [...jobs].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentJobs(sortedJobs.slice(0, 4));

      // Set all jobs
      setAllJobs(jobs);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      dataIndex: ["employer", "companyName"],
      key: "company",
      render: (_, record) => record.employer?.companyName || <span className="text-gray-400">null</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Job Type",
      dataIndex: "jobType",
      key: "jobType",
      render: (jobType: string) => (
        <Tag color="blue">{jobType.replace('_', ' ')}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "OPEN" : "CLOSED"}
        </Tag>
      ),
    },
    {
      title: "Posted Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section with Admin Info */}
      {currentUser && (
        <Card className="mb-6 bg-gradient-to-r from-primary-green to-primary-green-dark border-0">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.fullName}!</h1>
              <p className="text-white/90 text-lg">
                {currentUser.role === UserRole.SUPER_ADMIN ? "Super Administrator" : "Administrator"}
                {currentUser.companyName && ` • ${currentUser.companyName}`}
              </p>
              <div className="mt-3 flex items-center gap-4 text-white/80">
                <span className="text-sm">{currentUser.email}</span>
                {currentUser.phoneNumber && (
                  <span className="text-sm">• {currentUser.phoneNumber}</span>
                )}
              </div>
            </div>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className="border-4 border-white bg-white/20"
            >
              {currentUser.fullName?.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        </Card>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

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

      {/* My Statistics (Admin's own data) */}
      {currentUser && (
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="border-2 border-primary-green">
              <Statistic
                title={<span className="text-gray-700 font-semibold">My Jobs</span>}
                value={stats.myJobs}
                prefix={<BuildOutlined className="text-primary-green" />}
                valueStyle={{ color: "#10b981" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="border-2 border-primary-green">
              <Statistic
                title={<span className="text-gray-700 font-semibold">My Applications</span>}
                value={stats.myApplications}
                prefix={<FileTextOutlined className="text-primary-green" />}
                valueStyle={{ color: "#10b981" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Top Jobs Chart and Recent Jobs */}
      <Row gutter={[24, 24]} className="mb-8">
        {/* Left: Job Stats Bar Chart */}
        <Col xs={24} lg={12}>
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Job Stats (Last 7 Days)</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary-green-light"></div>
                  <span className="text-sm text-gray-600">Active Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary-green"></div>
                  <span className="text-sm text-gray-600">Applications</span>
                </div>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="relative">
              <div className="flex items-end justify-between h-64 mb-2">
                {/* Y-axis */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pr-2">
                  <span>{stats.totalJobs}</span>
                  <span>{Math.floor(stats.totalJobs * 0.8)}</span>
                  <span>{Math.floor(stats.totalJobs * 0.6)}</span>
                  <span>{Math.floor(stats.totalJobs * 0.4)}</span>
                  <span>{Math.floor(stats.totalJobs * 0.2)}</span>
                  <span>0</span>
                </div>
                
                {/* Chart bars */}
                <div className="flex-1 ml-8 flex items-end justify-between gap-2 h-full">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    // Simple mock data for visualization (you can replace with real data)
                    const activeJobs = Math.floor(Math.random() * stats.totalJobs * 0.3);
                    const applications = Math.floor(Math.random() * stats.totalApplications * 0.2);
                    const maxValue = Math.max(stats.totalJobs, stats.totalApplications);
                    const activeHeight = maxValue > 0 ? (activeJobs / maxValue) * 100 : 0;
                    const appliedHeight = maxValue > 0 ? (applications / maxValue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full">
                        <div className="flex items-end gap-1 w-full h-full">
                          {/* Active Jobs Bar */}
                          <div
                            className="flex-1 bg-primary-green-light rounded-t hover:bg-primary-green transition-colors cursor-pointer relative group"
                            style={{ height: `${activeHeight}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {activeJobs} jobs
                            </div>
                          </div>
                          {/* Applications Bar */}
                          <div
                            className="flex-1 bg-primary-green rounded-t hover:bg-primary-green-dark transition-colors cursor-pointer relative group"
                            style={{ height: `${appliedHeight}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {applications} apps
                            </div>
                          </div>
                        </div>
                        {/* X-axis label */}
                        <div className="text-xs text-gray-600 mt-2">{day}</div>
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
            {recentJobs.length > 0 ? (
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
                        <span className="truncate">{job.employer?.companyName || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <EnvironmentOutlined className="text-primary-green" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                        <CalendarOutlined className="text-primary-green" />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BuildOutlined className="text-4xl mb-2" />
                <p>No jobs found</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Jobs Table */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Jobs</h2>
        {allJobs.length > 0 ? (
          <Table
            columns={jobColumns}
            dataSource={allJobs}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="bg-white"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BuildOutlined className="text-4xl mb-2" />
            <p>No jobs found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
