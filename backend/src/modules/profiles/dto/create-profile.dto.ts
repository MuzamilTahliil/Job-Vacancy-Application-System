import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    example: 'Passionate Full Stack Developer with 5 years experience.',
    description: 'Short bio',
  })
  @IsString()
  @IsNotEmpty()
  bio: string;

  @ApiProperty({
    example: ['Node.js', 'React', 'TypeScript'],
    description: 'List of skills',
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  skills: string[];

  @ApiPropertyOptional({
    example: '5 years of experience in web development...',
    description: 'Detailed experience',
  })
  @IsString()
  @IsOptional()
  experience?: string;

  @ApiPropertyOptional({
    example: 'BS in Computer Science...',
    description: 'Education details',
  })
  @IsString()
  @IsOptional()
  education?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/resume.pdf',
    description: 'URL to resume PDF',
  })
  @IsUrl()
  @IsOptional()
  resumeUrl?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/johndoe',
    description: 'LinkedIn Profile URL',
  })
  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional({
    example: 'https://johndoe.com',
    description: 'Portfolio URL',
  })
  @IsUrl()
  @IsOptional()
  portfolioUrl?: string;
}
