import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the job being applied for',
  })
  @IsInt({ message: 'Job ID must be an integer' })
  @IsNotEmpty({ message: 'Job ID is required' })
  jobId!: number;

  @ApiProperty({
    example: 'I am highly interested in this position because...',
    description: 'Cover letter for the application',
  })
  @IsString()
  @IsNotEmpty({ message: 'Cover letter is required' })
  @MinLength(50, {
    message: 'Cover letter must be at least 50 characters long',
  })
  coverLetter!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/my-resume.pdf',
    description: 'URL to the Resume PDF (optional if profile resume is used)',
  })
  @IsUrl({}, { message: 'Invalid Resume URL' })
  @IsOptional()
  resumeUrl?: string;
}
