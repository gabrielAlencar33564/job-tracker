/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useCallback } from "react";
import { Company } from "@/types";
import { CompanyService } from "@/services";
import { Trash2, Globe, Building2 } from "lucide-react";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    const data = await CompanyService.getCompanies();
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
    const result = await CompanyService.createCompany({
      name,
      website: website.trim() || null,
    });

    if (result) {
      setName("");
      setWebsite("");
      await loadCompanies();
    } else {
      alert("Erro ao cadastrar empresa.");
    }
    setSubmitting(false);
  }

  const handleDeleteClick = (company: Company) => {
    setCompanyToDelete(company);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;

    // Optimistic Update
    const previousCompanies = [...companies];
    setCompanies(companies.filter((c) => c.id !== companyToDelete.id));

    const success = await CompanyService.deleteCompany(companyToDelete.id);

    if (!success) {
      setCompanies(previousCompanies);
      alert("Erro ao excluir empresa. Tente novamente.");
    }

    setCompanyToDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
          <Building2 size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Empresas
          </h1>
          <p className="text-slate-500 font-medium">
            Gerencie seu radar de empresas e oportunidades.
          </p>
        </div>
      </header>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Cadastrar Nova Empresa
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end"
        >
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Nome da Organização
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Google, Nubank, Stripe..."
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Website Oficial
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                <Globe size={18} />
              </div>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://suaempresa.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Empresas Monitoradas
            <span className="bg-slate-100 text-slate-500 text-[10px] px-2.5 py-1 rounded-full font-black uppercase">
              {companies.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
              />
            ))}
          </div>
        ) : companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h3>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 mt-0.5"
                      >
                        <Globe size={12} />
                        {company.website.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                        Sem website cadastrado
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteClick(company)}
                  className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="Excluir Empresa"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
              <Building2 size={32} />
            </div>
            <p className="text-slate-500 font-medium">Nenhuma empresa no radar ainda.</p>
            <p className="text-slate-400 text-sm mt-1">
              Comece cadastrando uma nova empresa acima.
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Empresa?"
        description={`Atenção: Ao excluir a empresa "${companyToDelete?.name}", todas as vagas associadas a ela também serão removidas permanentemente. Esta ação não pode ser desfeita.`}
        confirmText="Excluir Permanentemente"
      />
    </div>
  );
}
