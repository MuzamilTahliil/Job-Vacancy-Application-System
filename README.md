# 🚀 Job Vacancy Management System

A comprehensive full-stack job vacancy management platform built with **Next.js**, **NestJS**, **PostgreSQL**, and **Prisma**. This system enables employers to post jobs, job seekers to browse and apply, and administrators to manage the entire platform.

![Tech Stack](https://img.shields.io/badge/Next.js-16.0.8-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red?style=for-the-badge&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
  - [Database Setup](#1-database-setup)
  - [Backend Setup](#2-backend-setup)
  - [Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Database Migrations](#-database-migrations)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 👥 Multi-Role System
- **Job Seekers**: Browse jobs, apply, view applications, manage profile
- **Employers**: Post jobs, manage applications, view job seekers, track job views
- **Admins**: Full system management, user management, job management

### 🎯 Core Functionality
- ✅ User authentication and authorization (JWT)
- ✅ Job posting and management
- ✅ Job application system
- ✅ Job seeker profile management
- ✅ Company information management
- ✅ Job view tracking
- ✅ Advanced filtering and search
- ✅ Responsive design with Ant Design
- ✅ Real-time data synchronization

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.0.8 (React 19.2.1)
- **UI Library**: Ant Design 6.1.0
- **Styling**: Tailwind CSS 3.4.18
- **HTTP Client**: Axios 1.13.2
- **Date Handling**: Day.js 1.11.19
- **Language**: TypeScript 5

### Backend
- **Framework**: NestJS 11.0.1
- **Database ORM**: Prisma 7.1.0
- **Database**: PostgreSQL
- **Authentication**: JWT (Passport)
- **API Documentation**: Swagger/OpenAPI
- **Language**: TypeScript 5.7.3

### Database
- **Database**: PostgreSQL
- **ORM**: Prisma Client
- **Migrations**: Prisma Migrate

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (v9.15.2+)
- **PostgreSQL** (v12 or higher)
- **Git**

---

## 📁 Project Structure

```
Job-Vacancy-Application-System/
├── backend/                 # NestJS Backend
│   ├── prisma/             # Prisma schema and migrations
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/    # Database migrations
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── users/      # User management
│   │   │   ├── jobs/       # Job management
│   │   │   ├── profiles/   # Job seeker profiles
│   │   │   └── applications/ # Job applications
│   │   ├── common/         # Shared utilities
│   │   └── main.ts         # Application entry point
│   └── package.json
│
├── frontend/                # Next.js Frontend
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   │   ├── admin/      # Admin pages
│   │   │   ├── employer/   # Employer pages
│   │   │   ├── seeker/     # Job seeker pages
│   │   │   └── jobs/       # Public job pages
│   │   ├── components/     # React components
│   │   └── services/       # API services
│   └── package.json
│
└── README.md               # This file
```

---

## 🚀 Installation & Setup

### 1. Database Setup

#### Install PostgreSQL

**Windows:**
- Download from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)
- Install and remember your password

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE job_vacancy_db;

# Exit psql
\q
```

#### Alternative: Use Prisma Cloud (Recommended for Development)

If you're using Prisma Cloud, you can skip local PostgreSQL setup. The connection string will be provided by Prisma.

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
# OR
pnpm install

# Copy environment file (if .env.example exists)
# Create .env file with your database URL and JWT secret

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
npx prisma db seed
```

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/job_vacancy_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=4000
NODE_ENV=development

# CORS (if needed)
CORS_ORIGIN="http://localhost:3000"
```

**Important**: Replace `username`, `password`, and `your-super-secret-jwt-key-change-this-in-production` with your actual values.

---

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# OR
pnpm install
```

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🔧 Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `PORT` | Backend server port | `4000` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend (`.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000/api` |

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend
npm run start:dev
# OR
pnpm start:dev
```

The backend will run on `http://localhost:4000`

**API Documentation**: `http://localhost:4000/api/docs` (Swagger UI)

### Start Frontend Server

Open a new terminal:

```bash
cd frontend
npm run dev
# OR
pnpm dev
```

The frontend will run on `http://localhost:3000`

---

## 🗄️ Database Migrations

### Create a New Migration

```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Apply Migrations

```bash
npx prisma migrate deploy
```

### Reset Database (⚠️ Warning: Deletes all data)

```bash
npx prisma migrate reset
```

### View Database (Prisma Studio)

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555`

### Generate Prisma Client

After schema changes:

```bash
npx prisma generate
```

---

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:4000/api/docs`
- **API Reference**: `http://localhost:4000/api/reference`

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Jobs
- `GET /api/jobs` - Get all jobs (public)
- `GET /api/jobs/:id` - Get job by ID (public)
- `POST /api/jobs` - Create job (authenticated)
- `PATCH /api/jobs/:id` - Update job (authenticated)
- `DELETE /api/jobs/:id` - Delete job (authenticated)
- `POST /api/jobs/:id/view` - Track job view (public)

#### Applications
- `GET /api/applications` - Get applications (authenticated)
- `POST /api/applications` - Create application (authenticated)
- `PATCH /api/applications/:id` - Update application status (authenticated)

#### Profiles
- `GET /api/profiles/me` - Get current user's profile
- `PATCH /api/profiles/me` - Update current user's profile

#### Users
- `GET /api/users/profile` - Get current user info
- `PATCH /api/users/profile` - Update current user info

---

## 👤 User Roles

### 🔵 Job Seeker (`JOB_SEEKER`)
- Browse and search jobs
- Apply for jobs
- View own applications
- Manage profile (bio, skills, experience, education)
- View job details

### 🟢 Employer (`EMPLOYER`)
- Post and manage jobs
- View applications for their jobs
- View job seekers who viewed their jobs
- Manage company information
- Track job views

### 🟡 Admin (`ADMIN`)
- Manage all users
- Manage all jobs
- View all applications
- Manage job seeker profiles
- Full system access

### 🔴 Super Admin (`SUPER_ADMIN`)
- All admin privileges
- Can manage other admins
- System configuration

---

## 🗃️ Database Schema

### Main Models

- **User**: User accounts with role-based access
- **Company**: Company information linked to employers
- **Job**: Job postings with details
- **Application**: Job applications
- **JobSeekerProfile**: Extended profile for job seekers
- **JobView**: Tracks job views by job seekers

### Relationships

- User → Company (One-to-Many)
- User → Jobs (One-to-Many)
- User → Applications (One-to-Many)
- User → JobSeekerProfile (One-to-One)
- Job → Applications (One-to-Many)
- Job → JobViews (One-to-Many)

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change PORT in .env or kill the process
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4000 | xargs kill
```

**Database connection error:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists
- Verify username/password

**Prisma Client not generated:**
```bash
cd backend
npx prisma generate
```

### Frontend Issues

**API connection error:**
- Verify backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Database Issues

**Migration conflicts:**
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or manually fix migrations
npx prisma migrate resolve --applied <migration_name>
```

**Schema out of sync:**
```bash
# Push schema changes without migration
npx prisma db push

# Or create new migration
npx prisma migrate dev --name fix_schema
```

---

## 📝 Development Commands

### Backend

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Database
npm run db:migrate      # Run migrations
npm run db:generate     # Generate Prisma Client
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database

# Code quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run test            # Run tests
```

### Frontend

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Code quality
npm run lint            # Run ESLint
```

---

## 🔐 Security Notes

- ⚠️ **Never commit `.env` files** to version control
- 🔑 Use strong `JWT_SECRET` in production
- 🔒 Use HTTPS in production
- 🛡️ Keep dependencies updated
- 🔐 Use environment-specific secrets

---

## 📄 License

This project is private and proprietary.

---

## 👨‍💻 Development Team

**SDG3 - SomNOG8 - Job Vacancy Application Management System**

---

## 🤝 Contributing

This is a private project. For contributions, please contact the development team.

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review API documentation at `/api/docs`
3. Check database schema in `backend/prisma/schema.prisma`

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js and PostgreSQL
- [ ] Clone the repository
- [ ] Set up PostgreSQL database
- [ ] Configure backend `.env` file
- [ ] Run `npm install` in `backend/`
- [ ] Run `npx prisma generate` and `npx prisma migrate dev`
- [ ] Configure frontend `.env.local` file
- [ ] Run `npm install` in `frontend/`
- [ ] Start backend: `npm run start:dev`
- [ ] Start frontend: `npm run dev`
- [ ] Open `http://localhost:3000`

---

**Happy Coding! 🚀**

