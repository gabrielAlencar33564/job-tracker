export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold text-slate-700">Painel de Candidaturas</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">v1.0.0</span>
        </div>
      </div>
    </header>
  );
}
