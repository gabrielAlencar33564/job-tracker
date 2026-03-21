import { DashboardStats } from '@/types';
import { apiFetch } from './apiClient';

export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    return await apiFetch<DashboardStats>('/jobs/stats');
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return null;
  }
}
