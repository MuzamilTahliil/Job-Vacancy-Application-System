// "use client";

// import { useState } from "react";
// import { Input, Modal, message, Checkbox, Radio, Select, Button, Tag } from "antd";
// import { SearchOutlined, FilterOutlined, CalendarOutlined, EnvironmentOutlined, BuildOutlined, ClearOutlined, DownOutlined, FileTextOutlined, AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
// import ApplicationForm from "@/components/ApplicationForm";

// // Placeholder jobs data with dates and job types
// const initialJobs = [
//   { id: "1", title: "Frontend Developer", company: "ABC Corp", location: "Mogadishu", status: "Open", datePosted: "Yesterday", jobType: "Full-time", category: "Technology", careerLevel: "Mid Level" },
//   { id: "2", title: "Backend Developer", company: "XYZ Ltd", location: "Hargeisa", status: "Open", datePosted: "2 days ago", jobType: "Part-time", category: "Technology", careerLevel: "Senior Level" },
//   { id: "3", title: "UI/UX Designer", company: "Tech Solutions", location: "Hargeisa", status: "Open", datePosted: "Yesterday", jobType: "Contract", category: "Technology", careerLevel: "Mid Level" },
//   { id: "4", title: "Full Stack Developer", company: "Digital Innovations", location: "Mogadishu", status: "Open", datePosted: "3 days ago", jobType: "Full-time", category: "Technology", careerLevel: "Senior Level" },
//   { id: "5", title: "DevOps Engineer", company: "Cloud Systems", location: "Mogadishu", status: "Open", datePosted: "Yesterday", jobType: "Full-time", category: "Technology", careerLevel: "Mid Level" },
//   { id: "6", title: "Data Scientist", company: "AI Analytics", location: "Hargeisa", status: "Closed", datePosted: "5 days ago", jobType: "Part-time", category: "Technology", careerLevel: "Senior Level" },
//   { id: "7", title: "Mobile App Developer", company: "Tech Innovations", location: "Mogadishu", status: "Open", datePosted: "Yesterday", jobType: "Contract", category: "Technology", careerLevel: "Entry Level" },
//   { id: "8", title: "Software Engineer", company: "Digital Solutions", location: "Hargeisa", status: "Open", datePosted: "4 days ago", jobType: "Full-time", category: "Technology", careerLevel: "Mid Level" },
// ];

// export default function JobsPage() {
//   const [searchText, setSearchText] = useState("");
//   const [locationFilter, setLocationFilter] = useState("");
//   const [dateFilter, setDateFilter] = useState<string>(""); // Single selection for date
//   const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]); // Multiple selection for job type
//   const [categoryFilter, setCategoryFilter] = useState<string[]>([]); // Multiple selection for category
//   const [careerLevelFilter, setCareerLevelFilter] = useState<string[]>([]); // Multiple selection for career level
//   const [sortBy, setSortBy] = useState("newest");
//   const [selectedJob, setSelectedJob] = useState<any>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [expandedFilters, setExpandedFilters] = useState({
//     datePosted: false,
//     locations: false,
//     categories: false,
//     jobType: false,
//     careerLevel: false,
//   });

//   // Show apply modal
//   const showModal = (job: any) => {
//     setSelectedJob(job);
//     setIsModalOpen(true);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     setSelectedJob(null);
//   };

//   // Handle application submit
//   const handleApplicationSubmit = (values: any) => {
//     console.log("Application submitted:", values);
//     if (selectedJob) {
//       message.success(`Application submitted for ${selectedJob.title}`);
//     }
//     setIsModalOpen(false);
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchText("");
//     setLocationFilter("");
//     setDateFilter("");
//     setJobTypeFilter([]);
//     setCategoryFilter([]);
//     setCareerLevelFilter([]);
//   };

//   const hasActiveFilters = searchText || locationFilter || dateFilter || jobTypeFilter.length > 0 || categoryFilter.length > 0 || careerLevelFilter.length > 0;

//   const toggleFilter = (filterName: keyof typeof expandedFilters) => {
//     setExpandedFilters(prev => ({
//       ...prev,
//       [filterName]: !prev[filterName]
//     }));
//   };

//   // Filter and sort jobs
//   let filteredJobs = initialJobs.filter(job => {
//     const matchesSearch = job.title.toLowerCase().includes(searchText.toLowerCase()) ||
//       job.company.toLowerCase().includes(searchText.toLowerCase()) ||
//       job.location.toLowerCase().includes(searchText.toLowerCase());
    
//     const matchesLocation = !locationFilter || 
//       job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
//     const matchesJobType = jobTypeFilter.length === 0 || 
//       jobTypeFilter.includes(job.jobType);
    
//     const matchesCategory = categoryFilter.length === 0 || 
//       categoryFilter.includes(job.category || "");
    
//     const matchesCareerLevel = careerLevelFilter.length === 0 || 
//       careerLevelFilter.includes(job.careerLevel || "");
    
//     return matchesSearch && matchesLocation && matchesJobType && matchesCategory && matchesCareerLevel;
//   });

//   // Sort jobs
//   if (sortBy === "newest") {
//     filteredJobs = [...filteredJobs].sort((a, b) => {
//       const dateA = a.datePosted.includes("Yesterday") ? 1 : parseInt(a.datePosted) || 0;
//       const dateB = b.datePosted.includes("Yesterday") ? 1 : parseInt(b.datePosted) || 0;
//       return dateA - dateB;
//     });
//   } else if (sortBy === "oldest") {
//     filteredJobs = [...filteredJobs].sort((a, b) => {
//       const dateA = a.datePosted.includes("Yesterday") ? 1 : parseInt(a.datePosted) || 0;
//       const dateB = b.datePosted.includes("Yesterday") ? 1 : parseInt(b.datePosted) || 0;
//       return dateB - dateA;
//     });
//   }


//   return (
//     <div className="min-h-screen bg-gray-50 pt-24">

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Left Sidebar - Filters - Sticky with Scroll */}
//           <aside className="w-full lg:w-80 flex-shrink-0">
//             <div className="space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">
//               {/* Filter Header */}
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <FilterOutlined className="text-gray-700 text-lg" />
//                   <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
//                 </div>
//                 {hasActiveFilters && (
//                   <button
//                     onClick={clearFilters}
//                     className="text-sm text-primary-green hover:text-primary-green-dark font-medium flex items-center gap-1"
//                   >
//                     <ClearOutlined /> Clear all
//                   </button>
//                 )}
//               </div>

//               {/* Date Posted Filter - Collapsible Card */}
//               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//                 <div
//                   onClick={() => toggleFilter('datePosted')}
//                   className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center gap-2">
//                     <CalendarOutlined className="text-gray-600" />
//                     <span className="text-gray-800 font-semibold">Date Posted</span>
//                   </div>
//                   <DownOutlined 
//                     className={`text-gray-600 transition-transform ${expandedFilters.datePosted ? 'rotate-180' : ''}`}
//                   />
//                 </div>
//                 {expandedFilters.datePosted && (
//                   <div className="px-4 pb-4 border-t border-gray-100">
//                     <Radio.Group
//                       value={dateFilter}
//                       onChange={(e) => setDateFilter(e.target.value)}
//                       className="flex flex-col gap-3 w-full mt-3"
//                     >
//                       <Radio value="24h" className="text-gray-700">Past 24 hours</Radio>
//                       <Radio value="3d" className="text-gray-700">Past 3 days</Radio>
//                       <Radio value="7d" className="text-gray-700">Past 7 days</Radio>
//                       <Radio value="30d" className="text-gray-700">Past 30 days</Radio>
//                     </Radio.Group>
//                   </div>
//                 )}
//               </div>

//               {/* Locations Filter - Collapsible Card */}
//               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//                 <div
//                   onClick={() => toggleFilter('locations')}
//                   className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center gap-2">
//                     <EnvironmentOutlined className="text-gray-600" />
//                     <span className="text-gray-800 font-semibold">Locations</span>
//                   </div>
//                   <DownOutlined 
//                     className={`text-gray-600 transition-transform ${expandedFilters.locations ? 'rotate-180' : ''}`}
//                   />
//                 </div>
//                 {expandedFilters.locations && (
//                   <div className="px-4 pb-4 border-t border-gray-100">
//                     <Input
//                       placeholder="Search locations..."
//                       value={locationFilter}
//                       onChange={(e) => setLocationFilter(e.target.value)}
//                       className="rounded-lg mt-3"
//                       prefix={<SearchOutlined className="text-gray-400" />}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Categories Filter - Collapsible Card */}
//               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//                 <div
//                   onClick={() => toggleFilter('categories')}
//                   className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center gap-2">
//                     <AppstoreOutlined className="text-gray-600" />
//                     <span className="text-gray-800 font-semibold">Categories</span>
//                   </div>
//                   <DownOutlined 
//                     className={`text-gray-600 transition-transform ${expandedFilters.categories ? 'rotate-180' : ''}`}
//                   />
//                 </div>
//                 {expandedFilters.categories && (
//                   <div className="px-4 pb-4 border-t border-gray-100">
//                     <Checkbox.Group
//                       value={categoryFilter}
//                       onChange={(values) => setCategoryFilter(values as string[])}
//                       className="flex flex-col gap-3 w-full mt-3"
//                     >
//                       <Checkbox value="Technology" className="text-gray-700">Technology</Checkbox>
//                       <Checkbox value="Management" className="text-gray-700">Management</Checkbox>
//                       <Checkbox value="Sales" className="text-gray-700">Sales</Checkbox>
//                       <Checkbox value="Marketing" className="text-gray-700">Marketing</Checkbox>
//                     </Checkbox.Group>
//                   </div>
//                 )}
//               </div>

//               {/* Job Type Filter - Collapsible Card */}
//               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//                 <div
//                   onClick={() => toggleFilter('jobType')}
//                   className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center gap-2">
//                     <FileTextOutlined className="text-gray-600" />
//                     <span className="text-gray-800 font-semibold">Job type</span>
//                   </div>
//                   <DownOutlined 
//                     className={`text-gray-600 transition-transform ${expandedFilters.jobType ? 'rotate-180' : ''}`}
//                   />
//                 </div>
//                 {expandedFilters.jobType && (
//                   <div className="px-4 pb-4 border-t border-gray-100">
//                     <Checkbox.Group
//                       value={jobTypeFilter}
//                       onChange={(values) => setJobTypeFilter(values as string[])}
//                       className="flex flex-col gap-3 w-full mt-3"
//                     >
//                       <Checkbox value="Full-time" className="text-gray-700">Full-time</Checkbox>
//                       <Checkbox value="Part-time" className="text-gray-700">Part-time</Checkbox>
//                       <Checkbox value="Contract" className="text-gray-700">Contract</Checkbox>
//                       <Checkbox value="Internship" className="text-gray-700">Internship</Checkbox>
//                     </Checkbox.Group>
//                   </div>
//                 )}
//               </div>

//               {/* Career Level Filter - Collapsible Card */}
//               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//                 <div
//                   onClick={() => toggleFilter('careerLevel')}
//                   className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center gap-2">
//                     <BarsOutlined className="text-gray-600" />
//                     <span className="text-gray-800 font-semibold">Career level</span>
//                   </div>
//                   <DownOutlined 
//                     className={`text-gray-600 transition-transform ${expandedFilters.careerLevel ? 'rotate-180' : ''}`}
//                   />
//                 </div>
//                 {expandedFilters.careerLevel && (
//                   <div className="px-4 pb-4 border-t border-gray-100">
//                     <Checkbox.Group
//                       value={careerLevelFilter}
//                       onChange={(values) => setCareerLevelFilter(values as string[])}
//                       className="flex flex-col gap-3 w-full mt-3"
//                     >
//                       <Checkbox value="Entry Level" className="text-gray-700">Entry Level</Checkbox>
//                       <Checkbox value="Mid Level" className="text-gray-700">Mid Level</Checkbox>
//                       <Checkbox value="Senior Level" className="text-gray-700">Senior Level</Checkbox>
//                       <Checkbox value="Executive" className="text-gray-700">Executive</Checkbox>
//                     </Checkbox.Group>
//                   </div>
//                 )}
//               </div>

//               {/* Search Button */}
//               <Button
//                 type="primary"
//                 icon={<SearchOutlined />}
//                 block
//                 size="large"
//                 onClick={() => {
//                   // Filter logic is already applied via state changes
//                   message.success("Filters applied");
//                 }}
//                 className="h-12 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none hover:from-primary-green-dark hover:to-[#047857] shadow-md hover:shadow-lg transition-all"
//               >
//                 Search
//               </Button>
//             </div>
//           </aside>

//           {/* Right Main Content - Scrollable */}
//           <div className="flex-1 min-w-0">
//             {/* Header with Search and Sort */}
//             <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//               <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Jobs</h1>
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-600 font-medium">Sort</span>
//                   <Select
//                     value={sortBy}
//                     onChange={setSortBy}
//                     className="w-32"
//                     options={[
//                       { value: "newest", label: "Newest" },
//                       { value: "oldest", label: "Oldest" },
//                     ]}
//                   />
//                 </div>
//               </div>
//               <Input
//                 size="large"
//                 placeholder="Search by title, company or keywords"
//                 prefix={<SearchOutlined className="text-gray-400" />}
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="rounded-lg"
//               />
//             </div>

//             {/* Jobs List */}
//             <div className="space-y-4">
//               {filteredJobs.length > 0 ? (
//                 filteredJobs.map((job) => (
//                   <div
//                     key={job.id}
//                     className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary-green"
//                     onClick={() => showModal(job)}
//                   >
//                     <div className="flex gap-4">
//                       {/* Company Logo Placeholder */}
//                       <div className="w-16 h-16 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-lg flex items-center justify-center flex-shrink-0">
//                         <span className="text-white font-bold text-xl">
//                           {job.company.charAt(0)}
//                         </span>
//                       </div>

//                       {/* Job Details */}
//                       <div className="flex-1">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3 hover:text-primary-green transition-colors">
//                           {job.title}
//                         </h3>
//                         <div className="flex flex-wrap gap-2">
//                           <Tag
//                             icon={<BuildOutlined />}
//                             className="px-3 py-1 rounded-full border-0 bg-primary-green-light text-primary-green font-medium"
//                           >
//                             {job.company}
//                           </Tag>
//                           <Tag
//                             icon={<CalendarOutlined />}
//                             className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium"
//                           >
//                             {job.datePosted}
//                           </Tag>
//                           <Tag
//                             icon={<EnvironmentOutlined />}
//                             className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium"
//                           >
//                             {job.location}
//                           </Tag>
//                           <Tag
//                             icon={<FileTextOutlined />}
//                             className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium"
//                           >
//                             {job.jobType}
//                           </Tag>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="bg-white rounded-xl shadow-sm p-16 text-center">
//                   <p className="text-lg text-gray-600 mb-2">No jobs found matching your search criteria.</p>
//                   <p className="text-gray-500">Try adjusting your filters or search terms.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Modal for applying */}
//         <Modal
//           title={selectedJob ? `Apply for ${selectedJob.title}` : "Apply"}
//           open={isModalOpen}
//           onCancel={handleCancel}
//           footer={null}
//           width={600}
//         >
//           <ApplicationForm onSubmit={handleApplicationSubmit} />
//         </Modal>
//       </div>
//     </div>
//   );
// }





"use client";

import { useState } from "react";
import { Input, Modal, message, Checkbox, Radio, Select, Button, Tag } from "antd";
import { SearchOutlined, FilterOutlined, CalendarOutlined, EnvironmentOutlined, BuildOutlined, ClearOutlined, DownOutlined, FileTextOutlined, AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import ApplicationForm from "@/components/ApplicationForm";

// Placeholder jobs data with dates and job types
const initialJobs = [
  { id: "1", title: "Frontend Developer", company: "ABC Corp", location: "Mogadishu", status: "Open", datePosted: "Yesterday", jobType: "Full-time", category: "Technology", careerLevel: "Mid Level" },
  { id: "2", title: "Backend Developer", company: "XYZ Ltd", location: "Hargeisa", status: "Open", datePosted: "2 days ago", jobType: "Part-time", category: "Technology", careerLevel: "Senior Level" },
  { id: "3", title: "UI/UX Designer", company: "Tech Solutions", location: "Hargeisa", status: "Open", datePosted: "Yesterday", jobType: "Contract", category: "Technology", careerLevel: "Mid Level" },
  { id: "4", title: "Full Stack Developer", company: "Digital Innovations", location: "Mogadishu", status: "Open", datePosted: "3 days ago", jobType: "Full-time", category: "Technology", careerLevel: "Senior Level" },
  { id: "5", title: "DevOps Engineer", company: "Cloud Systems", location: "Mogadishu", status: "Open", datePosted: "Yesterday", jobType: "Full-time", category: "Technology", careerLevel: "Mid Level" },
  { id: "6", title: "Data Scientist", company: "AI Analytics", location: "Hargeisa", status: "Closed", datePosted: "5 days ago", jobType: "Part-time", category: "Technology", careerLevel: "Senior Level" },
  { id: "7", title: "Mobile App Developer", company: "Tech Innovations", location: "Mogadishu", status: "Open", datePosted: "Yesterday", jobType: "Contract", category: "Technology", careerLevel: "Entry Level" },
  { id: "8", title: "Software Engineer", company: "Digital Solutions", location: "Hargeisa", status: "Open", datePosted: "4 days ago", jobType: "Full-time", category: "Technology", careerLevel: "Mid Level" },
];

export default function JobsPage() {
  const [searchText, setSearchText] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<string>(""); // Single selection for date
  const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]); // Multiple selection for job type
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]); // Multiple selection for category
  const [careerLevelFilter, setCareerLevelFilter] = useState<string[]>([]); // Multiple selection for career level
  const [sortBy, setSortBy] = useState("newest");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    datePosted: false,
    locations: false,
    categories: false,
    jobType: false,
    careerLevel: false,
  });

  // Show apply modal
  const showModal = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  // Handle application submit
  const handleApplicationSubmit = (values: any) => {
    console.log("Application submitted:", values);
    if (selectedJob) {
      message.success(`Application submitted for ${selectedJob.title}`);
    }
    setIsModalOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchText("");
    setLocationFilter("");
    setDateFilter("");
    setJobTypeFilter([]);
    setCategoryFilter([]);
    setCareerLevelFilter([]);
  };

  const hasActiveFilters = searchText || locationFilter || dateFilter || jobTypeFilter.length > 0 || categoryFilter.length > 0 || careerLevelFilter.length > 0;

  const toggleFilter = (filterName: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Filter and sort jobs
  let filteredJobs = initialJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.company.toLowerCase().includes(searchText.toLowerCase()) ||
      job.location.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesJobType = jobTypeFilter.length === 0 || 
      jobTypeFilter.includes(job.jobType);
    
    const matchesCategory = categoryFilter.length === 0 || 
      categoryFilter.includes(job.category || "");
    
    const matchesCareerLevel = careerLevelFilter.length === 0 || 
      careerLevelFilter.includes(job.careerLevel || "");
    
    return matchesSearch && matchesLocation && matchesJobType && matchesCategory && matchesCareerLevel;
  });

  // Sort jobs
  if (sortBy === "newest") {
    filteredJobs = [...filteredJobs].sort((a, b) => {
      const dateA = a.datePosted.includes("Yesterday") ? 1 : parseInt(a.datePosted) || 0;
      const dateB = b.datePosted.includes("Yesterday") ? 1 : parseInt(b.datePosted) || 0;
      return dateA - dateB;
    });
  } else if (sortBy === "oldest") {
    filteredJobs = [...filteredJobs].sort((a, b) => {
      const dateA = a.datePosted.includes("Yesterday") ? 1 : parseInt(a.datePosted) || 0;
      const dateB = b.datePosted.includes("Yesterday") ? 1 : parseInt(b.datePosted) || 0;
      return dateB - dateA;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-150px)]">
          {/* Left Sidebar - Filters - Fixed (No Scroll) */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="space-y-4 h-full">
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

              {/* Categories Filter - Collapsible Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div
                  onClick={() => toggleFilter('categories')}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AppstoreOutlined className="text-gray-600" />
                    <span className="text-gray-800 font-semibold">Categories</span>
                  </div>
                  <DownOutlined 
                    className={`text-gray-600 transition-transform ${expandedFilters.categories ? 'rotate-180' : ''}`}
                  />
                </div>
                {expandedFilters.categories && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <Checkbox.Group
                      value={categoryFilter}
                      onChange={(values) => setCategoryFilter(values as string[])}
                      className="flex flex-col gap-3 w-full mt-3"
                    >
                      <Checkbox value="Technology" className="text-gray-700">Technology</Checkbox>
                      <Checkbox value="Management" className="text-gray-700">Management</Checkbox>
                      <Checkbox value="Sales" className="text-gray-700">Sales</Checkbox>
                      <Checkbox value="Marketing" className="text-gray-700">Marketing</Checkbox>
                    </Checkbox.Group>
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
                      onChange={(values) => setJobTypeFilter(values as string[])}
                      className="flex flex-col gap-3 w-full mt-3"
                    >
                      <Checkbox value="Full-time" className="text-gray-700">Full-time</Checkbox>
                      <Checkbox value="Part-time" className="text-gray-700">Part-time</Checkbox>
                      <Checkbox value="Contract" className="text-gray-700">Contract</Checkbox>
                      <Checkbox value="Internship" className="text-gray-700">Internship</Checkbox>
                    </Checkbox.Group>
                  </div>
                )}
              </div>

              {/* Career Level Filter - Collapsible Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div
                  onClick={() => toggleFilter('careerLevel')}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BarsOutlined className="text-gray-600" />
                    <span className="text-gray-800 font-semibold">Career level</span>
                  </div>
                  <DownOutlined 
                    className={`text-gray-600 transition-transform ${expandedFilters.careerLevel ? 'rotate-180' : ''}`}
                  />
                </div>
                {expandedFilters.careerLevel && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <Checkbox.Group
                      value={careerLevelFilter}
                      onChange={(values) => setCareerLevelFilter(values as string[])}
                      className="flex flex-col gap-3 w-full mt-3"
                    >
                      <Checkbox value="Entry Level" className="text-gray-700">Entry Level</Checkbox>
                      <Checkbox value="Mid Level" className="text-gray-700">Mid Level</Checkbox>
                      <Checkbox value="Senior Level" className="text-gray-700">Senior Level</Checkbox>
                      <Checkbox value="Executive" className="text-gray-700">Executive</Checkbox>
                    </Checkbox.Group>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <Button
                type="primary"
                icon={<SearchOutlined />}
                block
                size="large"
                onClick={() => {
                  // Filter logic is already applied via state changes
                  message.success("Filters applied");
                }}
                className="h-12 font-semibold rounded-lg bg-gradient-to-r from-primary-green to-primary-green-dark border-none hover:from-primary-green-dark hover:to-[#047857] shadow-md hover:shadow-lg transition-all"
              >
                Search
              </Button>
            </div>
          </aside>

          {/* Right Main Content - Scrollable Only This Section */}
          <div className="flex-1 min-w-0 overflow-hidden">
            {/* REMOVED pr-2 and added hide-scrollbar class */}
            <div className="h-full overflow-y-auto hide-scrollbar">
              {/* Header with Search and Sort */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Jobs</h1>
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
                  placeholder="Search by title, company or keywords"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              {/* Jobs List */}
              <div className="space-y-4 pb-6">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary-green"
                      onClick={() => showModal(job)}
                    >
                      <div className="flex gap-4">
                        {/* Company Logo Placeholder */}
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">
                            {job.company.charAt(0)}
                          </span>
                        </div>

                        {/* Job Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 hover:text-primary-green transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Tag
                              icon={<BuildOutlined />}
                              className="px-3 py-1 rounded-full border-0 bg-primary-green-light text-primary-green font-medium"
                            >
                              {job.company}
                            </Tag>
                            <Tag
                              icon={<CalendarOutlined />}
                              className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium"
                            >
                              {job.datePosted}
                            </Tag>
                            <Tag
                              icon={<EnvironmentOutlined />}
                              className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium"
                            >
                              {job.location}
                            </Tag>
                            <Tag
                              icon={<FileTextOutlined />}
                              className="px-3 py-1 rounded-full border-0 bg-gray-100 text-gray-700 font-medium"
                            >
                              {job.jobType}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                    <p className="text-lg text-gray-600 mb-2">No jobs found matching your search criteria.</p>
                    <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for applying */}
        <Modal
          title={selectedJob ? `Apply for ${selectedJob.title}` : "Apply"}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <ApplicationForm onSubmit={handleApplicationSubmit} />
        </Modal>
      </div>

      {/* Add this style tag to hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;      /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;              /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
}