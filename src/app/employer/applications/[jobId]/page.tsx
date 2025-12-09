"use client";

import { Table, Tag } from "antd";
import { useParams } from "next/navigation";

const applicationsData = [
  { key: "1", name: "Ali Ahmed", email: "ali@example.com", status: "Pending" },
  { key: "2", name: "Hodan Yusuf", email: "hodan@example.com", status: "Reviewed" },
];

export default function JobApplications() {
  const params = useParams();
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = status === "Reviewed" ? "green" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <h1>Applications for Job ID: {params.jobId}</h1>
      <Table columns={columns} dataSource={applicationsData} />
    </div>
  );
}
