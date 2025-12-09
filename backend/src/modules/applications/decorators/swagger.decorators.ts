import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UpdateApplicationStatusDto } from '../dto/update-application-status.dto';
import {
  ConflictErrorResponseDto,
  ErrorResponseDto,
} from '../../../common/dto/error-response.dto';

export function ApiCreateApplication() {
  return applyDecorators(
    ApiOperation({
      summary: 'Submit a new job application',
      description:
        'Submit a job application as a job seeker. Requires authentication and JOB_SEEKER role. Cannot apply to the same job twice.',
    }),
    ApiBearerAuth(),
    ApiBody({
      type: CreateApplicationDto,
      examples: {
        withResume: {
          summary: 'Application with Resume URL',
          value: {
            jobId: 1,
            coverLetter:
              'I am writing to express my strong interest in the Senior Full Stack Developer position. With over 5 years of experience in Node.js, React, and TypeScript, I am confident I can contribute significantly to your team. My background includes building scalable web applications and mentoring junior developers.',
            resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
          },
        },
        withoutResume: {
          summary: 'Application without Resume URL',
          value: {
            jobId: 2,
            coverLetter:
              'I am excited to apply for the Digital Marketing Specialist position. My experience in SEO, Google Analytics, and social media marketing aligns perfectly with your requirements. I have successfully managed multiple campaigns that increased engagement by 40%.',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Application submitted successfully',
      schema: {
        example: {
          id: 1,
          jobId: 1,
          applicantId: 3,
          coverLetter: 'I am writing to express my strong interest...',
          resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
          status: 'PENDING',
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
    ApiNotFoundResponse({
      description: 'Job not found',
      schema: {
        example: {
          statusCode: 404,
          error: 'Not Found',
          message: 'Job not found',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'User is not a JOB_SEEKER or already applied',
      schema: {
        example: {
          statusCode: 403,
          error: 'Forbidden',
          message: 'Only job seekers can apply to jobs',
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Already applied to this job',
      type: ConflictErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid or missing authentication token',
        },
      },
    }),
  );
}

export function ApiFindMyApplications() {
  return applyDecorators(
    ApiOperation({
      summary: 'List my applications (or applications for my jobs)',
      description:
        'For JOB_SEEKER: Returns all applications submitted by the authenticated user. For EMPLOYER: Returns all applications for jobs posted by the employer.',
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'List of applications retrieved successfully',
      schema: {
        example: [
          {
            id: 1,
            jobId: 1,
            applicantId: 3,
            coverLetter: 'I am writing to express my strong interest...',
            resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
            status: 'PENDING',
            createdAt: '2025-12-09T00:00:00.000Z',
            updatedAt: '2025-12-09T00:00:00.000Z',
            job: {
              id: 1,
              title: 'Senior Full Stack Developer',
              location: 'Remote',
              jobType: 'FULL_TIME',
            },
          },
          {
            id: 2,
            jobId: 2,
            applicantId: 3,
            coverLetter: 'I am excited to apply for...',
            status: 'REVIEWED',
            createdAt: '2025-12-08T00:00:00.000Z',
            updatedAt: '2025-12-08T12:00:00.000Z',
            job: {
              id: 2,
              title: 'Digital Marketing Specialist',
              location: 'New York, NY',
              jobType: 'PART_TIME',
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid or missing authentication token',
        },
      },
    }),
  );
}

export function ApiFindJobApplications() {
  return applyDecorators(
    ApiOperation({
      summary: 'List applications for a specific job (Employer only)',
      description:
        'Retrieve all applications for a specific job. Only the employer who posted the job can access this.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'jobId',
      type: 'number',
      description: 'ID of the job',
      example: 1,
    }),
    ApiOkResponse({
      description: 'List of applications for job',
      schema: {
        example: [
          {
            id: 1,
            jobId: 1,
            applicantId: 3,
            coverLetter: 'I am writing to express my strong interest...',
            resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
            status: 'PENDING',
            createdAt: '2025-12-09T00:00:00.000Z',
            updatedAt: '2025-12-09T00:00:00.000Z',
            applicant: {
              id: 3,
              fullName: 'John Doe',
              email: 'john.doe@example.com',
            },
          },
        ],
      },
    }),
    ApiForbiddenResponse({
      description: 'Not the employer who posted the job',
      schema: {
        example: {
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have permission to view applications for this job',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Job not found',
      schema: {
        example: {
          statusCode: 404,
          error: 'Not Found',
          message: 'Job not found',
        },
      },
    }),
  );
}

export function ApiFindOneApplication() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get application details',
      description:
        'Retrieve detailed information about a specific application. Job seekers can only view their own applications. Employers can view applications for their jobs.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID of the application',
      example: 1,
    }),
    ApiOkResponse({
      description: 'Application details',
      schema: {
        example: {
          id: 1,
          jobId: 1,
          applicantId: 3,
          coverLetter: 'I am writing to express my strong interest...',
          resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
          status: 'PENDING',
          createdAt: '2025-12-09T00:00:00.000Z',
          updatedAt: '2025-12-09T00:00:00.000Z',
          job: {
            id: 1,
            title: 'Senior Full Stack Developer',
            description: 'We are looking for an experienced developer...',
            location: 'Remote',
            jobType: 'FULL_TIME',
            salary: '$120,000 - $150,000',
          },
          applicant: {
            id: 3,
            fullName: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Not authorized to view this application',
      schema: {
        example: {
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have permission to view this application',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Application not found',
      schema: {
        example: {
          statusCode: 404,
          error: 'Not Found',
          message: 'Application not found',
        },
      },
    }),
  );
}

export function ApiUpdateApplicationStatus() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update application status (Employer only)',
      description:
        'Update the status of a job application. Only the employer who posted the job can update application status.',
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'ID of the application',
      example: 1,
    }),
    ApiBody({
      type: UpdateApplicationStatusDto,
      examples: {
        reviewed: {
          summary: 'Mark as Reviewed',
          value: {
            status: 'REVIEWED',
          },
        },
        shortlisted: {
          summary: 'Shortlist Candidate',
          value: {
            status: 'SHORTLISTED',
          },
        },
        accepted: {
          summary: 'Accept Application',
          value: {
            status: 'ACCEPTED',
          },
        },
        rejected: {
          summary: 'Reject Application',
          value: {
            status: 'REJECTED',
          },
        },
      },
    }),
    ApiOkResponse({
      description: 'Status updated successfully',
      schema: {
        example: {
          id: 1,
          jobId: 1,
          applicantId: 3,
          coverLetter: 'I am writing to express my strong interest...',
          resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
          status: 'SHORTLISTED',
          createdAt: '2025-12-09T00:00:00.000Z',
          updatedAt: '2025-12-09T01:00:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid status value',
      type: ErrorResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Not authorized to update',
      schema: {
        example: {
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have permission to update this application',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Application not found',
      schema: {
        example: {
          statusCode: 404,
          error: 'Not Found',
          message: 'Application not found',
        },
      },
    }),
  );
}
