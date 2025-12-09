"use client";

import { Card, Table, Button } from "antd";

interface Job {
  key: string;
  title: string;
  applicants: number;
  status: string;
}

const data: Job[] = [
  { key: "1", title: "Frontend Developer", applicants: 5, status: "Open" },
  { key: "2", title: "Backend Developer", applicants: 2, status: "Closed" },
  { key: "2", title: "Ui&Ux Designer", applicants: 2, status: "Closed" },
];

export default function EmployerDashboard() {
  const columns = [
    { title: "Job Title", dataIndex: "title", key: "title" },
    { title: "Applicants", dataIndex: "applicants", key: "applicants" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Job) => (
        <Button type="primary">View Applications</Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Employer Dashboard</h1>
      <Card style={{ marginBottom: 16 }}>
        <Button type="primary">Post New Job</Button>
      </Card>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
