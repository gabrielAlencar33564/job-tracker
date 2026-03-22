import Link from 'next/link';
import { LayoutDashboard, Briefcase, Building2, LayoutGrid } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col p-4 fixed left-0 top-0">
      <div className="mb-8 p-2">
        <h1 className="text-xl font-bold text-blue-400">Job Tracker</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <Link 
          href="/" 
          className="p-3 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-3 font-medium text-slate-300 hover:text-white"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link 
          href="/jobs" 
          className="p-3 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-3 font-medium text-slate-300 hover:text-white"
        >
          <Briefcase size={20} />
          <span>Vagas</span>
        </Link>
        <Link 
          href="/companies" 
          className="p-3 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-3 font-medium text-slate-300 hover:text-white"
        >
          <Building2 size={20} />
          <span>Empresas</span>
        </Link>
        <Link 
          href="/job-boards" 
          className="p-3 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-3 font-medium text-slate-300 hover:text-white"
        >
          <LayoutGrid size={20} />
          <span>Plataformas</span>
        </Link>
      </nav>
    </aside>
  );
}
