import { Job, ApplicationStatus } from '@/types';
import { apiFetch } from './apiClient';

export async function getJobs(): Promise<Job[]> {
  try {
    return await apiFetch<Job[]>('/jobs');
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    return [];
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    return await apiFetch<Job>(`/jobs/${id}`);
  } catch (error) {
    console.error("Erro ao buscar vaga:", error);
    return null;
  }
}

export async function createJob(data: {
  title: string;
  link: string;
  expectedSalary?: number | null;
  companyId: string;
  appliedDate: string;
  status: ApplicationStatus;
}): Promise<Job | null> {
  try {
    return await apiFetch<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    return null;
  }
}

export async function updateJobStatus(id: string, newStatus: ApplicationStatus): Promise<Job | null> {
  try {
    return await apiFetch<Job>(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (error) {
    console.error("Erro ao atualizar status da vaga:", error);
    return null;
  }
}

export async function reorderJobs(data: { id: string; order: number; status: ApplicationStatus }[]): Promise<boolean> {
  try {
    await apiFetch('/jobs/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ jobs: data }),
    });
    return true;
  } catch (error) {
    console.error("Erro ao reordenar vagas:", error);
    return false;
  }
}
