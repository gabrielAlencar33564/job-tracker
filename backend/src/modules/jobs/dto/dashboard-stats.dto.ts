import { ApplicationStatus } from '@prisma/client';

export class StatusCountDto {
  status: ApplicationStatus;
  count: number;
}

export class JobBoardVolumeStatDto {
  jobBoardId: string | null;
  jobBoardName: string;
  count: number;
}

export class JobBoardConversionStatDto {
  jobBoardId: string | null;
  jobBoardName: string;
  conversionRate: number; // percentage of jobs that reached INTERVIEW status
  totalJobs: number;
  interviewJobs: number;
}

export class DashboardStatsDto {
  totalJobs: number;
  statusCounts: StatusCountDto[];
  recentJobsCount: number;
  jobBoardVolumeStats: JobBoardVolumeStatDto[];
  jobBoardConversionStats: JobBoardConversionStatDto[];
}
