import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    example: 2,
    description: 'The ID of the user updating the status (employer)',
  })
  @IsInt({ message: 'User ID must be an integer' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId!: number;

  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.SHORTLISTED,
    description: 'New status for the application',
  })
  @IsEnum(ApplicationStatus, {
    message:
      'Status must be one of: PENDING, REVIEWED, SHORTLISTED, REJECTED, ACCEPTED',
  })
  @IsNotEmpty({ message: 'Status is required' })
  status: ApplicationStatus;
}
