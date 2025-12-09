import api from "./api";

interface ApplicationData {
  jobId: string;
  name: string;
  email: string;
  coverLetter: string;
  resume: File;
}

export const getApplications = async (jobId: string) => {
  try {
    const res = await api.get(`/applications/${jobId}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch applications" };
  }
};

export const applyJob = async (data: ApplicationData) => {
  try {
    const formData = new FormData();
    formData.append("jobId", data.jobId);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("coverLetter", data.coverLetter);
    formData.append("resume", data.resume);

    const res = await api.post("/applications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to apply job" };
  }
};
