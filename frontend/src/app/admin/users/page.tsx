"use client";

import { useState } from "react";
import { Table, Button, Tag, Space, Input, message, Popconfirm, Modal, Form, Select } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role: "JOB_SEEKER" | "EMPLOYER" | "ADMIN";
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - replace with actual API calls
const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    password: "hashed_password",
    fullName: "John Doe",
    phoneNumber: "+252 63 1234567",
    role: "JOB_SEEKER",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "jane@example.com",
    password: "hashed_password",
    fullName: "Jane Smith",
    phoneNumber: "+252 63 7654321",
    role: "EMPLOYER",
    companyName: "Tech Solutions Inc",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "hashed_password",
    fullName: "Admin User",
    phoneNumber: "+252 63 9876543",
    role: "ADMIN",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm] = Form.useForm();

  const handleDelete = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
    message.success("User deleted successfully");
  };

  const handleEdit = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setEditingUser(user);
      setIsEditModalOpen(true);
      editForm.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        companyName: user.companyName,
      });
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    editForm.resetFields();
  };

  const handleEditFormSubmit = async (values: any) => {
    if (!editingUser) return;

    try {
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              fullName: values.fullName,
              email: values.email,
              phoneNumber: values.phoneNumber || undefined,
              role: values.role,
              companyName: values.companyName || undefined,
              updatedAt: new Date().toISOString(),
            }
          : user
      );

      setUsers(updatedUsers);
      message.success("User updated successfully!");
      setIsEditModalOpen(false);
      setEditingUser(null);
      editForm.resetFields();
    } catch (error) {
      message.error("Failed to update user");
      console.error(error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
      render: (phone: string) => phone || <span className="text-gray-400">Not provided</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => {
        const color =
          role === "ADMIN"
            ? "red"
            : role === "EMPLOYER"
            ? "blue"
            : "green";
        return <Tag color={color}>{role.replace('_', ' ')}</Tag>;
      },
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      width: 150,
      render: (company: string) => company || <span className="text-gray-400">N/A</span>,
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
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
      </div>

      <div className="mb-4">
        <Input
          size="large"
          placeholder="Search users by name or email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="bg-white rounded-lg shadow-sm"
        scroll={{ x: 1200 }}
      />

      {/* Edit User Modal */}
      <Modal
        open={isEditModalOpen}
        onCancel={handleEditModalCancel}
        footer={null}
        width={600}
        className="top-10"
      >
        {/* Beautiful Header */}
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">Edit User</h2>
          <p className="text-white/90">Update user information</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditFormSubmit}
            className="mt-4"
          >
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

            <Form.Item
              name="role"
              label={<span className="text-gray-700 font-semibold">Role</span>}
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select size="large" placeholder="Select role">
                <Select.Option value="JOB_SEEKER">Job Seeker</Select.Option>
                <Select.Option value="EMPLOYER">Employer</Select.Option>
                <Select.Option value="ADMIN">Admin</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="companyName"
              label={<span className="text-gray-700 font-semibold">Company Name (Optional)</span>}
            >
              <Input size="large" placeholder="Enter company name" />
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
                  Update User
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

