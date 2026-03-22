import { Job } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface JobCardProps {
  job: Job;
  isOverlay?: boolean;
}

export function JobCard({ job, isOverlay = false }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: job.id,
      disabled: isOverlay,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? undefined : transition,
  };

  const dateStr =
    typeof job.appliedDate === "string"
      ? job.appliedDate.split("T")[0]
      : new Date(job.appliedDate).toISOString().split("T")[0];

  const baseClasses = `bg-white p-4 rounded-lg border border-slate-200 shadow-sm transition-all duration-200 ${
    isOverlay
      ? "shadow-2xl rotate-3 scale-105 cursor-grabbing border-blue-200"
      : "cursor-grab hover:border-blue-300"
  }`;

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-200/30 border-2 border-dashed border-slate-300 rounded-lg p-4 h-27.5 transition-all"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      className={baseClasses}
    >
      <div className="mb-3">
        <h4 className="font-semibold text-slate-800 text-sm mb-1 truncate">
          {job.title}
        </h4>
        <p className="text-slate-500 text-[11px] truncate uppercase tracking-tight">
          {job.company?.name || "Empresa desconhecida"}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-medium">
          {dateStr}
        </span>
        {job.expectedSalary && (
          <span className="text-[10px] text-emerald-600 font-bold">
            R$ {job.expectedSalary.toLocaleString("pt-BR")}
          </span>
        )}
      </div>
    </div>
  );
}
