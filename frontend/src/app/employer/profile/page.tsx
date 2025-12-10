"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Avatar, message, Spin } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { getCurrentUser, updateCurrentUserProfile, User } from "@/app/services/users.service";

export default function EmployerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setProfile(user);
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        companyName: user.companyName || "",
        companyLocation: user.companyLocation || "",
        companyWebsite: user.companyWebsite || "",
        companyDescription: user.companyDescription || "",
        bio: user.bio || "",
      });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      form.setFieldsValue({
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber || "",
        companyName: profile.companyName || "",
        companyLocation: profile.companyLocation || "",
        companyWebsite: profile.companyWebsite || "",
        companyDescription: profile.companyDescription || "",
        bio: profile.bio || "",
      });
    }
  };

  const handleSave = async (values: any) => {
    try {
      const updatedUser = await updateCurrentUserProfile(values);
      setProfile(updatedUser);
      setIsEditing(false);
      message.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      message.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-20">No profile data available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-8 mb-6 px-8 py-8 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-white/90">View and edit your profile information</p>
          </div>
          <Avatar 
            size={64} 
            icon={<UserOutlined />} 
            className="border-4 border-white bg-white/20"
          >
            {profile.fullName?.charAt(0).toUpperCase()}
          </Avatar>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {!isEditing ? (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">User ID</label>
                <p className="text-gray-900 mt-1 font-medium">{profile.id}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Role</label>
                <p className="mt-1">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-green-light text-primary-green">
                    Employer
                  </span>
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Full Name</label>
                  <p className="text-gray-900 mt-1 text-lg">{profile.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-900 mt-1 text-lg">{profile.email}</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                <p className="text-gray-900 mt-1 text-lg">{profile.phoneNumber || <span className="text-gray-400">null</span>}</p>
              </div>
              {profile.bio && (
                <div className="mt-4">
                  <label className="text-sm font-semibold text-gray-600">Bio</label>
                  <p className="text-gray-900 mt-1 bg-gray-50 p-4 rounded-lg">{profile.bio}</p>
                </div>
              )}
            </div>

            {(profile.companyName || profile.companyLocation || profile.companyWebsite || profile.companyDescription) && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Company Name</label>
                    <p className="text-gray-900 mt-1 text-lg">{profile.companyName || <span className="text-gray-400">null</span>}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Company Location</label>
                    <p className="text-gray-900 mt-1 text-lg">{profile.companyLocation || <span className="text-gray-400">null</span>}</p>
                  </div>
                </div>
                {profile.companyWebsite && (
                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-600">Company Website</label>
                    <p className="text-gray-900 mt-1 text-lg">
                      <a href={profile.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary-green hover:underline">
                        {profile.companyWebsite}
                      </a>
                    </p>
                  </div>
                )}
                {profile.companyDescription && (
                  <div className="mt-4">
                    <label className="text-sm font-semibold text-gray-600">Company Description</label>
                    <p className="text-gray-900 mt-1 bg-gray-50 p-4 rounded-lg">{profile.companyDescription}</p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t mt-4">
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={handleEdit} 
                size="large" 
                className="bg-primary-green hover:bg-primary-green-dark border-primary-green" 
                block
              >
                Edit Profile
              </Button>
            </div>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Personal Information</h3>
            <Form.Item 
              name="fullName" 
              label={<span className="text-gray-700 font-semibold">Full Name</span>} 
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item 
              name="email" 
              label={<span className="text-gray-700 font-semibold">Email</span>} 
              rules={[{ required: true, message: "Please enter email" }, { type: "email", message: "Please enter a valid email" }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item 
              name="phoneNumber" 
              label={<span className="text-gray-700 font-semibold">Phone Number</span>}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item 
              name="bio" 
              label={<span className="text-gray-700 font-semibold">Bio</span>}
            >
              <Input.TextArea rows={4} size="large" />
            </Form.Item>

            <h3 className="font-semibold text-lg mb-4 text-gray-800 mt-6">Company Information</h3>
            <Form.Item 
              name="companyName" 
              label={<span className="text-gray-700 font-semibold">Company Name</span>}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item 
              name="companyLocation" 
              label={<span className="text-gray-700 font-semibold">Company Location</span>}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item 
              name="companyWebsite" 
              label={<span className="text-gray-700 font-semibold">Company Website</span>}
            >
              <Input size="large" placeholder="https://example.com" />
            </Form.Item>
            <Form.Item 
              name="companyDescription" 
              label={<span className="text-gray-700 font-semibold">Company Description</span>}
            >
              <Input.TextArea rows={4} size="large" />
            </Form.Item>

            <Form.Item className="mb-0 mt-6">
              <div className="flex justify-end gap-3">
                <Button icon={<CloseOutlined />} onClick={handleCancel} size="large">
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  htmlType="submit" 
                  size="large" 
                  className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                >
                  Save Changes
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}
