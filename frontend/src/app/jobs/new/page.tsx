"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Company, ApplicationStatus } from "@/types";
import { CompanyService, JobService } from "@/services";
import { PageHeader, Input, Select, Button } from "@/components/common";
import { Briefcase, ArrowLeft, Send, Link as LinkIcon, DollarSign } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      const data = await CompanyService.getCompanies();
      setCompanies(data);
      setLoading(false);
    }
    loadCompanies();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !link || !companyId) return;

    setSubmitting(true);
    const result = await JobService.createJob({
      title,
      link,
      expectedSalary: expectedSalary ? parseFloat(expectedSalary) : null,
      companyId,
      appliedDate: new Date().toISOString(),
      status: ApplicationStatus.APPLIED,
    });

    if (result) {
      router.push("/jobs");
    } else {
      alert("Erro ao cadastrar vaga.");
    }
    setSubmitting(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Nova Vaga"
        subtitle="Adicione uma nova oportunidade ao seu radar."
        icon={<Briefcase size={32} />}
        actions={
          <Link href="/jobs">
            <Button variant="ghost" icon={<ArrowLeft size={18} />}>
              Voltar ao Kanban
            </Button>
          </Link>
        }
      />

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Briefcase size={120} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <Input
                label="Título da Vaga"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Senior Frontend Engineer"
                required
                className="text-lg"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Link da Candidatura"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://linkedin.com/jobs/..."
                required
                icon={<LinkIcon size={18} />}
              />
            </div>

            <Input
              label="Salário Esperado (Opcional)"
              type="number"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              placeholder="Ex: 15000"
              icon={<DollarSign size={18} />}
            />

            <Select
              label="Empresa Vinculada"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              options={companies.map((c) => ({ value: c.id, label: c.name }))}
              disabled={loading}
            />
          </div>

          <div className="pt-6 flex justify-end border-t border-slate-100">
            <Button
              type="submit"
              isLoading={submitting}
              disabled={loading || !companyId}
              size="lg"
              className="w-full md:w-auto min-w-50"
              icon={<Send size={20} />}
            >
              Cadastrar Vaga
            </Button>
          </div>
        </form>
      </div>

      {!loading && companies.length === 0 && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4 text-amber-800 shadow-sm">
          <div className="bg-amber-100 p-2 rounded-xl">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-sm font-bold leading-none mb-1">Empresa não encontrada</p>
            <p className="text-xs font-medium opacity-80">
              Você precisa cadastrar uma{" "}
              <Link
                href="/companies"
                className="underline font-black hover:text-amber-950 transition-colors"
              >
                empresa
              </Link>{" "}
              antes de adicionar uma vaga.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
