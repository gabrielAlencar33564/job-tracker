"use client";

import { useEffect, useState, useCallback } from "react";
import { getDashboardStats, getJobs } from "@/services/api";
import { DashboardStats, Job, ApplicationStatus } from "@/types";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { 
  Briefcase, 
  Send, 
  MessageSquare, 
  XCircle, 
  Clock, 
  ArrowRight,
  PlusCircle
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [statsData, jobsData] = await Promise.all([
      getDashboardStats(),
      getJobs()
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

  const interviewsCount = stats?.statusCounts.find(s => s.status === ApplicationStatus.INTERVIEW)?.count || 0;
  const rejectedCount = stats?.statusCounts.find(s => s.status === ApplicationStatus.REJECTED)?.count || 0;
  const inProgressCount = stats?.totalJobs ? (stats.totalJobs - rejectedCount) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard de Métricas</h1>
          <p className="text-slate-500 font-medium mt-1">Acompanhe seu progresso na busca por oportunidades.</p>
        </div>
        <Link 
          href="/jobs/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
        >
          <PlusCircle size={20} />
          Nova Candidatura
        </Link>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Distribuição por Status</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={14} />
              Atualizado agora
            </div>
          </div>
          <StatusChart data={stats?.statusCounts || []} />
        </div>

        {/* Recent Jobs Column */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Recentes</h2>
            <Link href="/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">
              Ver tudo
              <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-5">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job.id} className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">{job.title}</h4>
                  <p className="text-slate-500 text-xs mb-3 font-medium">{job.company?.name || "Empresa"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500 uppercase tracking-tight">
                      {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                      {job.status.replace('_', ' ')}
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
    </div>
  );
}
