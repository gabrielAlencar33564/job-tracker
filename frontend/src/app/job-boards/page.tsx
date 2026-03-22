"use client";

import { useState, useEffect, useCallback } from "react";
import { JobBoard } from "@/types";
import { JobBoardService } from "@/services";
import { PageHeader, Input, Button } from "@/components/common";
import { Layout, Globe, Plus, ExternalLink, Pencil, X } from "lucide-react";

export default function JobBoardsPage() {
  const [jobBoards, setJobBoards] = useState<JobBoard[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [editingBoard, setEditingBoard] = useState<JobBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadJobBoards = useCallback(async () => {
    setLoading(true);
    const data = await JobBoardService.getJobBoards();
    setJobBoards(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadJobBoards();
  }, [loadJobBoards]);

  const handleEditClick = (board: JobBoard) => {
    setEditingBoard(board);
    setName(board.name);
    setUrl(board.url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBoard(null);
    setName("");
    setUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    setSubmitting(true);

    if (editingBoard) {
      const result = await JobBoardService.updateJobBoard(editingBoard.id, { name, url });
      if (result) {
        setJobBoards((prev) => prev.map((b) => (b.id === result.id ? result : b)));
        handleCancelEdit();
      } else {
        alert("Erro ao atualizar plataforma.");
      }
    } else {
      const result = await JobBoardService.createJobBoard({ name, url });
      if (result) {
        setName("");
        setUrl("");
        setJobBoards((prev) =>
          [...prev, result].sort((a, b) => a.name.localeCompare(b.name)),
        );
      } else {
        alert("Erro ao cadastrar plataforma.");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in duration-500">
      <PageHeader
        title="Plataformas de Vagas"
        subtitle="Gerencie os sites onde você costuma buscar suas oportunidades."
        icon={<Layout size={32} />}
      />

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          {editingBoard ? "Editar Plataforma" : "Adicionar Nova Plataforma"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-rows-2 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nome da Plataforma"
              placeholder="Ex: LinkedIn, Gupy, Indeed..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="URL da Plataforma"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              icon={<Globe size={18} />}
              required
            />
          </div>
          <div className="flex gap-2 ml-auto">
            {editingBoard && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
                className="w-full h-12.5"
                icon={<X size={20} />}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              isLoading={submitting}
              className="w-full h-12.5"
              icon={editingBoard ? <Pencil size={20} /> : <Plus size={20} />}
            >
              {editingBoard ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800">Minhas Fontes</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
              />
            ))}
          </div>
        ) : jobBoards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobBoards.map((board) => (
              <div
                key={board.id}
                className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between h-36 relative"
              >
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <Layout size={20} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(board)}
                      className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <a
                      href={board.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="Visitar Site"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                    {board.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-1">
                    {board.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">
              Nenhuma plataforma cadastrada ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
