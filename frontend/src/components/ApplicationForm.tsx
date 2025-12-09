"use client";

import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface ApplicationFormProps {
  onSubmit: (values: any) => void;
}

export default function ApplicationForm({ onSubmit }: ApplicationFormProps) {
  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Cover Letter" name="coverLetter" rules={[{ required: true }]}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Resume" name="resume" rules={[{ required: true }]}>
        <Upload beforeUpload={() => false} maxCount={1}>
          <Button icon={<UploadOutlined />}>Upload Resume</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>Submit Application</Button>
      </Form.Item>
    </Form>
  );
}
