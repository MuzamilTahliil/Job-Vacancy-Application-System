import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateApplicationStatusDto {
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
