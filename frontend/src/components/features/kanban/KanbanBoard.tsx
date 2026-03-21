"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ApplicationStatus, Job } from "@/types";
import { KanbanColumn } from "./KanbanColumn";
import { JobService } from "@/services";
import { JobCard } from "./JobCard";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";

const COLUMNS = [
  { status: ApplicationStatus.APPLIED, title: "Candidatado" },
  { status: ApplicationStatus.WAITING_REPLY, title: "Aguardando" },
  { status: ApplicationStatus.INTERVIEW, title: "Entrevista" },
  { status: ApplicationStatus.TECHNICAL_TEST, title: "Teste Técnico" },
  { status: ApplicationStatus.OFFER_RECEIVED, title: "Proposta" },
  { status: ApplicationStatus.REJECTED, title: "Recusado" },
];

export function KanbanBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const loadJobs = useCallback(async () => {
    try {
      const data = await JobService.getJobs();
      setJobs(data);
    } catch (err) {
      setError("Erro ao carregar as vagas. Certifique-se que o backend está rodando.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const activeJob = useMemo(
    () => jobs.find((j) => j.id === activeId) || null,
    [activeId, jobs],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeJobObj = jobs.find((j) => j.id === activeId);
    if (!activeJobObj) return;

    const isOverColumn = Object.values(ApplicationStatus).includes(
      overId as ApplicationStatus,
    );
    const overJobObj = jobs.find((j) => j.id === overId);

    const overContainer = (
      isOverColumn ? overId : overJobObj?.status
    ) as ApplicationStatus;
    const activeContainer = activeJobObj.status;

    if (!overContainer || overContainer === activeContainer) return;

    setJobs((prev) => {
      const activeIndex = prev.findIndex((j) => j.id === activeId);

      const updatedJobs = [...prev];
      updatedJobs[activeIndex] = {
        ...updatedJobs[activeIndex],
        status: overContainer,
      };

      return updatedJobs;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const currentActiveId = active.id as string;
    setActiveId(null);

    if (!over) return;

    const overId = over.id as string;
    const activeJobObj = jobs.find((j) => j.id === currentActiveId);
    if (!activeJobObj) return;

    // Determine target status
    const isOverColumn = Object.values(ApplicationStatus).includes(
      overId as ApplicationStatus,
    );
    const overJobObj = jobs.find((j) => j.id === overId);
    const targetStatus = (
      isOverColumn ? overId : overJobObj?.status
    ) as ApplicationStatus;

    if (!targetStatus) return;

    const previousJobs = [...jobs];

    // We need to find where the item should be placed in the target column
    const targetColumnJobs = jobs
      .filter((j) => j.status === targetStatus && j.id !== currentActiveId)
      .sort((a, b) => a.order - b.order);

    let newIndex = 0;
    if (isOverColumn) {
      newIndex = targetColumnJobs.length;
    } else {
      newIndex = targetColumnJobs.findIndex((j) => j.id === overId);
      // If we are dropping below an item, we might want to increment index
      // but arrayMove handles this if we include the active item
    }

    // Create the updated target column list
    const finalTargetColumn = [...targetColumnJobs];
    finalTargetColumn.splice(newIndex, 0, { ...activeJobObj, status: targetStatus });

    const updates: { id: string; status: ApplicationStatus; order: number }[] = [];

    // Add updates for target column
    finalTargetColumn.forEach((j, index) => {
      updates.push({ id: j.id, status: targetStatus, order: index });
    });

    // If moved from another column, update that column's order too
    const sourceStatus = activeJobObj.status;
    if (sourceStatus !== targetStatus) {
      const sourceColumnJobs = jobs
        .filter((j) => j.status === sourceStatus && j.id !== currentActiveId)
        .sort((a, b) => a.order - b.order);

      sourceColumnJobs.forEach((j, index) => {
        updates.push({ id: j.id, status: sourceStatus, order: index });
      });
    }

    // Optimistic Update
    setJobs((prev) => {
      const newState = [...prev];
      updates.forEach((update) => {
        const idx = newState.findIndex((j) => j.id === update.id);
        if (idx !== -1) {
          newState[idx] = {
            ...newState[idx],
            status: update.status,
            order: update.order,
          };
        }
      });
      return newState;
    });

    try {
      const success = await JobService.reorderJobs(updates);
      if (!success) {
        setJobs(previousJobs);
        setError("Falha ao salvar a nova ordem.");
      }
    } catch (err) {
      console.error("Error reordering jobs:", err);
      setJobs(previousJobs);
      setError("Erro de conexão ao salvar.");
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {error}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="mt-8 flex gap-6 overflow-x-auto pb-10 -mx-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent h-full min-h-125">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.status}
            id={column.status}
            title={column.title}
            jobs={jobs
              .filter((job) => job.status === column.status)
              .sort((a, b) => a.order - b.order)}
          />
        ))}
      </div>

      <DragOverlay adjustScale={false}>
        {activeJob ? <JobCard job={activeJob} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
