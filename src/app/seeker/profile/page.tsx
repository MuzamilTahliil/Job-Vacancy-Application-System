"use client";

import { Form, Input, Button, Card } from "antd";

export default function SeekerProfile() {
  const onFinish = (values: any) => {
    console.log("Profile updated:", values);
  };

  return (
    <Card title="Edit Profile" style={{ maxWidth: 500, margin: "2rem auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Bio" name="bio">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Save Profile</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
