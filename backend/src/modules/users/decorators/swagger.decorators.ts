import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import {
  ConflictErrorResponseDto,
  NotFoundErrorResponseDto,
} from '../../../common/dto/error-response.dto';

export function ApiFindAllUsers() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all users',
      description: 'Retrieve a list of all users. Requires authentication.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved all users',
      type: [UserResponseDto],
    }),
  );
}

export function ApiGetProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get current user profile',
      description: 'Retrieve the profile of the currently authenticated user. Requires authentication.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved user profile',
      type: UserResponseDto,
    }),
  );
}

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description: 'Create a new user account. Requires authentication.',
    }),
    ApiBearerAuth(),
    ApiBody({
      type: CreateUserDto,
      examples: {
        jobSeeker: {
          summary: 'Job Seeker',
          value: {
            email: 'jobseeker@example.com',
            password: 'StrongPa$$word123',
            fullName: 'Jane Smith',
            role: 'JOB_SEEKER',
          },
        },
        employer: {
          summary: 'Employer',
          value: {
            email: 'employer@techcorp.com',
            password: 'StrongPa$$word123',
            fullName: 'John Manager',
            role: 'EMPLOYER',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'User successfully created',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Email already exists',
      type: ConflictErrorResponseDto,
    }),
  );
}

export function ApiFindOneUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user by ID',
      description: 'Retrieve a specific user by their ID. Requires authentication.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved user',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - User does not exist',
      type: NotFoundErrorResponseDto,
    }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user',
      description: 'Update user information. Requires authentication.',
    }),
    ApiBearerAuth(),
    ApiBody({
      type: UpdateUserDto,
      examples: {
        updateProfile: {
          summary: 'Update Profile',
          value: {
            fullName: 'Jane Doe Updated',
            phoneNumber: '+1234567890',
          },
        },
        changePassword: {
          summary: 'Change Password',
          value: {
            password: 'NewStrongPa$$word123',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully updated',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - User does not exist',
      type: NotFoundErrorResponseDto,
    }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete user',
      description: 'Delete a user account. Super admin cannot be deleted. Requires authentication.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'User successfully deleted',
      schema: {
        example: {
          id: 5,
          email: 'deleted.user@example.com',
          fullName: 'Deleted User',
          role: 'JOB_SEEKER',
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-20T14:45:00.000Z',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - User does not exist',
      type: NotFoundErrorResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Super Admin cannot be deleted',
      type: ConflictErrorResponseDto,
    }),
  );
}
