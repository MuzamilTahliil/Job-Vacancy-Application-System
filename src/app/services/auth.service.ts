import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "seeker" | "employer";
}

export const login = async (data: LoginData) => {
  try {
    const res = await api.post("/auth/login", data);
    const token = res.data.token;
    localStorage.setItem("token", token);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const register = async (data: RegisterData) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
