import { Note } from '@/types';
import { apiFetch } from './apiClient';

export async function getNotesByJob(jobId: string): Promise<Note[]> {
  try {
    return await apiFetch<Note[]>(`/notes/job/${jobId}`);
  } catch (error) {
    console.error("Erro ao buscar anotações:", error);
    return [];
  }
}

export async function createNote(jobId: string, content: string): Promise<Note | null> {
  try {
    return await apiFetch<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify({ jobId, content }),
    });
  } catch (error) {
    console.error("Erro ao criar anotação:", error);
    return null;
  }
}
