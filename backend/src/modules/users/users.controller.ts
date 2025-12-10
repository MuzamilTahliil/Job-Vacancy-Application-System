import {
  Controller,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  ForbiddenException,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateUser,
  ApiDeleteUser,
  ApiFindAllUsers,
  ApiFindOneUser,
  ApiGetProfile,
  ApiUpdateUser,
} from './decorators/swagger.decorators';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

import { Roles } from '../../common/decorator/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiFindAllUsers()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @ApiGetProfile()
  async getProfile(@Request() req: AuthenticatedRequest) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    return user;
  }

  @Patch('profile')
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Users can update their own profile
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiCreateUser()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiFindOneUser()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiUpdateUser()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: AuthenticatedRequest,
  ) {
    // Check if current user is admin and can only update other admins
    const targetUser = await this.usersService.findById(id);
    if (!targetUser) {
      throw new ForbiddenException('User not found');
    }

    const currentUserRole = req.user.role as UserRole;
    const targetUserRole = targetUser.role as UserRole;

    // Admin can only update other admins (ADMIN or SUPER_ADMIN)
    if (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SUPER_ADMIN) {
      if (targetUserRole !== UserRole.ADMIN && targetUserRole !== UserRole.SUPER_ADMIN) {
        throw new ForbiddenException('Admins can only update other admins. Other users should update their profile.');
      }
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiDeleteUser()
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    // Check if user exists
    const targetUser = await this.usersService.findById(id);
    if (!targetUser) {
      throw new ForbiddenException('User not found');
    }

    const currentUserRole = req.user.role as UserRole;
    const targetUserRole = targetUser.role as UserRole;

    // Prevent deleting yourself
    if (req.user.id === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    // Prevent deleting SUPER_ADMIN (only SUPER_ADMIN can delete SUPER_ADMIN)
    if (targetUserRole === UserRole.SUPER_ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can delete super admin accounts');
    }

    return this.usersService.remove(id);
  }
}
