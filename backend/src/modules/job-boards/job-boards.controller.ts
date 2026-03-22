import { Controller, Get, Post, Body } from '@nestjs/common';
import { JobBoardsService } from './job-boards.service';
import { CreateJobBoardDto } from './dto/create-job-board.dto';

@Controller('job-boards')
export class JobBoardsController {
  constructor(private readonly jobBoardsService: JobBoardsService) {}

  @Post()
  create(@Body() createJobBoardDto: CreateJobBoardDto) {
    return this.jobBoardsService.create(createJobBoardDto);
  }

  @Get()
  findAll() {
    return this.jobBoardsService.findAll();
  }
}
