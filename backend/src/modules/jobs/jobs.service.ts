import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchJobDto } from './dto/search-job.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createJobDto: CreateJobDto) {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { company: true },
      });
      
      // Check if employer exists
      if (!user) {
          throw new NotFoundException('User not found');
      }

      // Allow posting jobs - company is optional (can be added later)
      // No need to check for company existence

      // Convert deadline string to DateTime if it's not already
      let deadlineDate: Date;
      if (typeof createJobDto.deadline === 'string') {
        // Parse the date string (could be 'YYYY-MM-DD' or ISO string)
        // If it's just a date (YYYY-MM-DD), add time to make it a valid DateTime
        const dateStr = createJobDto.deadline.trim();
        deadlineDate = new Date(dateStr);
        
        // Check if date is valid
        if (isNaN(deadlineDate.getTime())) {
          throw new BadRequestException('Invalid deadline date format. Please use YYYY-MM-DD format.');
        }
        
        // Ensure we have a valid DateTime (set to end of day if only date provided)
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          deadlineDate.setHours(23, 59, 59, 999);
        }
      } else {
        deadlineDate = createJobDto.deadline;
      }

      // Create job data with proper deadline format
      const jobData = {
        title: createJobDto.title.trim(),
        description: createJobDto.description.trim(),
        requirements: createJobDto.requirements.trim(),
        responsibilities: createJobDto.responsibilities.trim(),
        jobType: createJobDto.jobType,
        location: createJobDto.location.trim(),
        salary: createJobDto.salary?.trim() || null,
        deadline: deadlineDate,
        isActive: createJobDto.isActive !== undefined ? createJobDto.isActive : true,
        employerId: userId,
      };

      const createdJob = await this.prisma.job.create({
        data: jobData,
        include: { 
          employer: { 
            select: { 
                id: true,
                fullName: true, 
                email: true,
                role: true,
                company: { select: { name: true } }
            } 
          } 
        },
      });

      // Transform to include companyName
      const { employer, ...rest } = createdJob;
      return {
        ...rest,
        employer: {
          id: employer.id,
          fullName: employer.fullName,
          email: employer.email,
          role: employer.role,
          companyName: employer.company?.name || null,
        },
      };
    } catch (error) {
      console.error('Error creating job:', error);
      // Re-throw known exceptions
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      // For unknown errors, log and throw a more descriptive error
      console.error('Unexpected error creating job:', error);
      throw new BadRequestException(
        error instanceof Error ? `Failed to create job: ${error.message}` : 'Failed to create job. Please check all fields are valid.'
      );
    }
  }

  async findAll(query?: SearchJobDto) {
    const { query: searchQuery, location, jobType } = query || {};

    const where: any = {};
    // For admin, don't filter by isActive - show all jobs

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    if (location) {
        where.location = { contains: location, mode: 'insensitive' };
    }

    if (jobType) {
        where.jobType = jobType;
    }

    const jobs = await this.prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        employer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            company: {
                select: { name: true }
            }
          },
        },
      },
    });

    // Transform to include companyName from company relation and employer role
    return jobs.map((job) => {
      const { employer, ...rest } = job;
      return {
        ...rest,
        employer: {
          id: employer.id,
          fullName: employer.fullName,
          email: employer.email,
          role: employer.role,
          companyName: employer.company?.name || null,
        },
      };
    });
  }

  async findOne(id: number) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        employer: { 
            select: { 
                id: true,
                fullName: true, 
                email: true,
                role: true,
                company: { 
                  select: { 
                    name: true,
                    location: true,
                    description: true,
                    website: true
                  } 
                }
            } 
        },
        applications: {
          select: { id: true },
        },
      },
    });
    if (!job) throw new NotFoundException('Job not found');
    
    const { employer, ...rest } = job;
    return {
      ...rest,
      employer: {
        id: employer.id,
        fullName: employer.fullName,
        email: employer.email,
        role: employer.role,
        companyName: employer.company?.name || null,
        companyLocation: employer.company?.location || null,
        companyDescription: employer.company?.description || null,
        companyWebsite: employer.company?.website || null,
      },
    };
  }

  async update(userId: number, id: number, updateJobDto: UpdateJobDto) {
    const job = await this.findOne(id);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Admins can only update jobs created by admins
    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      const jobEmployer = await this.prisma.user.findUnique({ 
        where: { id: job.employerId },
        select: { role: true }
      });
      
      if (jobEmployer?.role !== UserRole.ADMIN && jobEmployer?.role !== UserRole.SUPER_ADMIN) {
        throw new ForbiddenException('Admins can only edit jobs created by other admins');
      }
    } else {
      // Employers can only update their own jobs
      if (job.employerId !== userId) {
        throw new ForbiddenException('You can only edit jobs posted by your company');
      }
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: updateJobDto,
      include: {
        employer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            company: {
              select: { name: true }
            }
          },
        },
      },
    });

    return {
      ...updated,
      employer: {
        id: updated.employer.id,
        fullName: updated.employer.fullName,
        email: updated.employer.email,
        role: updated.employer.role,
        companyName: updated.employer.company?.name || null,
      },
    };
  }

  async remove(userId: number, id: number) {
    const job = await this.findOne(id);

    if (job.employerId !== userId) {
      throw new ForbiddenException('You can only delete jobs posted by your company');
    }

    return this.prisma.job.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async trackView(jobId: number, viewerId: number | null) {
    console.log(`[JobsService] Tracking view for jobId: ${jobId}, viewerId: ${viewerId}`);
    
    // Check if job exists
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      console.log(`[JobsService] Job not found: ${jobId}`);
      throw new NotFoundException('Job not found');
    }

    try {
      // Record the view - viewerId can be null for anonymous views
      const view = await this.prisma.jobView.create({
        data: {
          jobId,
          viewerId: viewerId || null, // Explicitly set to null if undefined
        },
      });
      console.log(`[JobsService] View recorded successfully: ${view.id} for jobId: ${jobId}, viewerId: ${viewerId || 'anonymous'}`);
      return { success: true, viewId: view.id };
    } catch (error: any) {
      console.error(`[JobsService] Error creating view:`, error);
      console.error(`[JobsService] Error details:`, {
        message: error.message,
        code: error.code,
        meta: error.meta,
        jobId,
        viewerId,
      });
      
      // Re-throw with more context
      throw error;
    }
  }

  async getJobViews(jobId: number) {
    return this.prisma.jobView.count({
      where: { jobId },
    });
  }

  async getJobViewsForEmployer(employerId: number) {
    // Get all jobs for this employer
    const jobs = await this.prisma.job.findMany({
      where: { employerId },
      select: { id: true },
    });

    const jobIds = jobs.map(j => j.id);

    if (jobIds.length === 0) {
      return [];
    }

    // Get view counts for each job - only count logged-in job seekers (viewerId is not null)
    const views = await this.prisma.jobView.groupBy({
      by: ['jobId'],
      where: {
        jobId: { in: jobIds },
        viewerId: { not: null }, // Only count logged-in job seekers who clicked/visited
      },
      _count: {
        id: true,
      },
    });

    return views.map(v => ({
      jobId: v.jobId,
      viewCount: v._count.id,
    }));
  }

  async getJobViewersForEmployer(employerId: number) {
    // Get all jobs for this employer
    const jobs = await this.prisma.job.findMany({
      where: { employerId },
      select: { id: true, title: true },
    });

    const jobIds = jobs.map(j => j.id);

    if (jobIds.length === 0) {
      return [];
    }

    // Get all views with viewer information for employer's jobs (only logged-in viewers)
    const allViews = await this.prisma.jobView.findMany({
      where: {
        jobId: { in: jobIds },
        viewerId: { not: null }, // Only logged-in viewers (job seekers)
      },
      include: {
        viewer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        viewedAt: 'desc',
      },
    });

    // Group by jobId and viewerId to get unique combinations (no duplicates)
    // Use a Map to track unique job seeker + job combinations
    const uniqueViewers = new Map<string, {
      id: number;
      jobId: number;
      jobTitle: string;
      viewerId: number;
      viewer: {
        id: number;
        fullName: string;
        email: string;
        phoneNumber: string | null;
      };
      viewedAt: Date;
      viewCount: number; // How many times this job seeker viewed this job
    }>();

    allViews.forEach(v => {
      if (!v.viewer) return; // Skip if no viewer (shouldn't happen due to filter, but safety check)
      
      // Create a unique key: jobId_viewerId
      const uniqueKey = `${v.jobId}_${v.viewerId}`;
      
      if (!uniqueViewers.has(uniqueKey)) {
        // First time seeing this combination - add it
        uniqueViewers.set(uniqueKey, {
          id: v.id, // Use the most recent view ID
          jobId: v.jobId,
          jobTitle: v.job.title,
          viewerId: v.viewerId!,
          viewer: {
            id: v.viewer.id,
            fullName: v.viewer.fullName,
            email: v.viewer.email,
            phoneNumber: v.viewer.phoneNumber,
          },
          viewedAt: v.viewedAt,
          viewCount: 1,
        });
      } else {
        // Already exists - update to most recent view time and increment count
        const existing = uniqueViewers.get(uniqueKey)!;
        if (v.viewedAt > existing.viewedAt) {
          existing.viewedAt = v.viewedAt;
          existing.id = v.id; // Update to most recent view ID
        }
        existing.viewCount += 1;
      }
    });

    // Convert Map to array and return
    return Array.from(uniqueViewers.values()).map(v => ({
      id: v.id,
      jobId: v.jobId,
      jobTitle: v.jobTitle,
      viewerId: v.viewerId,
      viewer: v.viewer,
      viewedAt: v.viewedAt,
      viewCount: v.viewCount, // Include view count
    }));
  }

  async getJobSeekersWhoViewedJobs(employerId: number) {
    console.log(`[JobsService] Getting job seekers who viewed jobs for employer: ${employerId}`);
    
    // Get all jobs for this employer
    const jobs = await this.prisma.job.findMany({
      where: { employerId },
      select: { id: true },
    });
    
    console.log(`[JobsService] Found ${jobs.length} jobs for employer ${employerId}`);

    const jobIds = jobs.map(j => j.id);

    if (jobIds.length === 0) {
      return [];
    }

    // Get unique job seekers who viewed employer's jobs (only logged-in viewers)
    const views = await this.prisma.jobView.findMany({
      where: {
        jobId: { in: jobIds },
        viewerId: { not: null }, // Only logged-in viewers (job seekers)
      },
      include: {
        viewer: {
          include: {
            jobSeekerProfile: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        viewedAt: 'desc',
      },
    });

    // Get unique job seekers (no duplicates by viewerId) and track which jobs they viewed
    const uniqueJobSeekers = new Map<number, {
      userId: number;
      user: {
        id: number;
        fullName: string;
        email: string;
        phoneNumber: string | null;
      };
      profile: {
        id: number;
        bio: string | null;
        skills: string[];
        experience: string | null;
        education: string | null;
        resumeUrl: string | null;
        linkedinUrl: string | null;
        portfolioUrl: string | null;
      } | null;
      viewedJobs: Array<{ jobId: number; jobTitle: string; viewedAt: Date }>;
    }>();

    views.forEach(v => {
      if (!v.viewer || !v.viewer.jobSeekerProfile) return; // Skip if no viewer or profile
      
      const viewerId = v.viewer.id;
      if (!uniqueJobSeekers.has(viewerId)) {
        uniqueJobSeekers.set(viewerId, {
          userId: viewerId,
          user: {
            id: v.viewer.id,
            fullName: v.viewer.fullName,
            email: v.viewer.email,
            phoneNumber: v.viewer.phoneNumber,
          },
          profile: v.viewer.jobSeekerProfile ? {
            id: v.viewer.jobSeekerProfile.id,
            bio: v.viewer.jobSeekerProfile.bio,
            skills: v.viewer.jobSeekerProfile.skills,
            experience: v.viewer.jobSeekerProfile.experience,
            education: v.viewer.jobSeekerProfile.education,
            resumeUrl: v.viewer.jobSeekerProfile.resumeUrl,
            linkedinUrl: v.viewer.jobSeekerProfile.linkedinUrl,
            portfolioUrl: v.viewer.jobSeekerProfile.portfolioUrl,
          } : null,
          viewedJobs: [],
        });
      }
      
      // Add job to viewed jobs list
      const seeker = uniqueJobSeekers.get(viewerId)!;
      const jobInfo = {
        jobId: v.jobId,
        jobTitle: v.job.title,
        viewedAt: v.viewedAt,
      };
      
      // Only add if not already in the list (avoid duplicates)
      if (!seeker.viewedJobs.some(j => j.jobId === v.jobId)) {
        seeker.viewedJobs.push(jobInfo);
      }
    });

    // Convert Map to array and return in format matching JobSeekerProfile
    return Array.from(uniqueJobSeekers.values()).map(seeker => ({
      id: seeker.profile?.id || 0,
      userId: seeker.userId,
      bio: seeker.profile?.bio || null,
      skills: seeker.profile?.skills || [],
      experience: seeker.profile?.experience || null,
      education: seeker.profile?.education || null,
      resumeUrl: seeker.profile?.resumeUrl || null,
      linkedinUrl: seeker.profile?.linkedinUrl || null,
      portfolioUrl: seeker.profile?.portfolioUrl || null,
      user: seeker.user,
      viewedJobs: seeker.viewedJobs.map(job => ({
        jobId: job.jobId,
        jobTitle: job.jobTitle,
        viewedAt: job.viewedAt.toISOString(), // Convert Date to string
      })), // Jobs this seeker viewed
    }));
  }
}
