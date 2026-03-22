"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Send, Calendar, Clock } from "lucide-react";
import { NoteService } from "@/services";
import { Note } from "@/types";
import { Button, Textarea } from "@/components/common";

interface JobNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

export function JobNotesModal({ isOpen, onClose, jobId, jobTitle }: JobNotesModalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    const data = await NoteService.getNotesByJob(jobId);
    setNotes(data);
    setLoading(false);
  }, [jobId]);

  useEffect(() => {
    if (isOpen) {
      loadNotes();
      setNewNote("");
    }
  }, [isOpen, loadNotes]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !jobId) return;

    setSubmitting(true);

    const result = await NoteService.createNote(jobId, newNote.trim());

    if (result) {
      setNewNote("");
      setNotes((prev) => [result, ...prev]);
    } else {
      alert("Erro ao salvar anotação.");
    }
    setSubmitting(false);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    Anotações
                  </h3>
                  <p className="text-sm text-slate-500 font-medium truncate max-w-75">
                    {jobTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {/* Form */}
              <form onSubmit={handleCreateNote} className="space-y-3">
                <Textarea
                  placeholder="Escreva uma nova anotação sobre esta vaga..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="text-sm"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    isLoading={submitting}
                    disabled={!newNote.trim()}
                    icon={<Send size={18} />}
                    size="sm"
                  >
                    Adicionar Nota
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  Histórico de Notas
                  <span className="h-px flex-1 bg-slate-100"></span>
                </h4>

                {loading && notes.length === 0 ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : notes.length > 0 ? (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-white hover:border-blue-100 transition-all"
                      >
                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                          {note.content}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-slate-300" />
                            {formatDate(note.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-300" />
                            {formatTime(note.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm font-medium italic">
                      Nenhuma anotação ainda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
