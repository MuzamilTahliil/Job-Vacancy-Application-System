import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchJobDto } from './dto/search-job.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateJob,
  ApiDeleteJob,
  ApiFindAllJobs,
  ApiFindOneJob,
  ApiUpdateJob,
} from './decorators/swagger.decorators';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import { Public } from '../../common/decorator/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @Public()
  @ApiFindAllJobs()
  findAll(@Query() query: SearchJobDto) {
    return this.jobsService.findAll(query);
  }

  @Get('views/employer')
  @UseGuards(JwtAuthGuard)
  getEmployerViews(@Req() req: AuthenticatedRequest) {
    const employerId = req.user.id;
    return this.jobsService.getJobViewsForEmployer(employerId);
  }

  @Get('viewers/employer')
  @UseGuards(JwtAuthGuard)
  getEmployerViewers(@Req() req: AuthenticatedRequest) {
    const employerId = req.user.id;
    return this.jobsService.getJobViewersForEmployer(employerId);
  }

  @Get('viewed/jobseekers')
  @UseGuards(JwtAuthGuard)
  getJobSeekersWhoViewed(@Req() req: AuthenticatedRequest) {
    console.log(`[JobsController] Getting job seekers who viewed jobs for employer: ${req.user.id}`);
    const employerId = req.user.id;
    return this.jobsService.getJobSeekersWhoViewedJobs(employerId);
  }

  @Post(':id/view')
  @Public()
  trackView(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log(`[JobsController] Track view request - jobId: ${id}, user: ${req.user?.id || 'anonymous'}`);
    const viewerId = req.user?.id || null;
    return this.jobsService.trackView(id, viewerId);
  }

  @Get(':id')
  @Public()
  @ApiFindOneJob()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @ApiCreateJob()
  create(@Req() req: AuthenticatedRequest, @Body() createJobDto: CreateJobDto) {
    // User ID from JWT - no fallback for security
    const employerId = req.user.id;
    return this.jobsService.create(employerId, createJobDto);
  }

  @Patch(':id')
  @ApiUpdateJob()
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    const userId = req.user.id;
    return this.jobsService.update(userId, id, updateJobDto);
  }

  @Delete(':id')
  @ApiDeleteJob()
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.id;
    return this.jobsService.remove(userId, id);
  }
}
