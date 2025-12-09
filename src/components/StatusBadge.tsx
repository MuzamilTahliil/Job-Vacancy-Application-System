"use client";

import { Tag } from "antd";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let color = status === "Accepted" ? "green" : status === "Rejected" ? "red" : "orange";
  return <Tag color={color}>{status}</Tag>;
}
