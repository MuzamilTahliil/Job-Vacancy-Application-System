import api from "./api";

export enum ApplicationStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  SHORTLISTED = "SHORTLISTED",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
}

export interface Application {
  id: number;
  coverLetter: string;
  resumeUrl?: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string | null;
  notes?: string | null;
  jobId: number;
  applicantId: number;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: number;
    title: string;
    location: string;
    jobType: string;
  };
  applicant?: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string | null;
  };
  job?: {
    id: number;
    title: string;
    location: string;
    jobType: string;
    employerId?: number;
    employer?: {
      id: number;
      fullName: string;
      email: string;
      role?: string;
    };
  };
}

export interface CreateApplicationDto {
  jobId: number;
  coverLetter: string;
  resumeUrl?: string;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
}

// Get all applications for current user's jobs (admin/employer) or applications submitted by user (job seeker)
export const getApplications = async (): Promise<Application[]> => {
  const res = await api.get<Application[]>("/applications");
  return res.data;
};

// Get applications for a specific job
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

// Update application status
export const updateApplicationStatus = async (
  id: number,
  status: ApplicationStatus
): Promise<Application> => {
  const res = await api.patch<Application>(`/applications/${id}/status`, { status });
  return res.data;
};
