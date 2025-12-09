import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName!: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (min 6 chars)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @ApiPropertyOptional({ example: 'Tech Corp', description: 'Company name (for employers)' })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.JOB_SEEKER,
    description: 'User role',
    example: UserRole.JOB_SEEKER,
    examples: {
      employer: { value: UserRole.EMPLOYER, description: 'Register as Employer' },
      jobSeeker: { value: UserRole.JOB_SEEKER, description: 'Register as Job Seeker' },
    },
  })
  @IsEnum(UserRole, { message: 'Role must be SUPER_ADMIN, ADMIN, EMPLOYER, or JOB_SEEKER' })
  @IsOptional()
  role?: UserRole;
}
