"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Avatar, message, Spin, Card, Tag, Space, Divider } from "antd";
import { 
  UserOutlined, 
  EditOutlined, 
  SaveOutlined, 
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  FileTextOutlined,
  LinkedinOutlined,
  GlobalOutlined,
  BookOutlined,
  BuildOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import { getCurrentUser, updateCurrentUserProfile, User } from "@/app/services/users.service";
import { getMyProfile, updateMyProfile, JobSeekerProfile } from "@/app/services/profiles.service";

export default function SeekerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Fetch both user info and profile info
      const [userData, profileData] = await Promise.all([
        getCurrentUser(),
        getMyProfile().catch(() => null), // Profile might not exist yet
      ]);
      
      setUser(userData);
      setProfile(profileData);
      
      // Set form values
      form.setFieldsValue({
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber || "",
      });

      if (profileData) {
        profileForm.setFieldsValue({
          bio: profileData.bio || "",
          skills: profileData.skills?.join(", ") || "",
          experience: profileData.experience || "",
          education: profileData.education || "",
          resumeUrl: profileData.resumeUrl || "",
          linkedinUrl: profileData.linkedinUrl || "",
          portfolioUrl: profileData.portfolioUrl || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      message.error("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
      });
    }
    if (profile) {
      profileForm.setFieldsValue({
        bio: profile.bio || "",
        skills: profile.skills?.join(", ") || "",
        experience: profile.experience || "",
        education: profile.education || "",
        resumeUrl: profile.resumeUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update user info
      const userValues = form.getFieldsValue();
      const updatedUser = await updateCurrentUserProfile({
        fullName: userValues.fullName,
        phoneNumber: userValues.phoneNumber || null,
      });
      setUser(updatedUser);
      
      // Update profile info
      const profileValues = profileForm.getFieldsValue();
      const profileData = {
        bio: profileValues.bio || null,
        skills: profileValues.skills 
          ? profileValues.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0)
          : [],
        experience: profileValues.experience || null,
        education: profileValues.education || null,
        resumeUrl: profileValues.resumeUrl || null,
        linkedinUrl: profileValues.linkedinUrl || null,
        portfolioUrl: profileValues.portfolioUrl || null,
      };

      const updatedProfile = await updateMyProfile(profileData);
      
      setProfile(updatedProfile);
      setIsEditing(false);
      message.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      message.error(error?.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Section */}
      <Card className="mb-6 bg-gradient-to-r from-primary-green to-primary-green-dark border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-white">
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className="border-4 border-white bg-white/20"
            >
              {user.fullName?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <span className="flex items-center gap-2">
                  <MailOutlined /> {user.email}
                </span>
                {user.phoneNumber && (
                  <span className="flex items-center gap-2">
                    <PhoneOutlined /> {user.phoneNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
          {!isEditing && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              className="bg-white text-primary-green hover:bg-gray-100 border-white"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      {/* Personal Information */}
      <Card title={<span className="text-xl font-semibold"><UserAddOutlined className="mr-2" />Personal Information</span>} className="mb-6">
        {isEditing ? (
          <Form form={form} layout="vertical">
            <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter your full name" }]}>
              <Input size="large" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
              <Input size="large" prefix={<MailOutlined />} disabled />
            </Form.Item>
            <Form.Item label="Phone Number" name="phoneNumber">
              <Input size="large" prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
            </Form.Item>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Full Name</label>
              <p className="text-lg">{user.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
            {user.phoneNumber && (
              <div>
                <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                <p className="text-lg">{user.phoneNumber}</p>
              </div>
            )}
            {!user.phoneNumber && (
              <div>
                <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                <p className="text-lg text-gray-400">Not provided</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Professional Profile */}
      <Card title={<span className="text-xl font-semibold"><BuildOutlined className="mr-2" />Professional Profile</span>} className="mb-6">
        {isEditing ? (
          <Form form={profileForm} layout="vertical">
            <Form.Item label="Bio" name="bio">
              <Input.TextArea 
                rows={4} 
                placeholder="Tell us about yourself..."
                size="large"
              />
            </Form.Item>
            <Form.Item 
              label="Skills" 
              name="skills"
              help="Separate skills with commas (e.g., JavaScript, React, Node.js)"
            >
              <Input 
                size="large"
                placeholder="JavaScript, React, Node.js, etc."
              />
            </Form.Item>
            <Form.Item label="Experience" name="experience">
              <Input.TextArea 
                rows={4} 
                placeholder="Describe your work experience..."
                size="large"
              />
            </Form.Item>
            <Form.Item label="Education" name="education">
              <Input.TextArea 
                rows={3} 
                placeholder="Describe your educational background..."
                size="large"
              />
            </Form.Item>
            <Form.Item label="Resume URL" name="resumeUrl">
              <Input 
                size="large"
                prefix={<FileTextOutlined />}
                placeholder="https://example.com/resume.pdf"
              />
            </Form.Item>
            <Form.Item label="LinkedIn URL" name="linkedinUrl">
              <Input 
                size="large"
                prefix={<LinkedinOutlined />}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </Form.Item>
            <Form.Item label="Portfolio URL" name="portfolioUrl">
              <Input 
                size="large"
                prefix={<GlobalOutlined />}
                placeholder="https://yourportfolio.com"
              />
            </Form.Item>
          </Form>
        ) : (
          <div className="space-y-6">
            {profile?.bio ? (
              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                  <UserOutlined /> Bio
                </label>
                <p className="text-base bg-gray-50 p-4 rounded-lg">{profile.bio}</p>
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                  <UserOutlined /> Bio
                </label>
                <p className="text-base text-gray-400 bg-gray-50 p-4 rounded-lg">Not provided</p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                <BuildOutlined /> Skills
              </label>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Tag key={index} color="blue" className="text-sm py-1 px-3">
                      {skill}
                    </Tag>
                  ))}
                </div>
              ) : (
                <p className="text-base text-gray-400">No skills added</p>
              )}
            </div>

            {profile?.experience ? (
              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                  <BuildOutlined /> Experience
                </label>
                <p className="text-base bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{profile.experience}</p>
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                  <BuildOutlined /> Experience
                </label>
                <p className="text-base text-gray-400 bg-gray-50 p-4 rounded-lg">Not provided</p>
              </div>
            )}

            {profile?.education ? (
              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                  <BookOutlined /> Education
                </label>
                <p className="text-base bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{profile.education}</p>
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                  <BookOutlined /> Education
                </label>
                <p className="text-base text-gray-400 bg-gray-50 p-4 rounded-lg">Not provided</p>
              </div>
            )}

            <Divider />

            {/* Links Section */}
            <div className="space-y-3">
              {profile?.resumeUrl && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                    <FileTextOutlined /> Resume
                  </label>
                  <a 
                    href={profile.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-green hover:underline flex items-center gap-2"
                  >
                    {profile.resumeUrl}
                  </a>
                </div>
              )}
              {profile?.linkedinUrl && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                    <LinkedinOutlined /> LinkedIn
                  </label>
                  <a 
                    href={profile.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-green hover:underline flex items-center gap-2"
                  >
                    {profile.linkedinUrl}
                  </a>
                </div>
              )}
              {profile?.portfolioUrl && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                    <GlobalOutlined /> Portfolio
                  </label>
                  <a 
                    href={profile.portfolioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-green hover:underline flex items-center gap-2"
                  >
                    {profile.portfolioUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
