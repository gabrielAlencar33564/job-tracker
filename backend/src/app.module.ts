import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { NotesModule } from './modules/notes/notes.module';
import { JobBoardsModule } from './modules/job-boards/job-boards.module';

@Module({
  imports: [PrismaModule, CompaniesModule, JobsModule, NotesModule, JobBoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
