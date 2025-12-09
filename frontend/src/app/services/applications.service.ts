import api from "./api";

export enum ApplicationStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  SHORTLISTED = "SHORTLISTED",
}

export interface Application {
  id: number;
  coverLetter: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string;
  notes?: string;
  jobId: number;
  applicantId: number;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: number;
    title: string;
    location: string;
    employerId: number;
  };
  applicant?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface CreateApplicationDto {
  jobId: number;
  coverLetter: string;
  resumeUrl?: string;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
  notes?: string;
}

// Get all applications for the current user
export const getMyApplications = async (): Promise<Application[]> => {
  const res = await api.get<Application[]>("/applications");
  return res.data;
};

// Get all applications for a specific job (Employer only)
export const getJobApplications = async (jobId: number): Promise<Application[]> => {
  const res = await api.get<Application[]>(`/applications/job/${jobId}`);
  return res.data;
};

// Get a single application by ID
export const getApplicationById = async (id: number): Promise<Application> => {
  const res = await api.get<Application>(`/applications/${id}`);
  return res.data;
};

// Create a new application
export const createApplication = async (data: CreateApplicationDto): Promise<Application> => {
  const res = await api.post<Application>("/applications", data);
  return res.data;
};

// Update application status (Employer only)
export const updateApplicationStatus = async (
  id: number,
  data: UpdateApplicationStatusDto
): Promise<Application> => {
  const res = await api.patch<Application>(`/applications/${id}/status`, data);
  return res.data;
};

