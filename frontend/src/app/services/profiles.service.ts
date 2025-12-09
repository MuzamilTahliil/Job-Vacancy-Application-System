import api from "./api";

export interface JobSeekerProfile {
  id: number;
  bio?: string;
  skills: string[];
  experience?: string;
  education?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface UpdateProfileDto {
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

// Get current user's profile
export const getMyProfile = async (): Promise<JobSeekerProfile> => {
  const res = await api.get<JobSeekerProfile>("/profiles/me");
  return res.data;
};

// Update current user's profile
export const updateMyProfile = async (data: UpdateProfileDto): Promise<JobSeekerProfile> => {
  const res = await api.patch<JobSeekerProfile>("/profiles/me", data);
  return res.data;
};

