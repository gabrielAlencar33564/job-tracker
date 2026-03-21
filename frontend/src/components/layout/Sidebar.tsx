import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col p-4 fixed left-0 top-0">
      <div className="mb-8 p-2">
        <h1 className="text-xl font-bold text-blue-400">Job Tracker</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <Link 
          href="/" 
          className="p-3 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>Dashboard</span>
        </Link>
        <Link 
          href="/jobs" 
          className="p-3 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>Vagas</span>
        </Link>
        <Link 
          href="/companies" 
          className="p-3 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>Empresas</span>
        </Link>
      </nav>
    </aside>
  );
}
