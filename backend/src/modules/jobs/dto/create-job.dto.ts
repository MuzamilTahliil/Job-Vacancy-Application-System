import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { JobType } from '@prisma/client';

export class CreateJobDto {
  @ApiProperty({ example: 'Software Engineer', description: 'Job Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Develop awesome apps.', description: 'Job Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Node.js, NestJS, React', description: 'Job Requirements' })
  @IsString()
  @IsNotEmpty()
  requirements: string;

  @ApiProperty({ example: 'Write clean code.', description: 'Job Responsibilities' })
  @IsString()
  @IsNotEmpty()
  responsibilities: string;

  @ApiProperty({ example: 'Remote', description: 'Job Location' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ enum: JobType, example: JobType.FULL_TIME })
  @IsEnum(JobType)
  jobType: JobType;



  @ApiProperty({ example: '$100,000 - $120,000', description: 'Salary Range' })
  @IsString()
  @IsOptional()
  salary?: string;

  @ApiProperty({ example: '2025-12-31T00:00:00.000Z', description: 'Application Deadline' })
  @IsDateString()
  deadline: string;

  @ApiProperty({ example: true, description: 'Is the job active?' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
