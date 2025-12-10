import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import {
  ApiGetMyProfile,
  ApiUpdateMyProfile,
} from './decorators/swagger.decorators';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiGetMyProfile()
  findMyProfile(@Req() req: AuthenticatedRequest) {
    return this.profilesService.findMyProfile(req.user.id);
  }

  @Patch('me')
  @ApiUpdateMyProfile()
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(req.user.id, updateProfileDto);
  }

  @Get('all')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EMPLOYER)
  findAll() {
    return this.profilesService.findAll();
  }

  @Patch(':userId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateProfileByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(userId, updateProfileDto);
  }
}
