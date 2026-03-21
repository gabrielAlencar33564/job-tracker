import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.service';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [PrismaModule, CompaniesModule, JobsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
