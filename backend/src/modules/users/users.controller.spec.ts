import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  // ... (setup remains the same)

  const mockUsersService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    fullName: 'Test User',
    role: UserRole.JOB_SEEKER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [mockUser];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser as any);
      expect(await controller.findOne(1)).toBe(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const req = { user: mockUser } as any;
      expect(controller.getProfile(req)).toBe(mockUser);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const dto = { fullName: 'Updated Name' };
      jest.spyOn(service, 'update').mockResolvedValue({ ...mockUser, ...dto } as any);

      const result = await controller.update(1, dto);
      expect(result.fullName).toEqual('Updated Name');
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });
});
