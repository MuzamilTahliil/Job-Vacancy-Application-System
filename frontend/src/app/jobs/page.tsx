"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Tag, Card, Spin, message, Checkbox, Radio, Select } from "antd";
import { SearchOutlined, EnvironmentOutlined, CalendarOutlined, BuildOutlined, FileTextOutlined, FilterOutlined, ClearOutlined, DownOutlined, AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { getJobs, Job, JobType } from "@/app/services/jobs.service";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedFilters, setExpandedFilters] = useState({
    datePosted: false,
    locations: false,
    jobType: false,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      // Filter only active jobs
      const activeJobs = data.filter(job => job.isActive);
      setJobs(activeJobs);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      message.error("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get unique locations from jobs
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location))).sort();

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.employer?.companyName?.toLowerCase().includes(searchText.toLowerCase()) ||
      job.location.toLowerCase().includes(searchText.toLowerCase()) ||
      job.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesJobType = jobTypeFilter.length === 0 || 
      jobTypeFilter.includes(job.jobType);
    
    // Date filter logic
    const matchesDate = !dateFilter || (() => {
      const jobDate = new Date(job.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - jobDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case "24h": return diffDays <= 1;
        case "3d": return diffDays <= 3;
        case "7d": return diffDays <= 7;
        case "30d": return diffDays <= 30;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesLocation && matchesJobType && matchesDate;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  const clearFilters = () => {
    setSearchText("");
    setLocationFilter("");
    setJobTypeFilter([]);
    setDateFilter("");
  };

  const hasActiveFilters = searchText || locationFilter || jobTypeFilter.length > 0 || dateFilter;

  const toggleFilter = (filterName: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
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

  const handleJobClick = (jobId: number) => {
    router.push(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 pt-24">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FilterOutlined className="text-gray-700 text-lg" />
                  <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-green hover:text-primary-green-dark font-medium flex items-center gap-1"
                  >
                    <ClearOutlined /> Clear all
                  </button>
                )}
              </div>

              {/* Date Posted Filter - Collapsible Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div
                  onClick={() => toggleFilter('datePosted')}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-gray-600" />
                    <span className="text-gray-800 font-semibold">Date Posted</span>
                  </div>
                  <DownOutlined 
                    className={`text-gray-600 transition-transform ${expandedFilters.datePosted ? 'rotate-180' : ''}`}
                  />
                </div>
                {expandedFilters.datePosted && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <Radio.Group
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="flex flex-col gap-3 w-full mt-3"
                    >
                      <Radio value="24h" className="text-gray-700">Past 24 hours</Radio>
                      <Radio value="3d" className="text-gray-700">Past 3 days</Radio>
                      <Radio value="7d" className="text-gray-700">Past 7 days</Radio>
                      <Radio value="30d" className="text-gray-700">Past 30 days</Radio>
                    </Radio.Group>
                  </div>
                )}
              </div>

              {/* Locations Filter - Collapsible Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div
                  onClick={() => toggleFilter('locations')}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined className="text-gray-600" />
                    <span className="text-gray-800 font-semibold">Locations</span>
                  </div>
                  <DownOutlined 
                    className={`text-gray-600 transition-transform ${expandedFilters.locations ? 'rotate-180' : ''}`}
                  />
                </div>
                {expandedFilters.locations && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <Input
                      placeholder="Search locations..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="rounded-lg mt-3"
                      prefix={<SearchOutlined className="text-gray-400" />}
                    />
                  </div>
                )}
              </div>

              {/* Job Type Filter - Collapsible Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div
                  onClick={() => toggleFilter('jobType')}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-gray-600" />
                    <span className="text-gray-800 font-semibold">Job type</span>
                  </div>
                  <DownOutlined 
                    className={`text-gray-600 transition-transform ${expandedFilters.jobType ? 'rotate-180' : ''}`}
                  />
                </div>
                {expandedFilters.jobType && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <Checkbox.Group
                      value={jobTypeFilter}
                      onChange={(values) => setJobTypeFilter(values as JobType[])}
                      className="flex flex-col gap-3 w-full mt-3"
                    >
                      <Checkbox value={JobType.FULL_TIME} className="text-gray-700">Full-time</Checkbox>
                      <Checkbox value={JobType.PART_TIME} className="text-gray-700">Part-time</Checkbox>
                      <Checkbox value={JobType.CONTRACT} className="text-gray-700">Contract</Checkbox>
                      <Checkbox value={JobType.INTERNSHIP} className="text-gray-700">Internship</Checkbox>
                    </Checkbox.Group>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header with Search and Sort */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Available Jobs</h1>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Sort</span>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-32"
                    options={[
                      { value: "newest", label: "Newest" },
                      { value: "oldest", label: "Oldest" },
                    ]}
                  />
                </div>
              </div>
              <Input
                size="large"
                placeholder="Search by title, company, location, or keywords..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="rounded-lg"
              />
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {sortedJobs.length > 0 ? (
                sortedJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary-green"
                onClick={() => handleJobClick(job.id)}
              >
                <div className="flex gap-4">
                  {/* Company Logo Placeholder */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {job.employer?.companyName?.charAt(0).toUpperCase() || job.employer?.fullName?.charAt(0).toUpperCase() || "J"}
                    </span>
                  </div>

                  {/* Job Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary-green transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Tag
                        icon={<BuildOutlined />}
                        className="px-3 py-1 rounded-full border-0 bg-primary-green-light text-primary-green font-medium"
                      >
                        {job.employer?.companyName || "Company"}
                      </Tag>
                      <Tag
                        icon={<EnvironmentOutlined />}
                        className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium"
                      >
                        {job.location}
                      </Tag>
                      <Tag
                        color={getJobTypeColor(job.jobType)}
                        className="px-3 py-1 rounded-full border-0 font-medium"
                      >
                        {job.jobType.replace('_', ' ')}
                      </Tag>
                      <Tag
                        icon={<CalendarOutlined />}
                        className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium"
                      >
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </Tag>
                      {job.salary && (
                        <Tag className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium">
                          {job.salary}
                        </Tag>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-16">
                <p className="text-lg text-gray-600 mb-2">No jobs found matching your search criteria.</p>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
