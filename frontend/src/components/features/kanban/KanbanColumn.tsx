import { ApplicationStatus, Job } from '@/types';
import { JobCard } from './JobCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  id: ApplicationStatus;
  title: string;
  jobs: Job[];
}

export function KanbanColumn({ id, title, jobs }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col flex-1 min-w-[300px] max-w-[350px] bg-slate-100/50 rounded-xl border-2 transition-all h-full p-3 ${
        isOver ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200/60'
      }`}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
          {title}
          <span className="bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-full">
            {jobs.length}
          </span>
        </h3>
      </div>
      
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pr-1">
        <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
              />
            ))
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex items-center justify-center">
              <p className="text-xs text-slate-400 font-medium italic">Sem vagas nesta etapa</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
