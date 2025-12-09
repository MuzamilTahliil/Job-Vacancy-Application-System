"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Tag, Card, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  jobType: string;
  location: string;
  salary?: string;
  deadline: string;
  isActive: boolean;
  employerId: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - replace with actual API call
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    description: "We are looking for an experienced Frontend Developer...",
    requirements: "3+ years of experience with React, TypeScript, and modern frontend frameworks",
    responsibilities: "Develop and maintain user-facing features, collaborate with design team",
    jobType: "Full-time",
    location: "Mogadishu",
    salary: "$50,000 - $70,000",
    deadline: "2024-03-15",
    isActive: true,
    employerId: "emp-001",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Backend Developer",
    description: "Join our team as a Backend Developer...",
    requirements: "5+ years of experience with Node.js, Express, and databases",
    responsibilities: "Design and implement scalable backend services, API development",
    jobType: "Part-time",
    location: "Hargeisa",
    salary: "$40,000 - $60,000",
    deadline: "2024-03-20",
    isActive: true,
    employerId: "emp-002",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    description: "We need a creative UI/UX Designer...",
    requirements: "Portfolio demonstrating strong design skills, proficiency in Figma",
    responsibilities: "Create user-centered designs, conduct user research",
    jobType: "Contract",
    location: "Hargeisa",
    salary: "$45,000 - $65,000",
    deadline: "2024-02-01",
    isActive: false,
    employerId: "emp-003",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
];

export default function ViewJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchJob = async () => {
      try {
        setFetching(true);
        const foundJob = mockJobs.find((j) => j.id === jobId);
        if (foundJob) {
          setJob(foundJob);
        } else {
          router.push("/admin/jobs");
        }
      } catch (error) {
        router.push("/admin/jobs");
      } finally {
        setFetching(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, router]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Beautiful Header */}
      <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/admin/jobs")}
              className="text-white hover:bg-white/20 border-white/30"
              size="large"
            >
              Back to Jobs
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">Job Details</h1>
          <p className="text-white/90 text-lg">View complete job posting information</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="shadow-lg">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
              <div>
                <label className="text-sm font-semibold text-gray-600">Job ID</label>
                <p className="text-gray-900 mt-1 font-medium">{job.id}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <p className="mt-1">
                  <Tag color={job.isActive ? "green" : "red"} className="text-base px-3 py-1">
                    {job.isActive ? "Active" : "Inactive"}
                  </Tag>
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Job Title</label>
              <p className="text-gray-900 mt-1 text-2xl font-bold">{job.title}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Description</label>
              <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                {job.description}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Requirements</label>
              <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                {job.requirements}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Responsibilities</label>
              <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                {job.responsibilities}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Job Type</label>
                <p className="mt-2">
                  <Tag className="text-base px-3 py-1">{job.jobType}</Tag>
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Location</label>
                <p className="text-gray-900 mt-1 text-lg">{job.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Salary</label>
                <p className="text-gray-900 mt-1 text-lg">
                  {job.salary || <span className="text-gray-400">Not specified</span>}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Application Deadline</label>
                <p className="text-gray-900 mt-1 text-lg">
                  {new Date(job.deadline).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Employer ID</label>
              <p className="text-gray-900 mt-1 text-lg font-medium">{job.employerId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="text-sm font-semibold text-gray-600">Created At</label>
                <p className="text-gray-900 mt-1">
                  {new Date(job.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Updated At</label>
                <p className="text-gray-900 mt-1">
                  {new Date(job.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={() => router.push(`/admin/jobs/edit/${job.id}`)}
                size="large"
                className="bg-primary-green hover:bg-primary-green-dark border-primary-green text-white"
              >
                Edit Job
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

