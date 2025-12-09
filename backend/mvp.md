# Job Vacancy Application System

**Group:** SDG3  
**Team Members:**

| No  | Full Name                | Role           |
| --- | ------------------------ | -------------- |
| 1   | Mohamed Abdirizak Bashir | Technical Lead |
| 2   | Nasra Mohamed Abukar     | Frontend       |
| 3   | Xamdi Cumar Cali         | Backend        |
| 4   | Musab Ali                | DevOps         |
| 5   | Muzamil Tahlil Dahir     | FullStack      |

---

## Project Overview

The Job Vacancy Application System connects job seekers with employers by allowing companies to post job openings and candidates to apply online. This system supports SDG 8 (Decent Work and Economic Growth) by facilitating employment opportunities and reducing unemployment.

---

## MVP Feature List

1. **User Authentication** - Job seekers and employers can register and log in with different roles
2. **Job Posting Management** - Employers can create, view, and manage job postings
3. **Job Application Submission** - Job seekers can browse jobs and submit applications
4. **Application Tracking** - Both employers and job seekers can track application status

---

## High-Level Architecture

```
Next.js Frontend (Job Listings & Application Forms)
    ↓
NestJS REST API (Controllers)
    ↓
Service Layer (Business Logic)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

**Data Flow Example:**

1. Employer creates job posting via Next.js form
2. POST request to `/api/jobs` with job details
3. NestJS Controller → Service validates → Prisma creates Job record
4. Job seeker views job listing
5. Job seeker submits application → POST to `/api/applications`
6. Employer reviews applications in dashboard

---

## Database Design (Entities)

### Core Entities:

1. **User** - Stores user accounts (job seekers and employers)
2. **Job** - Stores job postings
3. **Application** - Stores job applications
4. **JobSeekerProfile** - Stores job seeker details and resume info

### Relationships:

- User (1) → (Many) Job (employer posts multiple jobs)
- User (1) → (1) JobSeekerProfile
- User (1) → (Many) Application (job seeker applies to multiple jobs)
- Job (1) → (Many) Application

---

## Prisma Schema Code

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  JOB_SEEKER
  EMPLOYER
  ADMIN
}

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
}

enum ApplicationStatus {
  PENDING
  REVIEWED
  SHORTLISTED
  REJECTED
  ACCEPTED
}

model User {
  id                String              @id @default(uuid())
  email             String              @unique
  password          String
  fullName          String
  phoneNumber       String?
  role              UserRole            @default(JOB_SEEKER)
  companyName       String?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  jobs              Job[]
  applications      Application[]
  jobSeekerProfile  JobSeekerProfile?

  @@map("users")
}

model Job {
  id                String        @id @default(uuid())
  title             String
  description       String
  requirements      String
  responsibilities  String
  jobType           JobType
  location          String
  salary            String?
  deadline          DateTime
  isActive          Boolean       @default(true)

  employerId        String
  employer          User          @relation(fields: [employerId], references: [id], onDelete: Cascade)

  applications      Application[]

  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  @@map("jobs")
}

model Application {
  id                String              @id @default(uuid())
  coverLetter       String
  resumeUrl         String?
  status            ApplicationStatus   @default(PENDING)
  appliedAt         DateTime            @default(now())
  reviewedAt        DateTime?
  notes             String?

  jobId             String
  job               Job                 @relation(fields: [jobId], references: [id], onDelete: Cascade)

  applicantId       String
  applicant         User                @relation(fields: [applicantId], references: [id], onDelete: Cascade)

  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  @@unique([jobId, applicantId])
  @@map("applications")
}

model JobSeekerProfile {
  id                String    @id @default(uuid())
  bio               String?
  skills            String[]
  experience        String?
  education         String?
  resumeUrl         String?
  linkedinUrl       String?
  portfolioUrl      String?

  userId            String    @unique
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@map("job_seeker_profiles")
}
```

---

## Current Implementation Status

| Module | Status | Implemented Features | Missing Features |
| :--- | :--- | :--- | :--- |
| **Auth** | ✅ In Progress | Register, Login, JWT Guards | Logout, Password Reset |
| **Jobs** | ⚠️ Partial | Create, Read, Update, Delete | Search Filters, Pagination, Strict Permissions |
| **Users** | ✅ Implemented | Full CRUD, Role checks | Admin features |
| **Applications** | ✅ Implemented | Submit, List (My/Job), Status | File Uploads (Resume) |
| **Profiles** | ✅ Implemented | Upsert Profile (Bio, Skills, URLs) | File Uploads, Education details expansion |

---

## Remaining MVP Work Checklist

### **High Priority (Must Have)**

- [ ] **Applications Module**
  - [ ] Generate module, controller, service
  - [ ] Implement `POST /applications` (Job Seeker)
  - [ ] Implement `GET /applications` (Employer & Job Seeker logic)
  - [ ] Implement `PATCH /applications/:id/status` (Employer)
  - [ ] DTOs: `CreateApplicationDto`, `UpdateApplicationStatusDto`

- [ ] **Profiles Module**
  - [ ] Generate module, controller, service
  - [ ] Implement `GET /profiles/me` and `PATCH /profiles/me`
  - [ ] DTOs: `CreateProfileDto`, `UpdateProfileDto`

- [ ] **File Uploads (Cloudinary/S3/Local)**
  - [ ] For Resumes (Applications & Profiles)
  - [ ] For Company Logos (Optional for MVP but good to have)

### **Medium Priority**

- [ ] **Job Search & Filtering**
  - [ ] Filter by JobType, Location, etc.
- [ ] **Validation & Error Handling**
  - [ ] Standardize error responses (HttpExceptionFilter)
  - [ ] Strict DTO validation

---

## API Documentation

### **Authentication** (`/auth`)

#### 1. Register User
- **Endpoint:** `POST /auth/register`
- **Access:** Public
- **Body:**
  ```json
  {
    "fullName": "John Doe",
    "email": "user@example.com",
    "password": "password123",
    "role": "JOB_SEEKER" // Optional: "EMPLOYER" | "JOB_SEEKER" (default)
  }
  ```
- **Response:** User object (without password) or JWT token.

#### 2. Login User
- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```

---

### **Jobs** (`/jobs`)

#### 1. Create Job (Employer Only)
- **Endpoint:** `POST /jobs`
- **Access:** Protected (Employer)
- **Body:**
  ```json
  {
    "title": "Software Engineer",
    "description": "Develop awesome apps.",
    "requirements": "Node.js, NestJS, React",
    "responsibilities": "Write clean code.",
    "location": "Remote",
    "jobType": "FULL_TIME", // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
    "salary": "$100,000 - $120,000", // Optional
    "deadline": "2025-12-31T00:00:00.000Z",
    "isActive": true // Optional, default true
  }
  ```

#### 2. Get All Jobs
- **Endpoint:** `GET /jobs`
- **Access:** Public
- **Query Params (Planned):** `?search=term&location=city&type=FULL_TIME`
- **Response:** Array of Job objects.

#### 3. Get Job Details
- **Endpoint:** `GET /jobs/:id`
- **Access:** Public
- **Response:** Job object with Employer details.

#### 4. Update Job (Employer Only)
- **Endpoint:** `PATCH /jobs/:id`
- **Access:** Protected (Owner)
- **Body:** Partial `CreateJobDto`

#### 5. Delete Job (Employer Only)
- **Endpoint:** `DELETE /jobs/:id`
- **Access:** Protected (Owner)

---

### **Applications** (`/applications`) [Planned]

#### 1. Submit Application
- **Endpoint:** `POST /applications`
- **Access:** Protected (Job Seeker)
- **Body:**
  ```json
  {
    "jobId": "uuid-of-job",
    "coverLetter": "I am the best fit...",
    "resumeUrl": "https://url-to-resume.pdf" // Optional if using profile resume
  }
  ```

#### 2. Get Applications
- **Endpoint:** `GET /applications`
- **Access:** Protected
- **Behavior:**
  - **Job Seeker:** Returns applications made by the user.
  - **Employer:** Returns applications received for their jobs.

#### 3. Update Application Status
- **Endpoint:** `PATCH /applications/:id/status`
- **Access:** Protected (Employer)
- **Body:**
  ```json
  {
    "status": "SHORTLISTED" // PENDING, REVIEWED, SHORTLISTED, REJECTED, ACCEPTED
  }
  ```

---

### **Profiles** (`/profiles`) [Planned]

#### 1. Get My Profile
- **Endpoint:** `GET /profiles/me`
- **Access:** Protected (Job Seeker)

#### 2. Update/Create Profile
- **Endpoint:** `PATCH /profiles/me`
- **Access:** Protected (Job Seeker)
- **Body:**
  ```json
  {
    "bio": "Experienced developer...",
    "skills": ["Node.js", "React"],
    "experience": "5 years...",
    "education": "BS CS...",
    "resumeUrl": "...",
    "linkedinUrl": "...",
    "portfolioUrl": "..."
  }
  ```
