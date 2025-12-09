import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPa$$word123',
    description: 'User password (min 8 chars, strong)',
  })
  @IsStrongPassword({
    minLength: 8,
  })
  password!: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  fullName!: string;

  @ApiProperty({
    enum: UserRole,
    description: 'User role',
    example: UserRole.JOB_SEEKER,
    examples: {
      superAdmin: { value: UserRole.SUPER_ADMIN, description: 'Super Administrator (non-deletable)' },
      admin: { value: UserRole.ADMIN, description: 'Administrator' },
      employer: { value: UserRole.EMPLOYER, description: 'Employer/Company' },
      jobSeeker: { value: UserRole.JOB_SEEKER, description: 'Job Seeker' },
    },
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ example: 'Acme Corp', description: 'Company Name (for Employers)', required: false })
  @IsString()
  @IsOptional()
  companyName?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
