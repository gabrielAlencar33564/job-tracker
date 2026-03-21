import { KanbanBoard } from "@/components/features/kanban/KanbanBoard";
import Link from "next/link";

export default function JobsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Vagas</h1>
          <p className="text-sm text-slate-500 mt-1">Acompanhe suas candidaturas no quadro Kanban</p>
        </div>
        <Link href="/jobs/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-200">
          Nova Vaga
        </Link>
      </div>

      <KanbanBoard />
    </div>
  );
}
