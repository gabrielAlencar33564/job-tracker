'use client';

import { useState, useEffect } from 'react';
import { ApplicationStatus, Job } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { getJobs, updateJobStatus } from '@/services/api';

const COLUMNS = [
  { status: ApplicationStatus.APPLIED, title: 'Candidatado' },
  { status: ApplicationStatus.WAITING_REPLY, title: 'Aguardando' },
  { status: ApplicationStatus.INTERVIEW, title: 'Entrevista' },
  { status: ApplicationStatus.TECHNICAL_TEST, title: 'Teste Técnico' },
  { status: ApplicationStatus.OFFER_RECEIVED, title: 'Proposta' },
  { status: ApplicationStatus.REJECTED, title: 'Recusado' },
];

export function KanbanBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        setError('Erro ao carregar as vagas. Certifique-se que o backend está rodando.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleStatusChange = async (jobId: string, newStatus: ApplicationStatus) => {
    try {
      const updatedJob = await updateJobStatus(jobId, newStatus);
      if (updatedJob) {
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.id === jobId ? updatedJob : job))
        );
      } else {
        alert('Erro ao atualizar o status da vaga no servidor.');
      }
    } catch (err) {
      alert('Erro inesperado ao atualizar o status da vaga.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-8 flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
      {COLUMNS.map((column) => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          jobs={jobs.filter((job) => job.status === column.status)}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}
