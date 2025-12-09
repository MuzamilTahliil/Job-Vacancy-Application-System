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
    companyName?: string;
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
