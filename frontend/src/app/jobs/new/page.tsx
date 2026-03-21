'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Company, ApplicationStatus } from '@/types';
import { getCompanies, createJob } from '@/services/api';
import Link from 'next/link';

export default function NewJobPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      const data = await getCompanies();
      setCompanies(data);
      setLoading(false);
    }
    loadCompanies();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !link || !companyId) return;

    setSubmitting(true);
    const result = await createJob({
      title,
      link,
      expectedSalary: expectedSalary ? parseFloat(expectedSalary) : null,
      companyId,
      appliedDate: new Date().toISOString(),
      status: ApplicationStatus.APPLIED,
    });

    if (result) {
      router.push('/');
    } else {
      alert('Erro ao cadastrar vaga.');
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nova Vaga</h1>
        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          Cancelar
        </Link>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Título da Vaga</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Senior Frontend Engineer"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Link da Vaga</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://linkedin.com/jobs/..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Salário Esperado</label>
              <input
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="Ex: 15000"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Empresa</label>
              {loading ? (
                <div className="h-[52px] bg-slate-100 animate-pulse rounded-2xl"></div>
              ) : (
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="">Selecione uma empresa</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || loading || !companyId}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-[0.98]"
            >
              {submitting ? 'Cadastrando...' : 'Cadastrar Vaga'}
            </button>
          </div>
        </form>
      </div>

      {!loading && companies.length === 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-700">
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-medium">Você precisa cadastrar uma <Link href="/companies" className="underline font-bold">empresa</Link> primeiro.</p>
        </div>
      )}
    </div>
  );
}
