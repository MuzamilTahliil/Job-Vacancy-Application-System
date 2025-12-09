"use client";

import { useState } from "react";
import { Table, Button, Tag, Space, Input, message, Modal } from "antd";
import { SearchOutlined, EyeOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface JobSeekerProfile {
  id: string;
  bio?: string;
  skills: string[];
  experience?: string;
  education?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - replace with actual API calls
const mockJobSeekers: JobSeekerProfile[] = [
  {
    id: "1",
    bio: "Experienced frontend developer with a passion for creating beautiful user interfaces.",
    skills: ["React", "Node.js", "TypeScript", "Next.js"],
    experience: "3 years of experience in web development",
    education: "Bachelor's in Computer Science",
    resumeUrl: "/resumes/john-doe.pdf",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    portfolioUrl: "https://johndoe.dev",
    userId: "user-001",
    userName: "John Doe",
    userEmail: "john@example.com",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    bio: "Full-stack developer specializing in Python and Django.",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    experience: "5 years of experience in backend development",
    education: "Master's in Software Engineering",
    resumeUrl: "/resumes/jane-smith.pdf",
    linkedinUrl: "https://linkedin.com/in/janesmith",
    portfolioUrl: "https://janesmith.dev",
    userId: "user-002",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "3",
    bio: "Java developer with expertise in enterprise applications.",
    skills: ["Java", "Spring Boot", "MySQL", "Microservices"],
    experience: "2 years of experience",
    education: "Bachelor's in Information Technology",
    userId: "user-003",
    userName: "Bob Johnson",
    userEmail: "bob@example.com",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
];

export default function JobSeekersPage() {
  const [jobSeekers, setJobSeekers] = useState(mockJobSeekers);
  const [searchText, setSearchText] = useState("");
  const [selectedSeeker, setSelectedSeeker] = useState<JobSeekerProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProfile = (seeker: JobSeekerProfile) => {
    setSelectedSeeker(seeker);
    setIsModalOpen(true);
  };

  const handleViewResume = (resumeUrl: string) => {
    window.open(resumeUrl, "_blank");
  };

  const filteredJobSeekers = jobSeekers.filter(
    (seeker) =>
      seeker.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      seeker.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      seeker.skills.some((skill) => skill.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns: ColumnsType<JobSeekerProfile> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "userName",
      key: "userName",
      width: 150,
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
      width: 200,
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      width: 200,
      ellipsis: true,
      render: (bio: string) =>
        bio ? (
          <span className="text-gray-700" title={bio}>
            {bio.length > 50 ? `${bio.substring(0, 50)}...` : bio}
          </span>
        ) : (
          <span className="text-gray-400">No bio</span>
        ),
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      width: 200,
      render: (skills: string[]) => (
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, index) => (
            <Tag key={index} color="blue">
              {skill}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      width: 200,
      ellipsis: true,
      render: (experience: string) => experience || <span className="text-gray-400">Not provided</span>,
    },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
      width: 150,
      ellipsis: true,
      render: (education: string) => education || <span className="text-gray-400">Not provided</span>,
    },
    {
      title: "Resume",
      dataIndex: "resumeUrl",
      key: "resumeUrl",
      width: 100,
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-green">
            View
          </a>
        ) : (
          <span className="text-gray-400">No resume</span>
        ),
    },
    {
      title: "LinkedIn",
      dataIndex: "linkedinUrl",
      key: "linkedinUrl",
      width: 100,
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-green">
            Profile
          </a>
        ) : (
          <span className="text-gray-400">N/A</span>
        ),
    },
    {
      title: "Portfolio",
      dataIndex: "portfolioUrl",
      key: "portfolioUrl",
      width: 100,
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-green">
            View
          </a>
        ) : (
          <span className="text-gray-400">N/A</span>
        ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (updatedAt: string) => new Date(updatedAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewProfile(record)}
          >
            View Profile
          </Button>
          {record.resumeUrl && (
            <Button
              type="link"
              icon={<FileTextOutlined />}
              onClick={() => handleViewResume(record.resumeUrl!)}
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Seekers</h1>
      </div>

      <div className="mb-4">
        <Input
          size="large"
          placeholder="Search job seekers by name, email, or location..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredJobSeekers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow-sm"
        scroll={{ x: 2000 }}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)} size="large">
            Close
          </Button>,
        ]}
        width={700}
        className="top-10"
      >
        {/* Beautiful Header */}
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Job Seeker Profile</h2>
          <p className="text-white/90">View complete job seeker information</p>
        </div>

        {selectedSeeker && (
          <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Profile ID</label>
                  <p className="text-gray-900 mt-1 font-medium">{selectedSeeker.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">User ID</label>
                  <p className="text-gray-900 mt-1 font-medium">{selectedSeeker.userId}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                <p className="text-gray-900 mt-1 text-2xl font-bold">{selectedSeeker.userName}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <p className="text-gray-900 mt-1 text-lg">{selectedSeeker.userEmail}</p>
              </div>

              {selectedSeeker.bio && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Bio</label>
                  <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {selectedSeeker.bio}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-600">Skills</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSeeker.skills.map((skill, index) => (
                    <Tag key={index} color="blue" className="text-base px-3 py-1">
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>

              {selectedSeeker.experience && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Experience</label>
                  <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {selectedSeeker.experience}
                  </p>
                </div>
              )}

              {selectedSeeker.education && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Education</label>
                  <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {selectedSeeker.education}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {selectedSeeker.resumeUrl && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Resume</label>
                    <div className="mt-2">
                      <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        onClick={() => handleViewResume(selectedSeeker.resumeUrl!)}
                        className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                      >
                        View Resume
                      </Button>
                    </div>
                  </div>
                )}
                {selectedSeeker.linkedinUrl && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">LinkedIn</label>
                    <div className="mt-2">
                      <a
                        href={selectedSeeker.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-green hover:underline text-lg font-medium"
                      >
                        View Profile →
                      </a>
                    </div>
                  </div>
                )}
                {selectedSeeker.portfolioUrl && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Portfolio</label>
                    <div className="mt-2">
                      <a
                        href={selectedSeeker.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-green hover:underline text-lg font-medium"
                      >
                        Visit Website →
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Created At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(selectedSeeker.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Updated At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(selectedSeeker.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

