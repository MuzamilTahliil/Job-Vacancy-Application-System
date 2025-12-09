import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';

export function ApiGetMyProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get my profile (Job Seeker)',
      description:
        'Retrieve the profile of the authenticated job seeker. Returns profile information including bio, skills, experience, education, and URLs.',
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Profile retrieved successfully',
      schema: {
        example: {
          id: 1,
          userId: 3,
          bio: 'Passionate Full Stack Developer with 5 years experience in building scalable web applications.',
          skills: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'AWS'],
          experience:
            '5 years of experience in web development. Previously worked at TechCorp as Senior Developer, leading a team of 4 developers.',
          education:
            'BS in Computer Science from State University (2015-2019). Graduated with honors.',
          resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
          linkedinUrl: 'https://linkedin.com/in/johndoe',
          portfolioUrl: 'https://johndoe.dev',
          createdAt: '2025-12-09T00:00:00.000Z',
          updatedAt: '2025-12-09T00:00:00.000Z',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Profile not found',
      schema: {
        example: {
          statusCode: 404,
          error: 'Not Found',
          message: 'Profile not found for this user',
        },
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

export function ApiUpdateMyProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update my profile (Job Seeker) - Upsert',
      description:
        'Create or update the profile of the authenticated job seeker. If profile does not exist, it will be created. Otherwise, it will be updated with the provided fields.',
    }),
    ApiBearerAuth(),
    ApiBody({
      type: UpdateProfileDto,
      examples: {
        fullProfile: {
          summary: 'Complete Profile',
          value: {
            bio: 'Passionate Full Stack Developer with 5 years experience in building scalable web applications.',
            skills: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
            experience:
              '5 years of experience in web development. Previously worked at TechCorp as Senior Developer, leading a team of 4 developers. Built multiple high-traffic applications serving millions of users.',
            education:
              'BS in Computer Science from State University (2015-2019). Graduated with honors. Completed advanced courses in distributed systems and cloud architecture.',
            resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
            linkedinUrl: 'https://linkedin.com/in/johndoe',
            portfolioUrl: 'https://johndoe.dev',
          },
        },
        minimalProfile: {
          summary: 'Minimal Profile',
          value: {
            bio: 'Junior developer looking for opportunities.',
            skills: ['JavaScript', 'HTML', 'CSS'],
          },
        },
        updateSkills: {
          summary: 'Update Skills Only',
          value: {
            skills: [
              'Node.js',
              'React',
              'TypeScript',
              'PostgreSQL',
              'AWS',
              'Docker',
              'Kubernetes',
            ],
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Profile updated/created successfully',
      schema: {
        example: {
          id: 1,
          userId: 3,
          bio: 'Passionate Full Stack Developer with 5 years experience in building scalable web applications.',
          skills: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
          experience:
            '5 years of experience in web development. Previously worked at TechCorp as Senior Developer...',
          education:
            'BS in Computer Science from State University (2015-2019). Graduated with honors...',
          resumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
          linkedinUrl: 'https://linkedin.com/in/johndoe',
          portfolioUrl: 'https://johndoe.dev',
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
