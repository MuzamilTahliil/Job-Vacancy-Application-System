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
    if (userRole === UserRole.ADMIN) {
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
    id: number,
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    // 1. Fetch application
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    // 2. Verify ownership
    if (application.job.employerId !== userId) {
      throw new ForbiddenException('You can only update applications for your own jobs');
    }

    // 3. Update status
    return this.prisma.application.update({
      where: { id },
      data: {
        status: updateApplicationStatusDto.status,
        reviewedAt: new Date(),
      },
    });
  }
}
