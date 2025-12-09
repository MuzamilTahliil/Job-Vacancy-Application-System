import api from "./api";

interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
}

export const getJobs = async () => {
  try {
    const res = await api.get("/jobs");
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch jobs" };
  }
};

export const postJob = async (job: Job) => {
  try {
    const res = await api.post("/jobs", job);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to create job" };
  }
};

export const getJobById = async (id: string) => {
  try {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch job" };
  }
};
