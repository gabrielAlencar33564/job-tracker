import { JobBoard } from '@/types';
import { apiFetch } from './apiClient';

export async function getJobBoards(): Promise<JobBoard[]> {
  try {
    return await apiFetch<JobBoard[]>('/job-boards');
  } catch (error) {
    console.error("Erro ao buscar plataformas de vagas:", error);
    return [];
  }
}

export async function createJobBoard(data: { name: string; url: string }): Promise<JobBoard | null> {
  try {
    return await apiFetch<JobBoard>('/job-boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Erro ao criar plataforma de vagas:", error);
    return null;
  }
}

export async function updateJobBoard(id: string, data: { name?: string; url?: string }): Promise<JobBoard | null> {
  try {
    return await apiFetch<JobBoard>(`/job-boards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Erro ao atualizar plataforma de vagas:", error);
    return null;
  }
}
