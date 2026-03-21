import { ApplicationStatus, Job } from '@/types';
import { JobCard } from './JobCard';

interface KanbanColumnProps {
  title: string;
  jobs: Job[];
  onStatusChange: (jobId: string, newStatus: ApplicationStatus) => void;
}

export function KanbanColumn({ title, jobs, onStatusChange }: KanbanColumnProps) {
  return (
    <div className="flex flex-col flex-1 min-w-[300px] max-w-[350px] bg-slate-100/50 rounded-xl border border-slate-200/60 h-full p-3 group">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          {title}
          <span className="bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-full">
            {jobs.length}
          </span>
        </h3>
      </div>
      
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pr-1">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onStatusChange={onStatusChange} 
            />
          ))
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex items-center justify-center">
            <p className="text-xs text-slate-400 font-medium italic">Sem vagas nesta etapa</p>
          </div>
        )}
      </div>
    </div>
  );
}
