"use client";

import { Card, Button } from "antd";
import { BuildOutlined, EnvironmentOutlined } from "@ant-design/icons";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  onApply?: (jobId: string) => void;
}

export default function JobCard({ id, title, company, location, onApply }: JobCardProps) {
  return (
    <Card
      className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
      bodyStyle={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '24px' }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 min-h-[3rem]">{title}</h3>
      <div className="flex-1 space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <BuildOutlined className="mr-2 text-primary-green" />
          <span className="font-medium">{company}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <EnvironmentOutlined className="mr-2 text-primary-green" />
          <span>{location}</span>
        </div>
      </div>
      {onApply && (
        <Button
          type="primary"
          onClick={() => onApply(id)}
          className="w-full h-11 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none hover:from-primary-green-dark hover:to-[#047857] transition-all duration-300"
        >
          Apply Now
        </Button>
      )}
    </Card>
  );
}
