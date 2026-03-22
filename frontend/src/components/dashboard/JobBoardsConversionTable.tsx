"use client";

import { JobBoardConversionStat } from "@/types";
import { TrendingUp, MessageSquare } from "lucide-react";

interface JobBoardsConversionTableProps {
  data: JobBoardConversionStat[];
}

export function JobBoardsConversionTable({ data }: JobBoardsConversionTableProps) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 italic text-sm">
        Sem dados de conversão.
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="py-3 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plataforma</th>
            <th className="py-3 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Vagas</th>
            <th className="py-3 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Conversão</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr key={item.jobBoardId || 'null'} className="group hover:bg-slate-50/50 transition-colors">
              <td className="py-4 px-2">
                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {item.jobBoardName}
                </span>
              </td>
              <td className="py-4 px-2 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-600">{item.totalJobs}</span>
                  <div className="flex items-center gap-1 mt-0.5 text-[9px] font-medium text-slate-400">
                    <MessageSquare size={10} />
                    {item.interviewJobs} entrevistas
                  </div>
                </div>
              </td>
              <td className="py-4 px-2 text-right">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <TrendingUp size={12} />
                  <span className="text-xs font-black">{item.conversionRate.toFixed(1)}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
