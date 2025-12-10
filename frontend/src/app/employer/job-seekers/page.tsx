"use client";

import { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Input, Modal, Spin } from "antd";
import { SearchOutlined, EyeOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { JobSeekerProfile } from "@/app/services/profiles.service";
import { getJobSeekersWhoViewedJobs } from "@/app/services/jobs.service";

export default function EmployerJobSeekersPage() {
  const [jobSeekers, setJobSeekers] = useState<JobSeekerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeeker, setSelectedSeeker] = useState<JobSeekerProfile | null>(null);

  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      setLoading(true);
      // Only get job seekers who viewed this employer's jobs
      const data = await getJobSeekersWhoViewedJobs();
      setJobSeekers(data);
    } catch (error: any) {
      console.error("Error fetching job seekers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (seeker: JobSeekerProfile) => {
    setSelectedSeeker(seeker);
    setIsModalOpen(true);
  };

  const filteredJobSeekers = jobSeekers.filter((seeker) => {
    const name = seeker.user?.fullName?.toLowerCase() || "";
    const email = seeker.user?.email?.toLowerCase() || "";
    const searchLower = searchText.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  const columns: ColumnsType<JobSeekerProfile> = [
    { 
      title: "Name", 
      dataIndex: ["user", "fullName"], 
      key: "userName", 
      width: 150,
      render: (_, record) => record.user?.fullName || <span className="text-gray-400">null</span>,
    },
    { 
      title: "Email", 
      dataIndex: ["user", "email"], 
      key: "userEmail", 
      width: 200,
      render: (_, record) => record.user?.email || <span className="text-gray-400">null</span>,
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      width: 250,
      render: (skills: string[]) => {
        if (!skills || skills.length === 0) {
          return <span className="text-gray-400">null</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
              <Tag key={index} color="blue">{skill}</Tag>
            ))}
            {skills.length > 3 && <Tag color="default">+{skills.length - 3} more</Tag>}
          </div>
        );
      },
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      width: 200,
      ellipsis: true,
      render: (bio: string) => {
        if (!bio) return <span className="text-gray-400">null</span>;
        return <span title={bio}>{bio.length > 50 ? `${bio.substring(0, 50)}...` : bio}</span>;
      },
    },
    {
      title: "Viewed Jobs",
      key: "viewedJobs",
      width: 200,
      render: (_, record: any) => {
        const viewedJobs = record.viewedJobs || [];
        if (viewedJobs.length === 0) {
          return <span className="text-gray-400">No jobs viewed</span>;
        }
        return (
          <div className="flex flex-col gap-1">
            {viewedJobs.slice(0, 2).map((job: any, index: number) => (
              <Tag key={index} color="green" className="mb-1">
                {job.jobTitle}
              </Tag>
            ))}
            {viewedJobs.length > 2 && (
              <Tag color="default">+{viewedJobs.length - 2} more</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewProfile(record)}>
            View Profile
          </Button>
          {record.resumeUrl && (
            <Button 
              type="link" 
              icon={<FileTextOutlined />} 
              onClick={() => window.open(record.resumeUrl || "", "_blank")}
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Seekers</h1>
      <p className="text-gray-600 mb-4">Job seekers who viewed your jobs</p>
      <div className="mb-4">
        <Input
          size="large"
          placeholder="Search job seekers by name or email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredJobSeekers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="bg-white rounded-lg shadow-sm"
          scroll={{ x: 1000 }}
        />
      )}

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
            <div>
              <label className="font-semibold">Name:</label> 
              <p className="text-xl font-bold">{selectedSeeker.user?.fullName || <span className="text-gray-400">null</span>}</p>
            </div>
            <div>
              <label className="font-semibold">Email:</label> 
              <p>{selectedSeeker.user?.email || <span className="text-gray-400">null</span>}</p>
            </div>
            {selectedSeeker.bio && (
              <div>
                <label className="font-semibold">Bio:</label> 
                <p className="bg-gray-50 p-4 rounded-lg">{selectedSeeker.bio}</p>
              </div>
            )}
            <div>
              <label className="font-semibold">Skills:</label> 
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSeeker.skills && selectedSeeker.skills.length > 0 ? (
                  selectedSeeker.skills.map((skill, i) => (
                    <Tag key={i} color="blue">{skill}</Tag>
                  ))
                ) : (
                  <span className="text-gray-400">null</span>
                )}
              </div>
            </div>
            {selectedSeeker.experience && (
              <div>
                <label className="font-semibold">Experience:</label> 
                <p className="bg-gray-50 p-4 rounded-lg">{selectedSeeker.experience}</p>
              </div>
            )}
            {selectedSeeker.education && (
              <div>
                <label className="font-semibold">Education:</label> 
                <p className="bg-gray-50 p-4 rounded-lg">{selectedSeeker.education}</p>
              </div>
            )}
            {selectedSeeker.resumeUrl && (
              <div>
                <Button 
                  type="primary" 
                  icon={<FileTextOutlined />} 
                  onClick={() => window.open(selectedSeeker.resumeUrl || "", "_blank")} 
                  className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                >
                  View Resume
                </Button>
              </div>
            )}
            {selectedSeeker.linkedinUrl && (
              <div>
                <label className="font-semibold">LinkedIn:</label> 
                <p>
                  <a href={selectedSeeker.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-green hover:underline">
                    {selectedSeeker.linkedinUrl}
                  </a>
                </p>
              </div>
            )}
            {selectedSeeker.portfolioUrl && (
              <div>
                <label className="font-semibold">Portfolio:</label> 
                <p>
                  <a href={selectedSeeker.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary-green hover:underline">
                    {selectedSeeker.portfolioUrl}
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
