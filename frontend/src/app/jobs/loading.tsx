export default function Loading() {
  return (
    <div className="flex flex-col h-full animate-pulse space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-64 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="w-32 h-10 bg-slate-200 rounded-xl" />
      </div>

      <div className="flex flex-col md:flex-row items-end gap-4 bg-white p-5 rounded-2xl border border-slate-100">
        <div className="flex-1 h-12 bg-slate-50 rounded-xl" />
        <div className="w-full md:w-64 h-12 bg-slate-50 rounded-xl" />
      </div>

      <div className="flex gap-6 overflow-hidden flex-1 pb-10">
        {[1, 2, 3, 4, 5, 6].map((col) => (
          <div key={col} className="shrink-0 w-80 space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded mb-6" />
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="h-32 bg-white border border-slate-100 rounded-xl p-4 space-y-3"
              >
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
                <div className="h-3 w-1/2 bg-slate-50 rounded" />
                <div className="flex justify-between pt-4">
                  <div className="h-4 w-16 bg-slate-50 rounded-full" />
                  <div className="h-4 w-12 bg-slate-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
