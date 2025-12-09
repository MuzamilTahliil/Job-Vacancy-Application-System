import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
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

@ApiTags('Profiles')
@UseGuards(JwtAuthGuard)
@Controller('profiles')
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
}
