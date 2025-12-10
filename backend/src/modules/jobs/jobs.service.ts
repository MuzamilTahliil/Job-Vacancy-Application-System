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
    // Check if job exists
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Record the view
    await this.prisma.jobView.create({
      data: {
        jobId,
        viewerId,
      },
    });

    return { success: true };
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

    // Get view counts for each job
    const views = await this.prisma.jobView.groupBy({
      by: ['jobId'],
      where: {
        jobId: { in: jobIds },
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

    // Get all views with viewer information for employer's jobs
    const views = await this.prisma.jobView.findMany({
      where: {
        jobId: { in: jobIds },
        viewerId: { not: null }, // Only logged-in viewers
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

    return views.map(v => ({
      id: v.id,
      jobId: v.jobId,
      jobTitle: v.job.title,
      viewerId: v.viewerId,
      viewer: v.viewer ? {
        id: v.viewer.id,
        fullName: v.viewer.fullName,
        email: v.viewer.email,
        phoneNumber: v.viewer.phoneNumber,
      } : null,
      viewedAt: v.viewedAt,
    }));
  }
}
