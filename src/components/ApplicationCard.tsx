"use client";

import { Card, Tag } from "antd";

interface ApplicationCardProps {
  name: string;
  email: string;
  status: string;
}

export default function ApplicationCard({ name, email, status }: ApplicationCardProps) {
  let color = status === "Accepted" ? "green" : status === "Rejected" ? "red" : "orange";

  return (
    <Card style={{ marginBottom: 16 }}>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p>
        <strong>Status:</strong> <Tag color={color}>{status}</Tag>
      </p>
    </Card>
  );
}
