import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateApplication,
  ApiFindJobApplications,
  ApiFindMyApplications,
  ApiFindOneApplication,
  ApiUpdateApplicationStatus,
} from './decorators/swagger.decorators';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Applications')
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiCreateApplication()
  create(@Req() req: AuthenticatedRequest, @Body() createApplicationDto: CreateApplicationDto) {
    // User ID from JWT only - prevents impersonation
    return this.applicationsService.create(
      req.user.id,
      createApplicationDto,
    );
  }

  @Get()
  @ApiFindMyApplications()
  findAll(@Req() req: AuthenticatedRequest) {
    // User can only view their own applications
    return this.applicationsService.findMyApplications(req.user.id);
  }

  @Get('job/:jobId')
  @ApiFindJobApplications()
  findByJob(
    @Req() req: AuthenticatedRequest,
    @Param('jobId', ParseIntPipe) jobId: number,
  ) {
    // User ID from JWT - service will check if user is employer
    return this.applicationsService.findByJob(req.user.id, jobId);
  }

  @Get(':id')
  @ApiFindOneApplication()
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // User ID and role from JWT - service will validate access
    return this.applicationsService.findOne(req.user.id, req.user.role, id);
  }

  @Patch(':id/status')
  @ApiUpdateApplicationStatus()
  updateStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    // User ID from JWT - service will check if user is employer
    return this.applicationsService.updateStatus(
      req.user.id,
      id,
      updateApplicationStatusDto,
    );
  }
}
