import { KanbanBoard } from "@/components/features/kanban/KanbanBoard";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidaturas</h1>
          <p className="text-slate-500 mt-1">Acompanhe e gerencie seus processos seletivos.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/companies" 
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            Empresas
          </Link>
          <Link 
            href="/jobs/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-100 active:scale-[0.98]"
          >
            Nova Vaga
          </Link>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <KanbanBoard />
      </main>
    </div>
  );
}
