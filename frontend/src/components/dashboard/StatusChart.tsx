"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { StatusCount, ApplicationStatus } from '@/types';

interface StatusChartProps {
  data: StatusCount[];
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: 'Candidatado',
  [ApplicationStatus.WAITING_REPLY]: 'Aguardando',
  [ApplicationStatus.INTERVIEW]: 'Entrevista',
  [ApplicationStatus.TECHNICAL_TEST]: 'Teste Técnico',
  [ApplicationStatus.OFFER_RECEIVED]: 'Proposta',
  [ApplicationStatus.REJECTED]: 'Recusado',
};

const COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: '#3b82f6', // blue-500
  [ApplicationStatus.WAITING_REPLY]: '#f59e0b', // amber-500
  [ApplicationStatus.INTERVIEW]: '#8b5cf6', // violet-500
  [ApplicationStatus.TECHNICAL_TEST]: '#ec4899', // pink-500
  [ApplicationStatus.OFFER_RECEIVED]: '#10b981', // emerald-500
  [ApplicationStatus.REJECTED]: '#ef4444', // red-500
};

export function StatusChart({ data }: StatusChartProps) {
  const chartData = data
    .filter(item => item.count > 0)
    .map(item => ({
      name: STATUS_LABELS[item.status],
      value: item.count,
      status: item.status
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 italic text-sm">
        Nenhum dado disponível para exibir o gráfico.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.status as ApplicationStatus]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend 
            verticalAlign="middle" 
            align="right" 
            layout="vertical"
            iconType="circle"
            formatter={(value) => <span className="text-slate-600 text-xs font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
