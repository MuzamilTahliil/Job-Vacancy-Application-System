"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Avatar, message, Spin } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { getCurrentUser, updateCurrentUserProfile, User } from "@/app/services/users.service";
import { UserRole } from "@/app/services/auth.service";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await getCurrentUser();
      setProfile(userProfile);
      form.setFieldsValue({
        fullName: userProfile.fullName,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber || "",
        companyName: userProfile.companyName || "",
        companyLocation: userProfile.companyLocation || "",
        companyDescription: userProfile.companyDescription || "",
        companyWebsite: userProfile.companyWebsite || "",
      });
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
    if (profile) {
      form.setFieldsValue({
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber || "",
        companyName: profile.companyName || "",
        companyLocation: profile.companyLocation || "",
        companyDescription: profile.companyDescription || "",
        companyWebsite: profile.companyWebsite || "",
      });
    }
  };

  const handleSave = async (values: any) => {
    if (!profile) return;

    try {
      setSaving(true);
      const updatedProfile = await updateCurrentUserProfile({
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber || null,
        companyName: values.companyName || null,
        companyLocation: values.companyLocation || null,
        companyDescription: values.companyDescription || null,
        companyWebsite: values.companyWebsite || null,
      });

      setProfile(updatedProfile);
      setIsEditing(false);
      message.success("Profile updated successfully!");
      
      // Update localStorage if email changed
      if (typeof window !== "undefined" && values.email !== profile.email) {
        // Note: You might want to handle token refresh here if backend requires it
      }
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

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Failed to load profile</p>
      </div>
    );
  }

  const isEmployer = profile.role === UserRole.EMPLOYER || profile.role === UserRole.ADMIN || profile.role === UserRole.SUPER_ADMIN;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* Beautiful Header */}
      <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-8 mb-6 px-8 py-8 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-white/90">View and edit your profile information</p>
          </div>
          <Avatar
            size={64}
            icon={<UserOutlined />}
            className="border-4 border-white bg-primary-green-light"
          >
            {profile.fullName?.charAt(0).toUpperCase()}
          </Avatar>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
        {!isEditing ? (
          // View Mode
          <div className="space-y-6 mt-4">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary-green">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">User ID</label>
                  <p className="text-gray-900 mt-1 font-medium">{profile.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Role</label>
                  <p className="mt-1">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-green-light text-primary-green">
                      {profile.role.replace('_', ' ')}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Full Name</label>
                  <p className="text-gray-900 mt-1 text-xl font-bold">{profile.fullName}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-900 mt-1 text-lg">{profile.email}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                  <p className="text-gray-900 mt-1 text-lg">
                    {profile.phoneNumber || <span className="text-gray-400">null</span>}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Created At</label>
                  <p className="text-gray-900 mt-1 text-base">
                    {new Date(profile.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Company Information (for Employers/Admins) */}
            {isEmployer && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary-green">
                  Company Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Company Name</label>
                    <p className="text-gray-900 mt-1 text-lg">
                      {profile.companyName || <span className="text-gray-400">null</span>}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Company Location</label>
                    <p className="text-gray-900 mt-1 text-lg">
                      {profile.companyLocation || <span className="text-gray-400">null</span>}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Company Website</label>
                    <p className="text-gray-900 mt-1 text-lg">
                      {profile.companyWebsite ? (
                        <a
                          href={profile.companyWebsite.startsWith('http') ? profile.companyWebsite : `https://${profile.companyWebsite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {profile.companyWebsite}
                        </a>
                      ) : (
                        <span className="text-gray-400">null</span>
                      )}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-600">Company Description</label>
                    <p className="text-gray-900 mt-2 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {profile.companyDescription || <span className="text-gray-400">null</span>}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
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
          // Edit Mode
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            className="mt-4"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary-green">
              Personal Information
            </h3>
            <Form.Item
              name="fullName"
              label={<span className="text-gray-700 font-semibold">Full Name</span>}
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input size="large" placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="text-gray-700 font-semibold">Email</span>}
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input size="large" placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label={<span className="text-gray-700 font-semibold">Phone Number (Optional)</span>}
            >
              <Input size="large" placeholder="Enter phone number" />
            </Form.Item>

            {isEmployer && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4 mt-6 pb-2 border-b-2 border-primary-green">
                  Company Information
                </h3>
                <Form.Item
                  name="companyName"
                  label={<span className="text-gray-700 font-semibold">Company Name (Optional)</span>}
                >
                  <Input size="large" placeholder="Enter company name" />
                </Form.Item>

                <Form.Item
                  name="companyLocation"
                  label={<span className="text-gray-700 font-semibold">Company Location (Optional)</span>}
                >
                  <Input size="large" placeholder="Enter company location" />
                </Form.Item>

                <Form.Item
                  name="companyWebsite"
                  label={<span className="text-gray-700 font-semibold">Company Website (Optional)</span>}
                >
                  <Input size="large" placeholder="Enter company website (e.g., www.example.com)" />
                </Form.Item>

                <Form.Item
                  name="companyDescription"
                  label={<span className="text-gray-700 font-semibold">Company Description (Optional)</span>}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter company description..."
                    size="large"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item className="mb-0 mt-6">
              <div className="flex justify-end gap-3">
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  size="large"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  size="large"
                  className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
                  loading={saving}
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
