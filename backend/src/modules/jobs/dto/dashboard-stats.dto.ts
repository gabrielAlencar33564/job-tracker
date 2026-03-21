import { ApplicationStatus } from '@prisma/client';

export class StatusCountDto {
  status: ApplicationStatus;
  count: number;
}

export class DashboardStatsDto {
  totalJobs: number;
  statusCounts: StatusCountDto[];
  recentJobsCount: number; // created in last 30 days
}
