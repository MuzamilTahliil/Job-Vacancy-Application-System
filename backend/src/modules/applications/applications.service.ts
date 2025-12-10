import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationStatus, UserRole } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateApplicationDto) {
    try {
      // 1. Check if job exists and is active
      const job = await this.prisma.job.findUnique({
        where: { id: dto.jobId },
      });

      if (!job) {
        throw new NotFoundException('Job not found');
      }

      if (!job.isActive) {
        throw new BadRequestException('This job is no longer active');
      }

      // 2. Check for duplicate application
      const existingApplication = await this.prisma.application.findUnique({
        where: {
          jobId_applicantId: {
            jobId: job.id,
            applicantId: userId,
          },
        },
      });

      if (existingApplication) {
        throw new BadRequestException('You have already applied for this job');
      }

      // 3. Create Application
      return await this.prisma.application.create({
        data: {
          jobId: job.id,
          applicantId: userId,
          coverLetter: dto.coverLetter,
          resumeUrl: dto.resumeUrl,
          status: ApplicationStatus.PENDING,
        },
      });
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  async findMyApplications(userId: number) {
    return this.prisma.application.findMany({
      where: { applicantId: userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            employer: { 
              select: { 
                fullName: true, 
                company: { select: { name: true } } 
              } 
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findByJob(userId: number, jobId: number) {
    // 1. Verify Job existence and ownership
    const job = await this.prisma.job.findUnique({
        where: { id: jobId },
    });

    if (!job) {
        throw new NotFoundException('Job not found');
    }

    if (job.employerId !== userId) {
        throw new ForbiddenException('You can only view applications for your own jobs');
    }

    // 2. Return applications
    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        applicant: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findMyJobApplications(userId: number) {
    // Get all applications for jobs where the user is the employer
    // For regular employers, only show their own job applications
    const userJobs = await this.prisma.job.findMany({
      where: { employerId: userId },
      select: { id: true },
    });
    
    const userJobIds = userJobs.map(job => job.id);
    
    if (userJobIds.length === 0) {
      return [];
    }
    
    return this.prisma.application.findMany({
      where: {
        jobId: {
          in: userJobIds,
        },
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            jobType: true,
            employerId: true,
          },
        },
        applicant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findAllApplications() {
    // Get ALL applications (for admins to view)
    return this.prisma.application.findMany({
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            jobType: true,
            employerId: true,
            employer: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        applicant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findOne(userId: number, userRole: string, id: number) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
        applicant: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // 3. Logic check:
    if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
      // Admins can view all applications (no restriction)
      return application;
    }

    if (userRole === UserRole.JOB_SEEKER) {
      if (application.applicantId !== userId) {
        throw new ForbiddenException('You do not have permission to view this application');
      }
    } else if (userRole === UserRole.EMPLOYER) {
        // job.employerId is what we check
        if (application.job.employerId !== userId) {
             throw new ForbiddenException('You do not have permission to view this application');
        }
    }

    return application;
  }

  async updateStatus(
    userId: number,
    userRole: string,
    id: number,
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    // 1. Fetch application with job and employer info
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            employer: {
              select: {
                id: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // 2. Verify ownership
    const isOwnJob = application.job.employerId === userId;
    const isJobOwnerAdmin = application.job.employer.role === UserRole.ADMIN || application.job.employer.role === UserRole.SUPER_ADMIN;
    const isCurrentUserAdmin = userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;

    if (isCurrentUserAdmin) {
      // Admins can only update applications for their own jobs OR jobs created by other admins
      if (!isOwnJob && !isJobOwnerAdmin) {
        throw new ForbiddenException('You can only update applications for your own jobs or jobs created by admins');
      }
    } else {
      // Regular employers can only update applications for their own jobs
      if (!isOwnJob) {
        throw new ForbiddenException('You can only update applications for your own jobs');
      }
    }

    // 3. Update status
    return this.prisma.application.update({
      where: { id },
      data: {
        status: updateApplicationStatusDto.status,
        reviewedAt: new Date(),
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            jobType: true,
            employerId: true,
          },
        },
        applicant: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });
  }
}
