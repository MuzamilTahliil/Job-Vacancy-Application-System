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
    // Check if user has a company name set (implied "Company Profile")
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });
    
    // Check if employer exists
    if (!user) {
        throw new NotFoundException('Employer not found');
    }

    if (!user.company) {
      throw new BadRequestException('User must belong to a company to post a job');
    }

    return this.prisma.job.create({
      data: {
        ...createJobDto,
        employerId: userId,
      },
      include: { 
        employer: { 
          select: { 
              fullName: true, 
              email: true,
              company: { select: { name: true } }
          } 
        } 
      },
    });
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
                company: { select: { name: true } }
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
}
