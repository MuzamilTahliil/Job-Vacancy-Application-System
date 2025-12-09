# API Integration Guide

This guide explains how the frontend is connected to the NestJS backend.

## Configuration

### Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

The default API URL is `http://localhost:4000/api` if the environment variable is not set.

### Backend Setup

Make sure your NestJS backend is running on port 4000 (or update the URL accordingly).

## Available Services

All services are located in `src/app/services/`:

### 1. **API Client** (`api.ts`)
- Base axios instance with authentication interceptors
- Automatic token attachment from localStorage
- Error handling with user-friendly messages
- CORS support

### 2. **Auth Service** (`auth.service.ts`)
- `login(data: LoginData)` - User login
- `register(data: RegisterData)` - User registration
- `logout()` - Clear authentication data
- `getCurrentUser()` - Get current user profile

**Example:**
```typescript
import { login, register, UserRole } from "@/app/services/auth.service";

// Login
const response = await login({ email: "user@example.com", password: "password123" });

// Register
const response = await register({
  fullName: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: UserRole.JOB_SEEKER
});
```

### 3. **Jobs Service** (`jobs.service.ts`)
- `getJobs(searchParams?)` - Get all jobs with optional filters
- `getJobById(id)` - Get single job
- `createJob(job)` - Create new job (requires auth)
- `updateJob(id, job)` - Update job (requires auth)
- `deleteJob(id)` - Delete job (requires auth)

**Example:**
```typescript
import { getJobs, createJob, JobType } from "@/app/services/jobs.service";

// Get all jobs
const jobs = await getJobs();

// Get jobs with filters
const filteredJobs = await getJobs({
  query: "developer",
  location: "Mogadishu",
  jobType: JobType.FULL_TIME
});

// Create job
const newJob = await createJob({
  title: "Software Engineer",
  description: "Job description...",
  requirements: "Requirements...",
  responsibilities: "Responsibilities...",
  jobType: JobType.FULL_TIME,
  location: "Mogadishu",
  salary: "$50,000 - $70,000",
  deadline: "2024-12-31T00:00:00.000Z",
  isActive: true
});
```

### 4. **Users Service** (`users.service.ts`)
- `getUsers()` - Get all users (Admin only)
- `getUserById(id)` - Get single user
- `getCurrentUser()` - Get current user profile
- `createUser(user)` - Create user (Admin only)
- `updateUser(id, user)` - Update user
- `deleteUser(id)` - Delete user (Admin only)

### 5. **Applications Service** (`applications.service.ts`)
- `getMyApplications()` - Get current user's applications
- `getJobApplications(jobId)` - Get applications for a job (Employer only)
- `getApplicationById(id)` - Get single application
- `createApplication(data)` - Create new application
- `updateApplicationStatus(id, data)` - Update application status (Employer only)

**Example:**
```typescript
import { createApplication, ApplicationStatus } from "@/app/services/applications.service";

// Apply for a job
const application = await createApplication({
  jobId: 1,
  coverLetter: "I am interested in this position...",
  resumeUrl: "https://example.com/resume.pdf" // Optional
});

// Update application status (Employer)
await updateApplicationStatus(applicationId, {
  status: ApplicationStatus.ACCEPTED,
  notes: "Great candidate!"
});
```

### 6. **Profiles Service** (`profiles.service.ts`)
- `getMyProfile()` - Get current user's profile
- `updateMyProfile(data)` - Update current user's profile

## Integration Example

Here's how to replace mock data with API calls in a component:

### Before (Mock Data):
```typescript
const [jobs, setJobs] = useState(mockJobs);

useEffect(() => {
  // No data fetching
}, []);
```

### After (API Integration):
```typescript
import { useState, useEffect } from "react";
import { getJobs, createJob, updateJob, deleteJob, Job, JobType } from "@/app/services/jobs.service";
import { message } from "antd";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      message.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      await createJob({
        ...values,
        deadline: values.deadline.toISOString(),
      });
      message.success("Job created successfully!");
      fetchJobs(); // Refresh the list
    } catch (error) {
      message.error("Failed to create job");
    }
  };

  const handleUpdate = async (id: number, values: any) => {
    try {
      await updateJob(id, {
        ...values,
        deadline: values.deadline.toISOString(),
      });
      message.success("Job updated successfully!");
      fetchJobs(); // Refresh the list
    } catch (error) {
      message.error("Failed to update job");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id);
      message.success("Job deleted successfully!");
      fetchJobs(); // Refresh the list
    } catch (error) {
      message.error("Failed to delete job");
    }
  };

  return (
    // Your component JSX
  );
}
```

## Data Type Mappings

### Job Types
- `FULL_TIME` - Full-time position
- `PART_TIME` - Part-time position
- `CONTRACT` - Contract position
- `INTERNSHIP` - Internship position

### User Roles
- `ADMIN` - Administrator
- `EMPLOYER` - Employer/Company
- `JOB_SEEKER` - Job Seeker
- `SUPER_ADMIN` - Super Administrator

### Application Status
- `PENDING` - Pending review
- `REVIEWED` - Under review
- `ACCEPTED` - Accepted
- `REJECTED` - Rejected
- `SHORTLISTED` - Shortlisted

## Error Handling

The API client automatically handles common errors:
- **401 Unauthorized**: Clears token and shows login message
- **403 Forbidden**: Shows permission error
- **404 Not Found**: Shows resource not found error
- **500+ Server Errors**: Shows server error message
- **Network Errors**: Shows connection error

All errors are displayed using Ant Design's `message` component.

## Authentication

Tokens are automatically attached to requests via the axios interceptor. The token is stored in `localStorage` and retrieved on each request.

To check if a user is authenticated:
```typescript
const token = localStorage.getItem("token");
const isAuthenticated = !!token;
```

## Next Steps

1. Replace mock data in all admin pages with API calls
2. Replace mock data in employer pages with API calls
3. Update login/register pages to use the auth service
4. Add loading states and error handling
5. Implement proper TypeScript types matching backend DTOs

