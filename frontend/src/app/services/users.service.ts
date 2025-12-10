import api from "./api";
import { UserRole } from "./auth.service";

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  companyName?: string | null;
  companyLocation?: string | null;
  companyDescription?: string | null;
  companyWebsite?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  companyName?: string;
  companyLocation?: string;
  companyDescription?: string;
  companyWebsite?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

// Get all users (Admin only)
export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>("/users");
  return res.data;
};

// Get a single user by ID
export const getUserById = async (id: number): Promise<User> => {
  const res = await api.get<User>(`/users/${id}`);
  return res.data;
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get<User>("/users/profile");
  return res.data;
};

// Update current user profile
export const updateCurrentUserProfile = async (user: UpdateUserDto): Promise<User> => {
  const res = await api.patch<User>("/users/profile", user);
  return res.data;
};

// Create a new user (Admin only)
export const createUser = async (user: CreateUserDto): Promise<User> => {
  const res = await api.post<User>("/users", user);
  return res.data;
};

// Update a user
export const updateUser = async (id: number, user: UpdateUserDto): Promise<User> => {
  const res = await api.patch<User>(`/users/${id}`, user);
  return res.data;
};

// Delete a user (Admin only)
export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

