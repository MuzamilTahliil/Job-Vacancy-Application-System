"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Tag, Spin, message, Modal, Form, Input } from "antd";
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  BuildOutlined, 
  DollarOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { getJobById, Job, JobType, trackJobView } from "@/app/services/jobs.service";
import { createApplication } from "@/app/services/applications.service";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (params.id) {
      fetchJob();
      // Track view - call API to record view
      trackView(Number(params.id));
    }
  }, [params.id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await getJobById(Number(params.id));
      setJob(data);
    } catch (error: any) {
      console.error("Error fetching job:", error);
      message.error("Failed to load job details. Please try again.");
      router.push("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (jobId: number) => {
    try {
      console.log(`[JobDetail] Tracking view for jobId: ${jobId}`);
      // Track view using API service
      const result = await trackJobView(jobId);
      console.log(`[JobDetail] View tracked successfully:`, result);
    } catch (error: any) {
      // Log error but don't show to user - view tracking is not critical
      console.error("Error tracking view:", error);
      console.error("Error details:", error?.response?.data || error?.message);
    }
  };

  const handleApply = () => {
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (values: any) => {
    if (!job) return;
    
    try {
      setApplying(true);
      await createApplication({
        jobId: job.id,
        coverLetter: values.coverLetter,
        resumeUrl: values.resumeUrl,
      });
      message.success("Application submitted successfully!");
      setIsApplyModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error("Error applying:", error);
      message.error(error?.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const getJobTypeColor = (jobType: JobType): string => {
    const colors: Record<JobType, string> = {
      [JobType.FULL_TIME]: "blue",
      [JobType.PART_TIME]: "green",
      [JobType.CONTRACT]: "orange",
      [JobType.INTERNSHIP]: "purple",
    };
    return colors[jobType] || "default";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-24">
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-24 text-center">
        <p>Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          className="mb-6"
        >
          Back to Jobs
        </Button>

        <Card className="mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Tag
                  icon={<BuildOutlined />}
                  className="px-3 py-1 rounded-full border-0 bg-primary-green-light text-primary-green font-medium text-base"
                >
                  {job.employer?.companyName || "Company"}
                </Tag>
                <Tag
                  icon={<EnvironmentOutlined />}
                  className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium text-base"
                >
                  {job.location}
                </Tag>
                <Tag
                  color={getJobTypeColor(job.jobType)}
                  className="px-3 py-1 rounded-full border-0 font-medium text-base"
                >
                  {job.jobType.replace('_', ' ')}
                </Tag>
                {job.salary && (
                  <Tag
                    icon={<DollarOutlined />}
                    className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium text-base"
                  >
                    {job.salary}
                  </Tag>
                )}
                <Tag
                  icon={<CalendarOutlined />}
                  className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium text-base"
                >
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </Tag>
              </div>
            </div>
          </div>

          {/* Company Information */}
          {job.employer && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Company Name:</span>
                  <p className="text-gray-900">{job.employer.companyName || <span className="text-gray-400">null</span>}</p>
                </div>
                {job.employer.companyLocation && (
                  <div>
                    <span className="font-semibold text-gray-700">Company Location:</span>
                    <p className="text-gray-900">{job.employer.companyLocation}</p>
                  </div>
                )}
                {job.employer.companyDescription && (
                  <div>
                    <span className="font-semibold text-gray-700">Company Description:</span>
                    <p className="text-gray-900 whitespace-pre-wrap bg-white p-3 rounded mt-2">{job.employer.companyDescription}</p>
                  </div>
                )}
                {job.employer.companyWebsite && (
                  <div>
                    <span className="font-semibold text-gray-700">Company Website:</span>
                    <p className="text-gray-900">
                      <a href={job.employer.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary-green hover:underline">
                        {job.employer.companyWebsite}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-700">Contact Email:</span>
                  <p className="text-gray-900 flex items-center gap-2">
                    <MailOutlined />
                    <a href={`mailto:${job.employer.email}`} className="text-primary-green hover:underline">
                      {job.employer.email || <span className="text-gray-400">null</span>}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Employer Name:</span>
                  <p className="text-gray-900">{job.employer.fullName || <span className="text-gray-400">null</span>}</p>
                </div>
              </div>
            </div>
          )}

          {/* Job Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {job.requirements}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Responsibilities</h2>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {job.responsibilities}
            </p>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center mt-8">
            <Button
              type="primary"
              size="large"
              icon={<FileTextOutlined />}
              onClick={handleApply}
              className="bg-primary-green hover:bg-primary-green-dark border-primary-green h-12 px-8 text-lg font-semibold"
            >
              Apply for this Job
            </Button>
          </div>
        </Card>
      </div>

      {/* Apply Modal */}
      <Modal
        title="Apply for this Job"
        open={isApplyModalOpen}
        onCancel={() => {
          setIsApplyModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApplySubmit}
        >
          <Form.Item
            name="coverLetter"
            label="Cover Letter"
            rules={[{ required: true, message: "Please write a cover letter" }]}
          >
            <Input.TextArea
              rows={6}
              placeholder="Tell us why you're a great fit for this position..."
            />
          </Form.Item>
          <Form.Item
            name="resumeUrl"
            label="Resume URL (Optional)"
          >
            <Input placeholder="https://example.com/resume.pdf" />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end gap-3">
              <Button onClick={() => {
                setIsApplyModalOpen(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={applying}
                className="bg-primary-green hover:bg-primary-green-dark border-primary-green"
              >
                Submit Application
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

