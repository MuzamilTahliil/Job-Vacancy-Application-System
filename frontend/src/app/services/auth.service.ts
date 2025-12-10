import api from "./api";

export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYER = "EMPLOYER",
  JOB_SEEKER = "JOB_SEEKER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  companyName?: string;
}

export interface AuthResponse {
  access_token: string;
  expires_at?: string | null;
  user: {
    id: number;
    email: string;
    fullName?: string;
    name?: string; // Backend returns 'name' in login response
    role: UserRole;
    companyName?: string;
  };
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  const { access_token, user } = res.data;
  
  if (typeof window !== "undefined") {
    localStorage.setItem("token", access_token);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id.toString());
  }
  
  return res.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register", data);
  const { access_token, user } = res.data;
  
  if (typeof window !== "undefined") {
    localStorage.setItem("token", access_token);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userId", user.id.toString());
  }
  
  return res.data;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  }
};

export const getCurrentUser = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};
