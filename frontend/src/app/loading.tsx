export default function Loading() {
  return (
    <div className="space-y-10 animate-pulse pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-slate-200 rounded-lg" />
            <div className="h-4 w-48 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="w-40 h-12 bg-slate-200 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-white border border-slate-100 rounded-2xl p-6 space-y-4"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-xl" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-6 w-12 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-100 bg-white border border-slate-100 rounded-3xl p-8" />
        <div className="h-100 bg-white border border-slate-100 rounded-3xl p-8" />
      </div>

      <div className="space-y-6">
        <div className="h-4 w-32 bg-slate-100 mx-auto rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-white border border-slate-100 rounded-3xl" />
          <div className="h-80 bg-white border border-slate-100 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
