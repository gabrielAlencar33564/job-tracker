import { ApplicationStatus, Job, Company, Note } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// JOBS
export async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_URL}/jobs`);
    if (!response.ok) {
      console.error(`HTTP Error: ${response.status}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    return [];
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
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
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao criar vaga:", error);
    return null;
  }
}

export async function updateJobStatus(id: string, newStatus: ApplicationStatus): Promise<Job | null> {
  try {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
      console.error(`HTTP Error: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar status da vaga:", error);
    return null;
  }
}

export async function reorderJobs(data: { id: string; order: number; status: ApplicationStatus }[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/jobs/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs: data }),
    });
    return response.ok;
  } catch (error) {
    console.error("Erro ao reordenar vagas:", error);
    return false;
  }
}


// COMPANIES
export async function getCompanies(): Promise<Company[]> {
  try {
    const response = await fetch(`${API_URL}/companies`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    return [];
  }
}

export async function createCompany(data: { name: string; website?: string | null }): Promise<Company | null> {
  try {
    const response = await fetch(`${API_URL}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    return null;
  }
}

// NOTES
export async function getNotesByJobId(jobId: string): Promise<Note[]> {
  try {
    const response = await fetch(`${API_URL}/notes/job/${jobId}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
    return [];
  }
}

export async function createNote(data: { content: string; jobId: string }): Promise<Note | null> {
  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao criar nota:", error);
    return null;
  }
}
