import api from "./api";

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  jobType: JobType;
  location: string;
  salary?: string;
  deadline: string;
  isActive: boolean;
  employerId: number;
  createdAt: string;
  updatedAt: string;
  employer?: {
    id: number;
    fullName: string;
    email: string;
    role?: string;
    companyName?: string;
    companyLocation?: string;
    companyDescription?: string;
    companyWebsite?: string;
  };
}

export interface CreateJobDto {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  jobType: JobType;
  location: string;
  salary?: string;
  deadline: string;
  isActive?: boolean;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}

export interface SearchJobDto {
  query?: string;
  location?: string;
  jobType?: JobType;
}

// Get all jobs with optional search/filter parameters
export const getJobs = async (searchParams?: SearchJobDto): Promise<Job[]> => {
  const res = await api.get<Job[]>("/jobs", { params: searchParams });
  return res.data;
};

// Get a single job by ID
export const getJobById = async (id: number): Promise<Job> => {
  const res = await api.get<Job>(`/jobs/${id}`);
  return res.data;
};

// Create a new job (requires authentication)
export const createJob = async (job: CreateJobDto): Promise<Job> => {
  const res = await api.post<Job>("/jobs", job);
  return res.data;
};

// Update an existing job (requires authentication)
export const updateJob = async (id: number, job: UpdateJobDto): Promise<Job> => {
  const res = await api.patch<Job>(`/jobs/${id}`, job);
  return res.data;
};

// Delete a job (requires authentication)
export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`/jobs/${id}`);
};

// Track a job view
export const trackJobView = async (jobId: number): Promise<any> => {
  console.log(`[JobsService] Calling trackJobView for jobId: ${jobId}`);
  const res = await api.post(`/jobs/${jobId}/view`);
  console.log(`[JobsService] Track view response:`, res.data);
  return res.data;
};

// Get job views for employer
export const getJobViewsForEmployer = async (): Promise<{ jobId: number; viewCount: number }[]> => {
  const res = await api.get<{ jobId: number; viewCount: number }[]>("/jobs/views/employer");
  return res.data;
};

// Get job viewers (job seekers who viewed jobs) for employer
export interface JobViewer {
  id: number;
  jobId: number;
  jobTitle: string;
  viewerId: number | null;
  viewer: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
  } | null;
  viewedAt: string;
  viewCount?: number; // Number of times this job seeker viewed this job
}

export const getJobViewersForEmployer = async (): Promise<JobViewer[]> => {
  const res = await api.get<JobViewer[]>("/jobs/viewers/employer");
  return res.data;
};

// Get unique job seekers who viewed employer's jobs
export const getJobSeekersWhoViewedJobs = async (): Promise<any[]> => {
  const res = await api.get<any[]>("/jobs/viewed/jobseekers");
  return res.data;
};
