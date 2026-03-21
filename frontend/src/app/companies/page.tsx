'use client';
import { useState, useEffect, useCallback } from 'react';
import { Company } from '@/types';
import { getCompanies, createCompany } from '@/services/api';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    const data = await getCompanies();
    setCompanies(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    setSubmitting(true);
    const result = await createCompany({ 
      name, 
      website: website.trim() || null 
    });
    
    if (result) {
      setName('');
      setWebsite('');
      await loadCompanies();
    } else {
      alert('Erro ao cadastrar empresa.');
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Empresas</h1>
        <p className="text-slate-500 mt-2">Cadastre e gerencie as empresas do seu radar.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Nova Empresa</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Google, Nubank..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex-1 space-y-1 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Website (opcional)</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold transition-all shadow-md shadow-blue-100 disabled:opacity-50 h-[42px]"
          >
            {submitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Lista de Empresas</h2>
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map((company) => (
              <div key={company.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all flex justify-between items-center group">
                <div>
                  <h3 className="font-bold text-slate-800">{company.name}</h3>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {company.id.substring(0, 8)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500">Nenhuma empresa cadastrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
