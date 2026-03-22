"use client";

import { useState, useEffect, useCallback } from "react";
import { Company } from "@/types";
import { CompanyService } from "@/services";
import { Trash2, Globe, Building2, Plus } from "lucide-react";
import { PageHeader, Input, Button, ConfirmModal } from "@/components/common";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
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
      <PageHeader
        title="Empresas"
        subtitle="Gerencie seu radar de empresas e oportunidades."
        icon={<Building2 size={32} />}
      />

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Cadastrar Nova Empresa</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end"
        >
          <div className="md:col-span-5">
            <Input
              label="Nome da Organização"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Google, Nubank, Stripe..."
              required
            />
          </div>
          <div className="md:col-span-5">
            <Input
              label="Website Oficial"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://suaempresa.com"
              icon={<Globe size={18} />}
            />
          </div>
          <div className="md:col-span-2">
            <Button
              type="submit"
              isLoading={submitting}
              className="w-full h-12.5"
              icon={<Plus size={20} />}
            >
              Salvar
            </Button>
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

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(company)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                  title="Excluir Empresa"
                >
                  <Trash2 size={20} />
                </Button>
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
