import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error type',
  })
  error!: string;

  @ApiProperty({
    example: 'Validation failed',
    description: 'Error message',
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
    ],
  })
  message!: string | string[];

  @ApiProperty({
    example: '/api/users',
    description: 'Request path',
  })
  path!: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Error timestamp',
  })
  timestamp!: string;
}

export class ConflictErrorResponseDto {
  @ApiProperty({ example: 409 })
  statusCode!: number;

  @ApiProperty({ example: 'Conflict' })
  error!: string;

  @ApiProperty({ example: 'Email already in use' })
  message!: string;
}

export class UnauthorizedErrorResponseDto {
  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ example: 'Unauthorized' })
  error!: string;

  @ApiProperty({ example: 'Invalid credentials' })
  message!: string;
}

export class ForbiddenErrorResponseDto {
  @ApiProperty({ example: 403 })
  statusCode!: number;

  @ApiProperty({ example: 'Forbidden' })
  error!: string;

  @ApiProperty({ example: 'You do not have permission to access this resource' })
  message!: string;
}

export class NotFoundErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({ example: 'Not Found' })
  error!: string;

  @ApiProperty({ example: 'User not found' })
  message!: string;
}
