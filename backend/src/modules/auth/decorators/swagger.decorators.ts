import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import {
  ConflictErrorResponseDto,
  UnauthorizedErrorResponseDto,
  ErrorResponseDto,
} from '../../../common/dto/error-response.dto';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description:
        'Create a new user account. Returns user information and JWT token.',
    }),
    ApiBody({
      type: RegisterUserDto,
      examples: {
        jobSeeker: {
          summary: 'Job Seeker Registration',
          value: {
            fullName: 'Jane Smith',
            email: 'jane.smith@example.com',
            password: 'password123',
            role: 'JOB_SEEKER',
          },
        },
        employer: {
          summary: 'Employer Registration',
          value: {
            fullName: 'John Manager',
            email: 'john.manager@techcorp.com',
            password: 'password123',
            role: 'EMPLOYER',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'User successfully registered',
      type: AuthResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Email already exists',
      type: ConflictErrorResponseDto,
    }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: 'Login user',
      description: 'Authenticate user and return JWT token',
    }),
    ApiBody({
      type: LoginUserDto,
      examples: {
        admin: {
          summary: 'Super Admin Login',
          value: {
            email: 'admin@admin.com',
            password: 'password123',
          },
        },
        user: {
          summary: 'Regular User Login',
          value: {
            email: 'user@example.com',
            password: 'password123',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged in',
      type: AuthResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation failed',
      type: ErrorResponseDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid credentials',
      type: UnauthorizedErrorResponseDto,
    }),
  );
}
