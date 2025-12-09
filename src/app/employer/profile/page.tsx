"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Avatar, message } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: "JOB_SEEKER" | "EMPLOYER" | "ADMIN";
  companyName?: string;
  avatar?: string;
}

const getMockUserProfile = (): UserProfile => {
  return {
    id: "user-001",
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+252 63 1234567",
    role: "EMPLOYER",
    companyName: "Tech Solutions Inc",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Employer",
  };
};

export default function EmployerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const userProfile = getMockUserProfile();
    setProfile(userProfile);
    form.setFieldsValue({
      fullName: userProfile.fullName,
      email: userProfile.email,
      phoneNumber: userProfile.phoneNumber,
      companyName: userProfile.companyName,
    });
  }, [form]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      form.setFieldsValue({
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        companyName: profile.companyName,
      });
    }
  };

  const handleSave = async (values: any) => {
    try {
      const updatedProfile: UserProfile = {
        ...profile!,
        ...values,
      };
      setProfile(updatedProfile);
      setIsEditing(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  if (!profile) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-8 mb-6 px-8 py-8 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-white/90">View and edit your profile information</p>
          </div>
          <Avatar size={64} src={profile.avatar} icon={<UserOutlined />} className="border-4 border-white" />
        </div>
      </div>

      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {!isEditing ? (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-semibold text-gray-600">User ID</label><p className="text-gray-900 mt-1 font-medium">{profile.id}</p></div>
              <div><label className="text-sm font-semibold text-gray-600">Role</label><p className="mt-1"><span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-green-light text-primary-green">Employer</span></p></div>
            </div>
            <div><label className="text-sm font-semibold text-gray-600">Full Name</label><p className="text-gray-900 mt-1 text-xl font-bold">{profile.fullName}</p></div>
            <div><label className="text-sm font-semibold text-gray-600">Email</label><p className="text-gray-900 mt-1 text-lg">{profile.email}</p></div>
            {profile.phoneNumber && <div><label className="text-sm font-semibold text-gray-600">Phone Number</label><p className="text-gray-900 mt-1 text-lg">{profile.phoneNumber}</p></div>}
            {profile.companyName && <div><label className="text-sm font-semibold text-gray-600">Company Name</label><p className="text-gray-900 mt-1 text-lg">{profile.companyName}</p></div>}
            <div className="pt-4 border-t border-gray-200">
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} size="large" className="bg-primary-green hover:bg-primary-green-dark border-primary-green" block>Edit Profile</Button>
            </div>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
            <Form.Item name="fullName" label={<span className="text-gray-700 font-semibold">Full Name</span>} rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="email" label={<span className="text-gray-700 font-semibold">Email</span>} rules={[{ required: true }, { type: "email" }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="phoneNumber" label={<span className="text-gray-700 font-semibold">Phone Number (Optional)</span>}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="companyName" label={<span className="text-gray-700 font-semibold">Company Name (Optional)</span>}>
              <Input size="large" />
            </Form.Item>
            <Form.Item className="mb-0 mt-6">
              <div className="flex justify-end gap-3">
                <Button icon={<CloseOutlined />} onClick={handleCancel} size="large">Cancel</Button>
                <Button type="primary" icon={<SaveOutlined />} htmlType="submit" size="large" className="bg-primary-green hover:bg-primary-green-dark border-primary-green">Save Changes</Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}

