"use client";

import { Form, Input, Button, Card } from "antd";

interface JobFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
}

export default function JobForm({ initialValues = {}, onSubmit }: JobFormProps) {
  return (
    <Card title={initialValues.id ? "Edit Job" : "Create Job"} style={{ maxWidth: 600, margin: "2rem auto" }}>
      <Form layout="vertical" initialValues={initialValues} onFinish={onSubmit}>
        <Form.Item label="Job Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Company" name="company" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Job Description" name="description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">{initialValues.id ? "Update Job" : "Create Job"}</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
