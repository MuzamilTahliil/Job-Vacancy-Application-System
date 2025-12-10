"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Spin, Avatar } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BuildOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getCurrentUser, User } from "@/app/services/users.service";
import { getJobs, Job, JobType, getJobViewsForEmployer } from "@/app/services/jobs.service";
import { getApplications, Application, ApplicationStatus } from "@/app/services/applications.service";

export default function EmployerDashboard() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [jobViews, setJobViews] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user first
      const user = await getCurrentUser();
      setCurrentUser(user);

      // Fetch jobs, applications, and views in parallel (these are allowed for employers)
      let jobs: Job[] = [];
      let applications: Application[] = [];
      let views: { jobId: number; viewCount: number }[] = [];

      try {
        jobs = await getJobs();
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        // Continue even if jobs fail to load
      }

      try {
        applications = await getApplications();
      } catch (err: any) {
        console.error("Error fetching applications:", err);
        // Continue even if applications fail to load
      }

      try {
        views = await getJobViewsForEmployer();
        // Create a map of jobId to viewCount
        const viewsMap: Record<number, number> = {};
        views.forEach(v => {
          viewsMap[v.jobId] = v.viewCount;
        });
        setJobViews(viewsMap);
      } catch (err: any) {
        console.error("Error fetching views:", err);
        // Continue even if views fail to load
      }

      // Filter jobs for this employer
      const myJobs = jobs.filter(j => j.employerId === user.id);
      const activeJobs = myJobs.filter(j => j.isActive);

      // Filter applications for employer's jobs
      // Applications endpoint already returns only employer's applications, but filter to be safe
      const myApplications = applications.filter(a => {
        return myJobs.some(j => j.id === a.jobId);
      });

      // Calculate total views from the views array (all job seeker clicks/views)
      const totalViews = views.reduce((sum, view) => {
        return sum + view.viewCount;
      }, 0);

      setStats({
        totalJobs: myJobs.length,
        activeJobs: activeJobs.length,
        totalApplications: myApplications.length,
        totalViews: totalViews,
      });

      // Get recent jobs (last 4)
      const sortedJobs = [...myJobs].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentJobs(sortedJobs.slice(0, 4));
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      title: "Job Type",
      dataIndex: "jobType",
      key: "jobType",
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
      title: "Views",
      key: "views",
      render: (_, record) => jobViews[record.id] || 0,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>
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
      {/* Welcome Section with Employer Info */}
      {currentUser && (
        <Card className="mb-6 bg-gradient-to-r from-primary-green to-primary-green-dark border-0">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.fullName}!</h1>
              <p className="text-white/90 text-lg">
                Employer
                {currentUser.companyName && ` • ${currentUser.companyName}`}
              </p>
              <div className="mt-3 flex items-center gap-4 text-white/80">
                <span className="text-sm">{currentUser.email}</span>
                {currentUser.phoneNumber && (
                  <span className="text-sm">• {currentUser.phoneNumber}</span>
                )}
                {currentUser.companyLocation && (
                  <span className="text-sm">• <EnvironmentOutlined /> {currentUser.companyLocation}</span>
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
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-[#059669] text-white border-0">
            <Statistic
              title={<span className="text-white">Total Jobs</span>}
              value={stats.totalJobs}
              prefix={<BuildOutlined className="text-white" />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-primary-green text-white border-0">
            <Statistic
              title={<span className="text-white">Active Jobs</span>}
              value={stats.activeJobs}
              prefix={<BuildOutlined className="text-white" />}
              valueStyle={{ color: "white" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-primary-green-light border-0">
            <Statistic
              title="Total Applications"
              value={stats.totalApplications}
              prefix={<FileTextOutlined className="text-primary-green" />}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gray-100 border-0">
            <Statistic
              title="Total Views"
              value={stats.totalViews}
              prefix={<TeamOutlined className="text-gray-600" />}
              valueStyle={{ color: "#4b5563" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Jobs */}
      <Card title="Recent Jobs" className="mb-6">
        {recentJobs.length > 0 ? (
          <Table
            columns={columns}
            dataSource={recentJobs}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BuildOutlined className="text-4xl mb-2" />
            <p>No jobs posted yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
