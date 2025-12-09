"use client";

import { Card, Row, Col } from "antd";
import { TeamOutlined, RocketOutlined, TrophyOutlined, HeartOutlined } from "@ant-design/icons";

export default function AboutPage() {
  return (
    <div className="min-h-screen mt-14">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">About JobHub</h1>
          <p className="text-lg sm:text-xl text-white/95 leading-relaxed">
            We're on a mission to connect talented professionals with their dream careers
            and help companies find the perfect candidates.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
                <p className="text-base text-gray-600 leading-relaxed mb-4">
                  At JobHub, we believe that finding the right job or the right candidate
                  shouldn't be complicated. Our platform simplifies the hiring process,
                  making it easier for job seekers to discover opportunities and for
                  employers to find top talent.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  We're committed to creating a seamless experience that benefits both
                  sides of the job market, fostering meaningful connections that lead to
                  successful careers and thriving businesses.
                </p>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Our Vision</h2>
                <p className="text-base text-gray-600 leading-relaxed mb-4">
                  To become the leading job marketplace where every professional finds
                  their ideal role and every company discovers exceptional talent. We
                  envision a future where the job search process is transparent, efficient,
                  and rewarding for everyone involved.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Through innovation and dedication, we're building a platform that
                  transforms how people connect with career opportunities.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <TeamOutlined className="text-5xl text-primary-green mb-5" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Collaboration</h3>
                <p className="text-sm text-gray-600">Building strong connections between job seekers and employers</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <RocketOutlined className="text-5xl text-primary-green mb-5" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Innovation</h3>
                <p className="text-sm text-gray-600">Continuously improving our platform with cutting-edge technology</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <TrophyOutlined className="text-5xl text-primary-green mb-5" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Excellence</h3>
                <p className="text-sm text-gray-600">Delivering the highest quality service to all our users</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <HeartOutlined className="text-5xl text-primary-green mb-5" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Integrity</h3>
                <p className="text-sm text-gray-600">Operating with honesty and transparency in everything we do</p>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-green to-primary-green-dark text-white">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[32, 32]}>
            <Col xs={12} md={6}>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">10K+</div>
                <div className="text-lg text-white/90 font-medium">Active Jobs</div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">50K+</div>
                <div className="text-lg text-white/90 font-medium">Job Seekers</div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">5K+</div>
                <div className="text-lg text-white/90 font-medium">Companies</div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">95%</div>
                <div className="text-lg text-white/90 font-medium">Success Rate</div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

