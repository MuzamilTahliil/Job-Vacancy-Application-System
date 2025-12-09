"use client";

import { Form, Input, Button, Card, Row, Col, message } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from "@ant-design/icons";

export default function ContactPage() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Contact form submitted:", values);
    message.success("Thank you for your message! We'll get back to you soon.");
    form.resetFields();
  };

  return (
    <div className="min-h-screen mt-14">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-white/95 leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[48, 48]}>
            {/* Contact Form */}
            <Col xs={24} lg={14}>
              <Card className="rounded-xl shadow-md border-none">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="name"
                    label="Your Name"
                    rules={[{ required: true, message: "Please enter your name" }]}
                    className="mb-4"
                  >
                    <Input size="large" placeholder="John Doe" className="rounded-lg" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                    className="mb-4"
                  >
                    <Input size="large" placeholder="john@example.com" className="rounded-lg" />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[{ required: true, message: "Please enter a subject" }]}
                    className="mb-4"
                  >
                    <Input size="large" placeholder="How can we help?" className="rounded-lg" />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: "Please enter your message" }]}
                    className="mb-4"
                  >
                    <Input.TextArea
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<SendOutlined />}
                      block
                      className="h-12 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none hover:from-primary-green-dark hover:to-[#047857] transition-all duration-300 hover:-translate-y-1"
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            {/* Contact Information */}
            <Col xs={24} lg={10}>
              <div className="bg-white p-8 sm:p-10 rounded-xl shadow-md h-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Contact Information</h2>
                <p className="text-base text-gray-600 mb-8 leading-relaxed">
                  Feel free to reach out to us through any of the following channels.
                </p>

                <div className="flex gap-5 mb-8 pb-8 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                    <MailOutlined />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600 mb-1">support@jobhub.com</p>
                    <p className="text-gray-600">info@jobhub.com</p>
                  </div>
                </div>

                <div className="flex gap-5 mb-8 pb-8 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                    <PhoneOutlined />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Phone</h3>
                    <p className="text-gray-600 mb-1">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex gap-5 mb-8 pb-8 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                    <EnvironmentOutlined />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
                    <p className="text-gray-600 mb-1">123 Business Street</p>
                    <p className="text-gray-600 mb-1">City, State 12345</p>
                    <p className="text-gray-600">Country</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Business Hours</h3>
                  <p className="text-gray-600 mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 mb-2">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

