import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { JobBoardsService } from './job-boards.service';
import { CreateJobBoardDto } from './dto/create-job-board.dto';
import { UpdateJobBoardDto } from './dto/update-job-board.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobBoardDto: UpdateJobBoardDto) {
    return this.jobBoardsService.update(id, updateJobBoardDto);
  }
}
