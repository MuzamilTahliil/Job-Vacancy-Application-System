"use client";

import { useState } from "react";
import { Table, Button, Tag, Space, Input, Modal } from "antd";
import { SearchOutlined, EyeOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface JobSeekerProfile {
  id: string;
  userName: string;
  userEmail: string;
  bio?: string;
  skills: string[];
  experience?: string;
  education?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

const mockJobSeekers: JobSeekerProfile[] = [
  {
    id: "1",
    userName: "John Doe",
    userEmail: "john@example.com",
    bio: "Experienced frontend developer...",
    skills: ["React", "Node.js", "TypeScript"],
    experience: "3 years of experience",
    education: "Bachelor's in Computer Science",
    resumeUrl: "/resumes/john-doe.pdf",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    portfolioUrl: "https://johndoe.dev",
  },
];

export default function EmployerJobSeekersPage() {
  const [jobSeekers, setJobSeekers] = useState(mockJobSeekers);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeeker, setSelectedSeeker] = useState<JobSeekerProfile | null>(null);

  const handleViewProfile = (seeker: JobSeekerProfile) => {
    setSelectedSeeker(seeker);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<JobSeekerProfile> = [
    { title: "Name", dataIndex: "userName", key: "userName", width: 150 },
    { title: "Email", dataIndex: "userEmail", key: "userEmail", width: 200 },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      width: 200,
      render: (skills: string[]) => (
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, index) => (
            <Tag key={index} color="blue">{skill}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewProfile(record)}>View Profile</Button>
          {record.resumeUrl && (
            <Button type="link" icon={<FileTextOutlined />} onClick={() => window.open(record.resumeUrl, "_blank")}>Resume</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Seekers</h1>
      <div className="mb-4">
        <Input
          size="large"
          placeholder="Search job seekers..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Table
        columns={columns}
        dataSource={jobSeekers.filter((seeker) =>
          seeker.userName.toLowerCase().includes(searchText.toLowerCase()) ||
          seeker.userEmail.toLowerCase().includes(searchText.toLowerCase())
        )}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow-sm"
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsModalOpen(false)}>Close</Button>]}
        width={700}
      >
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Job Seeker Profile</h2>
          <p className="text-white/90">View job seeker information</p>
        </div>
        {selectedSeeker && (
          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
            <div><label className="font-semibold">Name:</label> <p className="text-xl font-bold">{selectedSeeker.userName}</p></div>
            <div><label className="font-semibold">Email:</label> <p>{selectedSeeker.userEmail}</p></div>
            {selectedSeeker.bio && <div><label className="font-semibold">Bio:</label> <p className="bg-gray-50 p-4 rounded-lg">{selectedSeeker.bio}</p></div>}
            <div><label className="font-semibold">Skills:</label> <div className="flex flex-wrap gap-2 mt-2">{selectedSeeker.skills.map((skill, i) => <Tag key={i} color="blue">{skill}</Tag>)}</div></div>
            {selectedSeeker.experience && <div><label className="font-semibold">Experience:</label> <p className="bg-gray-50 p-4 rounded-lg">{selectedSeeker.experience}</p></div>}
            {selectedSeeker.education && <div><label className="font-semibold">Education:</label> <p className="bg-gray-50 p-4 rounded-lg">{selectedSeeker.education}</p></div>}
            {selectedSeeker.resumeUrl && <div><Button type="primary" icon={<FileTextOutlined />} onClick={() => window.open(selectedSeeker.resumeUrl, "_blank")} className="bg-primary-green hover:bg-primary-green-dark border-primary-green">View Resume</Button></div>}
          </div>
        )}
      </Modal>
    </div>
  );
}

