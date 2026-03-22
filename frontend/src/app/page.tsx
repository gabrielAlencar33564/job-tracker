"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardService, JobService } from "@/services";
import { DashboardStats, Job, ApplicationStatus } from "@/types";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { JobBoardsVolumeChart } from "@/components/dashboard/JobBoardsVolumeChart";
import { JobBoardsConversionTable } from "@/components/dashboard/JobBoardsConversionTable";
import { PageHeader, Button } from "@/components/common";
import {
  Briefcase,
  Send,
  MessageSquare,
  XCircle,
  Clock,
  ArrowRight,
  PlusCircle,
  BarChart3,
  Globe,
  PieChart as PieChartIcon,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [statsData, jobsData] = await Promise.all([
      DashboardService.getDashboardStats(),
      JobService.getJobs(),
    ]);

    setStats(statsData);
    // Sort by creation date and take first 3
    const sortedJobs = [...jobsData]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    setRecentJobs(sortedJobs);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const interviewsCount =
    stats?.statusCounts.find((s) => s.status === ApplicationStatus.INTERVIEW)?.count || 0;
  const rejectedCount =
    stats?.statusCounts.find((s) => s.status === ApplicationStatus.REJECTED)?.count || 0;
  const inProgressCount = stats?.totalJobs ? stats.totalJobs - rejectedCount : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <PageHeader
        title="Dashboard de Métricas"
        subtitle="Acompanhe seu progresso na busca por oportunidades."
        icon={<BarChart3 size={32} />}
        actions={
          <Link href="/jobs/new">
            <Button icon={<PlusCircle size={20} />}>Nova Candidatura</Button>
          </Link>
        }
      />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Candidaturas"
          value={stats?.totalJobs || 0}
          icon={Briefcase}
          description="Total de vagas cadastradas"
          colorClassName="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Em Processo"
          value={inProgressCount}
          icon={Send}
          description="Vagas não recusadas"
          colorClassName="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Entrevistas"
          value={interviewsCount}
          icon={MessageSquare}
          description="Total de etapas de conversa"
          colorClassName="text-violet-600 bg-violet-50"
        />
        <StatCard
          title="Recusadas"
          value={rejectedCount}
          icon={XCircle}
          description="Candidaturas finalizadas"
          colorClassName="text-rose-600 bg-rose-50"
        />
      </div>

      {/* Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <PieChartIcon size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Distribuição por Status</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Clock size={14} />
              Tempo Real
            </div>
          </div>
          <StatusChart data={stats?.statusCounts || []} />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Recentes</h2>
            <Link
              href="/jobs"
              className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
            >
              Ver tudo
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-5">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="group p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all shadow-sm shadow-transparent hover:shadow-blue-500/5"
                >
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
                    {job.title}
                  </h4>
                  <p className="text-slate-500 text-[11px] mb-3 font-medium uppercase tracking-tight">
                    {job.company?.name || "Empresa"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-lg">
                      {job.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm italic">Nenhuma candidatura recente.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Board Metrics Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100"></div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Métricas de Origem</h2>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Volume by Job Board */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Vagas por Plataforma</h3>
                <p className="text-xs text-slate-500 font-medium">Onde você mais aplica</p>
              </div>
            </div>
            <JobBoardsVolumeChart data={stats?.jobBoardVolumeStats || []} />
          </div>

          {/* Conversion by Job Board */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <TrendingUpIcon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Eficiência de Conversão</h3>
                <p className="text-xs text-slate-500 font-medium">% de vagas que geram entrevistas</p>
              </div>
            </div>
            <JobBoardsConversionTable data={stats?.jobBoardConversionStats || []} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendingUpIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
