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
