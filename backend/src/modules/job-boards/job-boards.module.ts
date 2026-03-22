import { Module } from '@nestjs/common';
import { JobBoardsService } from './job-boards.service';
import { JobBoardsController } from './job-boards.controller';

@Module({
  controllers: [JobBoardsController],
  providers: [JobBoardsService],
})
export class JobBoardsModule {}
