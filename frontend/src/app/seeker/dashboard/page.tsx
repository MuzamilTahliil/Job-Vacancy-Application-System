"use client";

import { Table, Tag } from "antd";

interface Application {
  key: string;
  jobTitle: string;
  company: string;
  status: string;
}

const data: Application[] = [
  { key: "1", jobTitle: "Frontend Developer", company: "ABC Corp", status: "Pending" },
  { key: "2", jobTitle: "Backend Developer", company: "XYZ Ltd", status: "Accepted" },
  { key: "2", jobTitle: "Ui&Ux Designer", company: "XYZ Ltd", status: "Accepted" },
];

export default function SeekerDashboard() {
  const columns = [
    { title: "Job Title", dataIndex: "jobTitle", key: "jobTitle" },
    { title: "Company", dataIndex: "company", key: "company" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = status === "Accepted" ? "green" : status === "Rejected" ? "red" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <h1>Seeker Dashboard</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
