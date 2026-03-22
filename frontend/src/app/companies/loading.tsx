export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-pulse">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg" />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 space-y-6">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5 h-12 bg-slate-50 rounded-xl" />
          <div className="md:col-span-5 h-12 bg-slate-50 rounded-xl" />
          <div className="md:col-span-2 h-12 bg-slate-200 rounded-xl" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-6 w-40 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-24 bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-slate-200 rounded" />
                <div className="h-3 w-1/3 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
