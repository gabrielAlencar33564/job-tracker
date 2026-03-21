import { Company } from '@/types';
import { apiFetch } from './apiClient';

export async function getCompanies(): Promise<Company[]> {
  try {
    return await apiFetch<Company[]>('/companies');
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    return [];
  }
}

export async function createCompany(data: { name: string; website?: string | null }): Promise<Company | null> {
  try {
    return await apiFetch<Company>('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    return null;
  }
}

export async function deleteCompany(id: string): Promise<boolean> {
  try {
    await apiFetch(`/companies/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error("Erro ao deletar empresa:", error);
    return false;
  }
}
