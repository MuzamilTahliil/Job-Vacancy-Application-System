"use client";

import { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Input, message, Modal, Spin, Form } from "antd";
import { SearchOutlined, EyeOutlined, FileTextOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getAllJobSeekers, JobSeekerProfile, updateJobSeekerProfile } from "@/app/services/profiles.service";

interface JobSeekerProfileWithUser extends JobSeekerProfile {
  userName: string;
  userEmail: string;
}

export default function JobSeekersPage() {
  const [jobSeekers, setJobSeekers] = useState<JobSeekerProfileWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedSeeker, setSelectedSeeker] = useState<JobSeekerProfileWithUser | null>(null);
  const [editingSeeker, setEditingSeeker] = useState<JobSeekerProfileWithUser | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();

  // Fetch job seekers from backend
  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      setLoading(true);
      const allJobSeekers = await getAllJobSeekers();
      // Transform data to include userName and userEmail
      const transformed = allJobSeekers.map((seeker) => ({
        ...seeker,
        userName: seeker.user?.fullName || "Unknown",
        userEmail: seeker.user?.email || "Unknown",
      }));
      setJobSeekers(transformed);
    } catch (error: any) {
      console.error("Error fetching job seekers:", error);
      message.error("Failed to fetch job seekers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (seeker: JobSeekerProfileWithUser) => {
    setSelectedSeeker(seeker);
    setIsViewModalOpen(true);
  };

  const handleEditProfile = (seeker: JobSeekerProfileWithUser) => {
    setEditingSeeker(seeker);
    setIsEditModalOpen(true);
      editForm.setFieldsValue({
        bio: seeker.bio || "",
        skills: seeker.skills && seeker.skills.length > 0 ? seeker.skills.join(", ") : "",
        experience: seeker.experience || "",
        education: seeker.education || "",
        resumeUrl: seeker.resumeUrl || "",
        linkedinUrl: seeker.linkedinUrl || "",
        portfolioUrl: seeker.portfolioUrl || "",
      });
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    setEditingSeeker(null);
    editForm.resetFields();
  };

  const handleEditFormSubmit = async (values: any) => {
    if (!editingSeeker) return;

    try {
      // Convert skills string to array if needed
      const skills = Array.isArray(values.skills) 
        ? values.skills 
        : values.skills 
          ? values.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : [];

      await updateJobSeekerProfile(editingSeeker.userId, {
        bio: values.bio || undefined,
        skills: skills.length > 0 ? skills : undefined,
        experience: values.experience || undefined,
        education: values.education || undefined,
        resumeUrl: values.resumeUrl || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
        portfolioUrl: values.portfolioUrl || undefined,
      });

      // Refresh the list
      await fetchJobSeekers();
      message.success("Job seeker profile updated successfully!");
      setIsEditModalOpen(false);
      setEditingSeeker(null);
      editForm.resetFields();
    } catch (error: any) {
      console.error("Error updating job seeker profile:", error);
      message.error("Failed to update job seeker profile. Please try again.");
    }
  };

  const handleViewResume = (resumeUrl: string) => {
    window.open(resumeUrl, "_blank");
  };

  const filteredJobSeekers = jobSeekers.filter(
    (seeker) =>
      seeker.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      seeker.userEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      seeker.skills?.some((skill) => skill.toLowerCase().includes(searchText.toLowerCase())) ||
      seeker.bio?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<JobSeekerProfileWithUser> = [
    {
      title: "Profile ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: 100,
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
          <span className="text-gray-400">null</span>
        ),
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      width: 200,
      render: (skills: string[]) => (
        <div className="flex flex-wrap gap-1">
          {skills && skills.length > 0 ? (
            skills.map((skill, index) => (
              <Tag key={index} color="blue">
                {skill}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">null</span>
          )}
        </div>
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      width: 200,
      ellipsis: true,
      render: (experience: string) => experience || <span className="text-gray-400">null</span>,
    },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
      width: 150,
      ellipsis: true,
      render: (education: string) => education || <span className="text-gray-400">null</span>,
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
          <span className="text-gray-400">null</span>
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
          <span className="text-gray-400">null</span>
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
          <span className="text-gray-400">null</span>
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
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="large">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewProfile(record)}
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            title="View Profile"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditProfile(record)}
            className="text-green-500 hover:text-green-700 hover:bg-green-50"
            title="Edit Profile"
          />
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

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredJobSeekers}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} job seekers`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          className="bg-white rounded-lg shadow-sm"
          scroll={{ x: 2000 }}
          loading={loading}
          size="middle"
        />
      )}

      {/* View Profile Modal */}
      <Modal
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          setSelectedSeeker(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsViewModalOpen(false);
            setSelectedSeeker(null);
          }} size="large">
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

              <div>
                <label className="text-sm font-semibold text-gray-600">Bio</label>
                {selectedSeeker.bio ? (
                  <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {selectedSeeker.bio}
                  </p>
                ) : (
                  <p className="text-gray-400 mt-2">null</p>
                )}
              </div>

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

              <div>
                <label className="text-sm font-semibold text-gray-600">Experience</label>
                {selectedSeeker.experience ? (
                  <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {selectedSeeker.experience}
                  </p>
                ) : (
                  <p className="text-gray-400 mt-2">null</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Education</label>
                {selectedSeeker.education ? (
                  <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {selectedSeeker.education}
                  </p>
                ) : (
                  <p className="text-gray-400 mt-2">null</p>
                )}
              </div>

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

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalOpen}
        onCancel={handleEditModalCancel}
        footer={null}
        width={700}
        className="top-10"
      >
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Edit Job Seeker Profile</h2>
          <p className="text-white/90">Update job seeker information</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditFormSubmit}
            className="mt-4"
          >
            <Form.Item
              name="bio"
              label={<span className="text-gray-700 font-semibold">Bio</span>}
            >
              <Input.TextArea
                rows={4}
                size="large"
                placeholder="Enter bio..."
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Form.Item
              name="skills"
              label={<span className="text-gray-700 font-semibold">Skills (comma-separated)</span>}
            >
              <Input
                size="large"
                placeholder="React, Node.js, TypeScript, PostgreSQL"
              />
            </Form.Item>

            <Form.Item
              name="experience"
              label={<span className="text-gray-700 font-semibold">Experience</span>}
            >
              <Input.TextArea
                rows={4}
                size="large"
                placeholder="Enter experience..."
              />
            </Form.Item>

            <Form.Item
              name="education"
              label={<span className="text-gray-700 font-semibold">Education</span>}
            >
              <Input.TextArea
                rows={3}
                size="large"
                placeholder="Enter education..."
              />
            </Form.Item>

            <Form.Item
              name="resumeUrl"
              label={<span className="text-gray-700 font-semibold">Resume URL</span>}
            >
              <Input size="large" placeholder="https://example.com/resume.pdf" />
            </Form.Item>

            <Form.Item
              name="linkedinUrl"
              label={<span className="text-gray-700 font-semibold">LinkedIn URL</span>}
            >
              <Input size="large" placeholder="https://linkedin.com/in/username" />
            </Form.Item>

            <Form.Item
              name="portfolioUrl"
              label={<span className="text-gray-700 font-semibold">Portfolio URL</span>}
            >
              <Input size="large" placeholder="https://portfolio.com" />
            </Form.Item>

            <Form.Item className="mb-0 mt-6">
              <div className="flex justify-end gap-3">
                <Button onClick={handleEditModalCancel} size="large">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                >
                  Update Profile
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

