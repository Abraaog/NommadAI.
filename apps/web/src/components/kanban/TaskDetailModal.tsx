"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Target, Tag, Info, BarChart3, Trash2, CheckCircle2, Brain, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  columnId: string;
  title: string;
  source: string;
  tag?: string;
  insights?: string;
  metrics?: any;
  result?: string;
  relacaoMissaoId?: string | null;
  updatedAt?: string;
}

interface Mission {
  id: string;
  titulo: string;
}

interface Log {
  id: string;
  action: string;
  details: any;
  createdAt: string;
}

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onUpdate }: TaskDetailModalProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [isLoadingLogs, setIsLoadingLoadingLogs] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
      fetchMissions();
      setEditedTask(task);
    }
  }, [isOpen, task]);

  const fetchLogs = async () => {
    try {
      setIsLoadingLoadingLogs(true);
      const res = await fetch(`/api/kanban/logs?cardId=${task.id}`);
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingLoadingLogs(false);
    }
  };

  const fetchMissions = async () => {
    try {
      const res = await fetch('/api/missions');
      const data = await res.json();
      if (data.missions) setMissions(data.missions);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/kanban', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          titulo: editedTask.title,
          insights: editedTask.insights,
          resultado: editedTask.result,
          relacaoMissaoId: editedTask.relacaoMissaoId
        })
      });

      if (!res.ok) throw new Error("Erro ao salvar");
      toast.success("Alterações salvas!");
      setIsEditing(false);
      onUpdate();
      fetchLogs(); // Refresh history
    } catch (error) {
      toast.error("Erro ao salvar alterações");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta missão?")) return;
    try {
      const res = await fetch('/api/kanban', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id })
      });
      if (!res.ok) throw new Error("Erro ao excluir");
      toast.success("Missão removida");
      onClose();
      onUpdate();
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  const handleBreakdown = async () => {
    if (!task.relacaoMissaoId) return;
    
    try {
      setIsBreakingDown(true);
      const res = await fetch('/api/kanban/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: task.relacaoMissaoId })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no breakdown");

      // Create cards for each subtask
      for (const subtask of data.tasks) {
        await fetch('/api/kanban', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: subtask.titulo,
            tipo: subtask.tipo,
            coluna: 'em_desenvolvimento', // Start directly in progress
            source: 'Cérebro AI',
            tag: subtask.tag,
            relacaoMissaoId: task.relacaoMissaoId
          })
        });
      }

      toast.success(`${data.tasks.length} tarefas geradas com sucesso!`);
      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao decompor missão");
    } finally {
      setIsBreakingDown(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#0F0F13] border border-white/10 rounded-2xl w-full max-w-2xl h-[80vh] relative z-10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded">
                    {task.source}
                  </span>
                  {task.tag && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {task.tag}
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <input
                    value={editedTask.title}
                    onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="text-2xl font-black text-white bg-transparent border-b border-[#FFD700]/30 focus:border-[#FFD700] outline-none w-full"
                  />
                ) : (
                  <h2 className="text-2xl font-black text-white tracking-tight">{task.title}</h2>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDelete}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Detalhes / Edição */}
                <div className="space-y-6">
                  <section>
                    <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Target className="w-3 h-3" /> Missão Vinculada
                    </h4>
                    <div className="flex gap-2">
                      <select
                        disabled={!isEditing}
                        value={editedTask.relacaoMissaoId || ""}
                        onChange={e => setEditedTask({ ...editedTask, relacaoMissaoId: e.target.value || null })}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 disabled:opacity-50"
                      >
                        <option value="">Nenhuma missão vinculada</option>
                        {missions.map(m => (
                          <option key={m.id} value={m.id}>{m.titulo}</option>
                        ))}
                      </select>
                      
                      {task.relacaoMissaoId && !isEditing && (
                        <button
                          onClick={handleBreakdown}
                          disabled={isBreakingDown}
                          className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/30 p-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                          title="Decompor em tarefas menores com AI"
                        >
                          {isBreakingDown ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                        </button>
                      )}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Info className="w-3 h-3" /> Insights da AI
                    </h4>
                    {isEditing ? (
                      <textarea
                        value={editedTask.insights || ""}
                        onChange={e => setEditedTask({ ...editedTask, insights: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 min-h-[120px]"
                        placeholder="Adicione observações ou insights aqui..."
                      />
                    ) : (
                      <p className="text-white/70 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 italic">
                        {task.insights || "Nenhum insight registrado ainda. Use o Cérebro AI para analisar esta missão."}
                      </p>
                    )}
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <BarChart3 className="w-3 h-3" /> Resultado
                    </h4>
                    <div className="flex gap-2">
                      {['viralizou', 'normal', 'flopou'].map(res => (
                        <button
                          key={res}
                          disabled={!isEditing}
                          onClick={() => setEditedTask({ ...editedTask, result: res })}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            editedTask.result === res 
                              ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                              : 'bg-transparent border-white/5 text-white/20 hover:border-white/10'
                          }`}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Histórico */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col h-full min-h-[300px]">
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Histórico de Edições
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                    {isLoadingLogs ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 rounded-lg" />)}
                      </div>
                    ) : logs.length > 0 ? (
                      logs.map(log => (
                        <div key={log.id} className="border-l-2 border-[#FFD700]/20 pl-4 py-1">
                          <p className="text-[11px] text-white/80 font-bold mb-0.5">
                            {log.action === 'move' ? 'Movido para ' + log.details?.coluna?.new : 
                             log.action === 'create' ? 'Missão Criada' : 'Editado'}
                          </p>
                          <p className="text-[9px] text-white/40">
                            {new Date(log.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-white/10 italic text-xs">
                        Nenhum registro encontrado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 flex gap-3">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-[2] py-3 rounded-xl bg-[#FFD700] text-black font-black text-sm hover:bg-[#FFD700]/90 transition-colors shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                  >
                    Salvar Alterações
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
                >
                  Editar Detalhes
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
