import { ApplicationStatus, Job, Company } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/jobs`);
    if (!response.ok) {
      console.error(`Erro ao buscar vagas: Status ${response.status}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    return [];
  }
}

export async function updateJobStatus(id: string, newStatus: ApplicationStatus): Promise<Job | null> {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      console.error(`Erro ao atualizar status: Status ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar status da vaga:", error);
    return null;
  }
}

export async function getCompanies(): Promise<Company[]> {
  try {
    const response = await fetch(`${API_URL}/companies`);
    if (!response.ok) {
      console.error(`Erro ao buscar empresas: Status ${response.status}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    return [];
  }
}

export async function createCompany(data: { name: string; website?: string }): Promise<Company | null> {
  try {
    const response = await fetch(`${API_URL}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Erro ao criar empresa: Status ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    return null;
  }
}

export async function createJob(data: { 
  title: string; 
  link: string; 
  expectedSalary?: number; 
  companyId: string;
  appliedDate: string;
}): Promise<Job | null> {
  try {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Erro ao criar vaga: Status ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    return null;
  }
}
