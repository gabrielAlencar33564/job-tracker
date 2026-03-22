"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ApplicationStatus, Job, Company } from "@/types";
import { KanbanColumn } from "./KanbanColumn";
import { JobService, CompanyService } from "@/services";
import { JobCard } from "./JobCard";
import { Input, Select } from "@/components/common";
import { Search, X } from "lucide-react";
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobsData, companiesData] = await Promise.all([
        JobService.getJobs(),
        CompanyService.getCompanies(),
      ]);
      setJobs(jobsData);
      setCompanies(companiesData);
    } catch (err) {
      setError("Erro ao carregar dados. Certifique-se que o backend está rodando.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCompany = selectedCompany ? job.companyId === selectedCompany : true;

      return matchesSearch && matchesCompany;
    });
  }, [jobs, searchTerm, selectedCompany]);

  const activeJob = useMemo(
    () => jobs.find((j) => j.id === activeId) || null,
    [activeId, jobs],
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCompany("");
  };

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

    const isOverColumn = Object.values(ApplicationStatus).includes(
      overId as ApplicationStatus,
    );
    const overJobObj = jobs.find((j) => j.id === overId);
    const targetStatus = (
      isOverColumn ? overId : overJobObj?.status
    ) as ApplicationStatus;

    if (!targetStatus) return;

    const previousJobs = [...jobs];

    const targetColumnJobs = jobs
      .filter((j) => j.status === targetStatus && j.id !== currentActiveId)
      .sort((a, b) => a.order - b.order);

    let newIndex = 0;
    if (isOverColumn) {
      newIndex = targetColumnJobs.length;
    } else {
      newIndex = targetColumnJobs.findIndex((j) => j.id === overId);
    }

    const finalTargetColumn = [...targetColumnJobs];
    finalTargetColumn.splice(newIndex, 0, { ...activeJobObj, status: targetStatus });

    const updates: { id: string; status: ApplicationStatus; order: number }[] = [];

    finalTargetColumn.forEach((j, index) => {
      updates.push({ id: j.id, status: targetStatus, order: index });
    });

    const sourceStatus = activeJobObj.status;
    if (sourceStatus !== targetStatus) {
      const sourceColumnJobs = jobs
        .filter((j) => j.status === sourceStatus && j.id !== currentActiveId)
        .sort((a, b) => a.order - b.order);

      sourceColumnJobs.forEach((j, index) => {
        updates.push({ id: j.id, status: sourceStatus, order: index });
      });
    }

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
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row items-end gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 w-full">
          <Input
            label="Pesquisar Vagas"
            placeholder="Título da vaga ou nome da empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            label="Filtrar por Empresa"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            options={[
              { value: "", label: "Todas as Empresas" },
              ...companies.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>
        {(searchTerm || selectedCompany) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all h-12.5"
          >
            <X size={18} />
            Limpar
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-6 overflow-x-auto pb-10 -mx-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex-1">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.status}
              id={column.status}
              title={column.title}
              jobs={filteredJobs
                .filter((job) => job.status === column.status)
                .sort((a, b) => a.order - b.order)}
            />
          ))}
        </div>

        <DragOverlay adjustScale={false}>
          {activeJob ? <JobCard job={activeJob} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
