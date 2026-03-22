export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  WAITING_REPLY = 'WAITING_REPLY',
  INTERVIEW = 'INTERVIEW',
  TECHNICAL_TEST = 'TECHNICAL_TEST',
  REJECTED = 'REJECTED',
  OFFER_RECEIVED = 'OFFER_RECEIVED'
}

export interface StatusCount {
  status: ApplicationStatus;
  count: number;
}

export interface DashboardStats {
  totalJobs: number;
  statusCounts: StatusCount[];
  recentJobsCount: number;
}

export interface Company {
  id: string;
  name: string;
  website?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Job {
  id: string;
  title: string;
  link: string;
  expectedSalary?: number | null;
  appliedDate: Date | string;
  status: ApplicationStatus;
  order: number;
  companyId: string;
  company?: Company;
  _count?: {
    notes: number;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Note {
  id: string;
  content: string;
  jobId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
