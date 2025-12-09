import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id!: number;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  email!: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  fullName!: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.JOB_SEEKER,
    description: 'User role',
  })
  role!: UserRole;

  @ApiProperty({
    example: 'Tech Corp',
    description: 'Company name (for employers)',
    required: false,
  })
  companyName?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Account creation timestamp',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2024-01-20T14:45:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt!: Date;
}

export class DeleteUserResponseDto {
  @ApiProperty({
    example: 'User successfully deleted',
    description: 'Success message',
  })
  message!: string;

  @ApiProperty({ example: 5, description: 'ID of deleted user' })
  deletedUserId!: number;
}
