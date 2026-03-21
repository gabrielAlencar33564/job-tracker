import { ApplicationStatus, Job } from '@/types';

interface JobCardProps {
  job: Job;
  onStatusChange: (jobId: string, newStatus: ApplicationStatus) => void;
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: 'Candidatado',
  [ApplicationStatus.WAITING_REPLY]: 'Aguardando',
  [ApplicationStatus.INTERVIEW]: 'Entrevista',
  [ApplicationStatus.TECHNICAL_TEST]: 'Teste Técnico',
  [ApplicationStatus.OFFER_RECEIVED]: 'Proposta',
  [ApplicationStatus.REJECTED]: 'Recusado',
};

export function JobCard({ job, onStatusChange }: JobCardProps) {
  const dateStr = typeof job.appliedDate === 'string' 
    ? job.appliedDate.split('T')[0] 
    : new Date(job.appliedDate).toISOString().split('T')[0];

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3">
        <h4 className="font-semibold text-slate-800 text-sm mb-1 truncate">{job.title}</h4>
        <p className="text-slate-500 text-[11px] truncate uppercase tracking-tight">{job.company?.name || 'Empresa desconhecida'}</p>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-medium">
          {dateStr}
        </span>
        {job.expectedSalary && (
          <span className="text-[10px] text-emerald-600 font-bold">
            R$ {job.expectedSalary.toLocaleString('pt-BR')}
          </span>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100">
        <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">Mover para:</label>
        <select 
          value={job.status}
          onChange={(e) => onStatusChange(job.id, e.target.value as ApplicationStatus)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-600 outline-none focus:border-blue-400 transition-colors cursor-pointer"
        >
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <option key={status} value={status}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
