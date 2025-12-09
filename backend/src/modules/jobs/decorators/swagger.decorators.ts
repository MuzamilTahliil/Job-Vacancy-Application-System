import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import {
  ErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from '../../../common/dto/error-response.dto';

export function ApiCreateJob() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new job posting',
      description:
        'Create a new job posting as an employer. Requires authentication and employer role.',
    }),
    ApiBearerAuth(),
    ApiBody({
      type: CreateJobDto,
      examples: {
        fullTimeRemote: {
          summary: 'Full-Time Remote Software Engineer',
          value: {
            title: 'Senior Full Stack Developer',
            description:
              'We are looking for an experienced Full Stack Developer to join our remote team. You will work on cutting-edge web applications using modern technologies.',
            requirements:
              'Node.js, React, TypeScript, PostgreSQL, 5+ years experience',
            responsibilities:
              'Design and develop scalable web applications, mentor junior developers, participate in code reviews, collaborate with product team',
            location: 'Remote',
            jobType: 'FULL_TIME',
            salary: '$120,000 - $150,000',
            deadline: '2025-12-31T23:59:59.000Z',
            isActive: true,
          },
        },
        partTimeOnsite: {
          summary: 'Part-Time Marketing Specialist',
          value: {
            title: 'Digital Marketing Specialist',
            description:
              'Join our marketing team to help grow our brand presence online.',
            requirements:
              'SEO, Google Analytics, Social Media Marketing, 2+ years experience',
            responsibilities:
              'Manage social media accounts, create content, analyze campaign performance',
            location: 'New York, NY',
            jobType: 'PART_TIME',
            salary: '$40,000 - $60,000',
            deadline: '2025-06-30T23:59:59.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Job created successfully',
      schema: {
        example: {
          id: 1,
          title: 'Senior Full Stack Developer',
          description: 'We are looking for an experienced Full Stack Developer...',
          requirements: 'Node.js, React, TypeScript, PostgreSQL, 5+ years experience',
          responsibilities: 'Design and develop scalable web applications...',
          location: 'Remote',
          jobType: 'FULL_TIME',
          salary: '$120,000 - $150,000',
          deadline: '2025-12-31T23:59:59.000Z',
          isActive: true,
          employerId: 2,
          createdAt: '2025-12-09T00:00:00.000Z',
          updatedAt: '2025-12-09T00:00:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication required',
      type: UnauthorizedErrorResponseDto,
    }),
  );
}

export function ApiFindAllJobs() {
  return applyDecorators(
    ApiOperation({
      summary: 'List all active jobs',
      description:
        'Retrieve a list of all active job postings. Supports filtering by query, location, and job type.',
    }),
    ApiQuery({
      name: 'query',
      required: false,
      description: 'Search by title or description',
      example: 'software engineer',
    }),
    ApiQuery({
      name: 'location',
      required: false,
      description: 'Filter by location',
      example: 'Remote',
    }),
    ApiQuery({
      name: 'jobType',
      required: false,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
      description: 'Filter by job type',
      example: 'FULL_TIME',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved jobs',
      schema: {
        example: [
          {
            id: 1,
            title: 'Senior Full Stack Developer',
            description: 'We are looking for an experienced developer...',
            requirements: 'Node.js, React, TypeScript',
            responsibilities: 'Design and develop applications',
            location: 'Remote',
            jobType: 'FULL_TIME',
            salary: '$120,000 - $150,000',
            deadline: '2025-12-31T23:59:59.000Z',
            isActive: true,
            employerId: 2,
            createdAt: '2025-12-09T00:00:00.000Z',
            updatedAt: '2025-12-09T00:00:00.000Z',
          },
        ],
      },
    }),
  );
}

export function ApiFindOneJob() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get job details',
      description: 'Retrieve detailed information about a specific job posting by ID.',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved job',
      schema: {
        example: {
          id: 1,
          title: 'Senior Full Stack Developer',
          description: 'We are looking for an experienced Full Stack Developer...',
          requirements: 'Node.js, React, TypeScript, PostgreSQL, 5+ years experience',
          responsibilities: 'Design and develop scalable web applications...',
          location: 'Remote',
          jobType: 'FULL_TIME',
          salary: '$120,000 - $150,000',
          deadline: '2025-12-31T23:59:59.000Z',
          isActive: true,
          employerId: 2,
          createdAt: '2025-12-09T00:00:00.000Z',
          updatedAt: '2025-12-09T00:00:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Job does not exist',
      type: NotFoundErrorResponseDto,
    }),
  );
}

export function ApiUpdateJob() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a job posting',
      description:
        'Update an existing job posting. Only the employer who created the job can update it.',
    }),
    ApiBearerAuth(),
    ApiBody({
      type: UpdateJobDto,
      examples: {
        updateSalary: {
          summary: 'Update Salary Range',
          value: {
            salary: '$130,000 - $160,000',
          },
        },
        extendDeadline: {
          summary: 'Extend Application Deadline',
          value: {
            deadline: '2026-03-31T23:59:59.000Z',
          },
        },
        fullUpdate: {
          summary: 'Update Multiple Fields',
          value: {
            title: 'Lead Full Stack Developer',
            salary: '$140,000 - $170,000',
            requirements: 'Node.js, React, TypeScript, PostgreSQL, AWS, 7+ years experience',
            deadline: '2026-01-31T23:59:59.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Job updated successfully',
      schema: {
        example: {
          id: 1,
          title: 'Lead Full Stack Developer',
          description: 'We are looking for an experienced Full Stack Developer...',
          requirements: 'Node.js, React, TypeScript, PostgreSQL, AWS, 7+ years experience',
          responsibilities: 'Design and develop scalable web applications...',
          location: 'Remote',
          jobType: 'FULL_TIME',
          salary: '$140,000 - $170,000',
          deadline: '2026-01-31T23:59:59.000Z',
          isActive: true,
          employerId: 2,
          createdAt: '2025-12-09T00:00:00.000Z',
          updatedAt: '2025-12-09T01:00:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication required',
      type: UnauthorizedErrorResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Job does not exist',
      type: NotFoundErrorResponseDto,
    }),
  );
}

export function ApiDeleteJob() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete (deactivate) a job',
      description:
        'Delete a job posting. Only the employer who created the job can delete it. This sets isActive to false.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Job deleted successfully',
      schema: {
        example: {
          id: 1,
          title: 'Senior Full Stack Developer',
          description: 'We are looking for an experienced Full Stack Developer...',
          requirements: 'Node.js, React, TypeScript, PostgreSQL, 5+ years experience',
          responsibilities: 'Design and develop scalable web applications...',
          location: 'Remote',
          jobType: 'FULL_TIME',
          salary: '$120,000 - $150,000',
          deadline: '2025-12-31T23:59:59.000Z',
          isActive: false,
          employerId: 2,
          createdAt: '2025-12-09T00:00:00.000Z',
          updatedAt: '2025-12-09T02:00:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication required',
      type: UnauthorizedErrorResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Job does not exist',
      type: NotFoundErrorResponseDto,
    }),
  );
}
