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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-white border border-slate-100 rounded-2xl p-6 space-y-4"
            >
              <div className="flex justify-between">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="w-4 h-4 bg-slate-50 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
