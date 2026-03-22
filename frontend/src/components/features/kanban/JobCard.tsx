import { useState } from "react";
import { Job } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { JobNotesModal } from "../JobNotesModal";
import { MessageSquare } from "lucide-react";

interface JobCardProps {
  job: Job;
  isOverlay?: boolean;
}

export function JobCard({ job, isOverlay = false }: JobCardProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);

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

  const handleCardClick = (e: React.MouseEvent) => {
    // Check if the click was not part of a drag operation
    // If it's a simple click, open the modal
    if (!isOverlay && !isDragging) {
      setIsNotesOpen(true);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(isOverlay ? {} : attributes)}
        {...(isOverlay ? {} : listeners)}
        onClick={handleCardClick}
        className={baseClasses}
      >
        <div className="mb-3">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-slate-800 text-sm mb-1 truncate flex-1 pr-2">
              {job.title}
            </h4>
            {job._count && job._count.notes > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-black text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-md">
                <MessageSquare size={10} />
                {job._count.notes}
              </div>
            )}
          </div>
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

      {!isOverlay && (
        <JobNotesModal
          isOpen={isNotesOpen}
          onClose={() => setIsNotesOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
        />
      )}
    </>
  );
}
