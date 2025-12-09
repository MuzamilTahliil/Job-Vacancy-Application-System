"use client";

import { Form, Input, Button, Card } from "antd";

export default function PostJob() {
  const onFinish = (values: any) => {
    console.log("New Job:", values);
  };

  return (
    <Card title="Post a New Job" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
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
          <Button type="primary" htmlType="submit">Post Job</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
