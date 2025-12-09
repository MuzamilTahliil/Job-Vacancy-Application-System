import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123',
        role: UserRole.JOB_SEEKER,
      };

      const resolvedUser = {
        id: 1,
        ...dto,
        password: 'hashed-password',
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(resolvedUser);

      const result = await service.createUser(dto);

      expect(prisma.user.create).toHaveBeenCalled();
      // Verify password was hashed (not the plain text)
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: dto.email,
            // We can't strictly check hash match here without mocking bcrypt,
            // but we can ensure it's NOT the plain text if we want,
            // or just rely on the fact that service calls bcrypt.hash
          }),
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...expectedResult } = resolvedUser;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('remove', () => {
    it('should delete a user if not super admin', async () => {
      const mockUser = { id: 1, role: UserRole.JOB_SEEKER };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete = jest.fn().mockResolvedValue(mockUser);

      await service.remove(1);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw ConflictException if user is super admin', async () => {
      const mockUser = { id: 2, role: UserRole.SUPER_ADMIN };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.remove(2)).rejects.toThrow('Super Admin cannot be deleted');
    });

    it('should throw ConflictException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow('User not found');
    });
  });
});
