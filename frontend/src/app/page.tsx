"use client";

import { useState } from "react";
import { Row, Col, Input, Button, Card } from "antd";
import { SearchOutlined, RocketOutlined, TeamOutlined, TrophyOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import JobCard from "@/components/JobCard";

// Featured jobs data
const featuredJobs = [
  { id: "1", title: "Frontend Developer", company: "ABC Corp", location: "Mogadishu", status: "Open" },
  { id: "2", title: "Backend Developer", company: "XYZ Ltd", location: "Hargeisa", status: "Open" },
  { id: "3", title: "UI/UX Designer", company: "Tech Solutions", location: "Hargeisa", status: "Open" },
  { id: "4", title: "Full Stack Developer", company: "Digital Innovations", location: "Mogadishu", status: "Open" },
];

export default function HomePage() {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="min-h-screen mt-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find Your Dream <span className="relative inline-block">
              Job
              <span className="absolute bottom-2 left-0 right-0 h-2 bg-white/30 rounded"></span>
            </span>
          </h1>
          <p className="text-lg sm:text-xl mb-10 text-white/95 max-w-2xl mx-auto leading-relaxed">
            Connect with top employers and discover opportunities that match your skills and passion.
            Start your career journey today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button
                type="primary"
                size="large"
                className="h-14 px-8 text-lg font-semibold rounded-xl bg-white text-primary-green border-none hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRightOutlined />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button
                size="large"
                className="h-14 px-8 text-lg font-semibold rounded-xl bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary-green transition-all duration-300 hover:-translate-y-1"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12">Why Choose JobHub?</h2>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <RocketOutlined className="text-5xl text-primary-green mb-5" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Easy</h3>
                <p className="text-gray-600">Quick job search and application process</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <TeamOutlined className="text-5xl text-primary-green mb-5" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Trusted Companies</h3>
                <p className="text-gray-600">Verified employers and quality opportunities</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <TrophyOutlined className="text-5xl text-primary-green mb-5" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Best Matches</h3>
                <p className="text-gray-600">Smart algorithms find your perfect fit</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <SearchOutlined className="text-5xl text-primary-green mb-5" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Wide Selection</h3>
                <p className="text-gray-600">Thousands of jobs across all industries</p>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Featured Jobs</h2>
            <Link href="/jobs">
              <Button
                type="link"
                className="text-primary-green font-semibold text-base flex items-center gap-2 p-0 h-auto"
              >
                View All Jobs <ArrowRightOutlined />
              </Button>
            </Link>
          </div>
          <Row gutter={[24, 24]}>
            {featuredJobs.map((job) => (
              <Col xs={24} sm={12} lg={6} key={job.id}>
                <JobCard
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  onApply={() => {}}
                />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-green to-primary-green-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5">Ready to Start Your Career Journey?</h2>
          <p className="text-lg sm:text-xl mb-10 text-white/95">
            Join thousands of job seekers who found their dream jobs through JobHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                type="primary"
                size="large"
                className="h-14 px-8 text-lg font-semibold rounded-xl bg-white text-primary-green border-none hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Create Free Account
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="large"
                className="h-14 px-8 text-lg font-semibold rounded-xl bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary-green transition-all duration-300 hover:-translate-y-1"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
