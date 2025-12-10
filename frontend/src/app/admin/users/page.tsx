"use client";

import { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Input, message, Popconfirm, Modal, Select, Spin, Tooltip } from "antd";
import { SearchOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getUsers, deleteUser, User } from "@/app/services/users.service";
import { UserRole } from "@/app/services/auth.service";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);

  // Get current user role
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole") as UserRole;
      setCurrentUserRole(role);
    }
  }, []);

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getUsers();
      // Show all users
      setUsers(allUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      message.success("User deleted successfully");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user. Please try again.");
    }
  };


  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleView = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setViewingUser(user);
      setIsViewModalOpen(true);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 180,
      render: (phone: string) => phone || <span className="text-gray-400">null</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 140,
      render: (role: string) => {
        const color =
          role === UserRole.SUPER_ADMIN
            ? "purple"
            : role === UserRole.ADMIN
            ? "red"
            : role === UserRole.EMPLOYER
            ? "blue"
            : "green";
        return <Tag color={color}>{role.replace('_', ' ')}</Tag>;
      },
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      width: 220,
      sorter: (a, b) => {
        const aCompany = a.companyName || "";
        const bCompany = b.companyName || "";
        return aCompany.localeCompare(bCompany);
      },
      render: (company: string, record: User) => {
        if (record.role === UserRole.EMPLOYER) {
          return company ? (
            <span className="font-medium text-gray-800">{company}</span>
          ) : (
            <span className="text-gray-400">null</span>
          );
        }
        return <span className="text-gray-400">null</span>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (updatedAt: string) => new Date(updatedAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => {
        // Show delete for all users (admin can delete anyone)
        const canDelete = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SUPER_ADMIN;

        return (
          <Space size="large">
            <Tooltip title="View User">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleView(record.id)}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              />
            </Tooltip>
            {canDelete && (
              <Popconfirm
                title="Delete user"
                description="Are you sure you want to delete this user?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete User">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    className="hover:bg-red-50"
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <Input
          size="large"
          placeholder="Search users by name, email, or company..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md flex-1 min-w-[300px]"
        />
        <Select
          size="large"
          placeholder="Filter by Role"
          value={roleFilter}
          onChange={(value) => setRoleFilter(value)}
          className="w-[200px]"
          allowClear
        >
          <Select.Option value="ALL">All Roles</Select.Option>
          <Select.Option value={UserRole.ADMIN}>Admin</Select.Option>
          <Select.Option value={UserRole.SUPER_ADMIN}>Super Admin</Select.Option>
          <Select.Option value={UserRole.EMPLOYER}>Employer</Select.Option>
          <Select.Option value={UserRole.JOB_SEEKER}>Job Seeker</Select.Option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          className="bg-white rounded-lg shadow-sm"
          scroll={{ x: 1500 }}
          loading={loading}
          size="middle"
        />
      )}

      {/* View User Modal */}
      <Modal
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          setViewingUser(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsViewModalOpen(false);
            setViewingUser(null);
          }}>
            Close
          </Button>,
        ]}
        width={800}
        className="top-10"
      >
        <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white -m-6 mb-6 px-6 py-6 rounded-t-lg">
          <h2 className="text-3xl font-bold mb-2">User Details</h2>
          <p className="text-white/90">View user information</p>
        </div>

        {viewingUser && (
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary-green">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-500 text-sm font-medium block mb-2">User ID</label>
                  <p className="text-gray-800 text-base font-medium">{viewingUser.id}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium block mb-2">Role</label>
                  <div>
                    <Tag
                      color={
                        viewingUser.role === UserRole.SUPER_ADMIN
                          ? "purple"
                          : viewingUser.role === UserRole.ADMIN
                          ? "red"
                          : viewingUser.role === UserRole.EMPLOYER
                          ? "blue"
                          : "green"
                      }
                      className="text-sm px-3 py-1"
                    >
                      {viewingUser.role.replace('_', ' ')}
                    </Tag>
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium block mb-2">Full Name</label>
                  <p className="text-gray-800 text-base">{viewingUser.fullName}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium block mb-2">Email Address</label>
                  <p className="text-gray-800 text-base">{viewingUser.email}</p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium block mb-2">Phone Number</label>
                  <p className="text-gray-800 text-base">
                    {viewingUser.phoneNumber || (
                      <span className="text-gray-400">null</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 text-sm font-medium block mb-2">Account Created</label>
                  <p className="text-gray-800 text-base">
                    {new Date(viewingUser.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-gray-500 text-sm font-medium block mb-2">Last Updated</label>
                  <p className="text-gray-800 text-base">
                    {new Date(viewingUser.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Company Information Section */}
            {viewingUser.role === UserRole.EMPLOYER && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-primary-green">
                  Company Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm font-medium block mb-2">Company Name</label>
                    {viewingUser.companyName ? (
                      <p className="text-gray-800 text-base font-semibold">{viewingUser.companyName}</p>
                    ) : (
                      <p className="text-gray-400 text-base">null</p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm font-medium block mb-2">Company Location</label>
                    {viewingUser.companyLocation ? (
                      <p className="text-gray-800 text-base">{viewingUser.companyLocation}</p>
                    ) : (
                      <p className="text-gray-400 text-base">null</p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm font-medium block mb-2">Company Website</label>
                    {viewingUser.companyWebsite ? (
                      <a
                        href={viewingUser.companyWebsite.startsWith('http') ? viewingUser.companyWebsite : `https://${viewingUser.companyWebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-base"
                      >
                        {viewingUser.companyWebsite}
                      </a>
                    ) : (
                      <p className="text-gray-400 text-base">null</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm font-medium block mb-2">Company Description</label>
                    {viewingUser.companyDescription ? (
                      <p className="text-gray-800 text-base whitespace-pre-wrap">{viewingUser.companyDescription}</p>
                    ) : (
                      <p className="text-gray-400 text-base">null</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Show message if user is not an employer */}
            {viewingUser.role !== UserRole.EMPLOYER && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-sm">
                  This user is a <span className="font-semibold">{viewingUser.role.replace('_', ' ')}</span> and does not have associated company information.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}

