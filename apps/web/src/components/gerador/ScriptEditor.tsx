"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Script {
  id: string;
  gancho: string | null;
  introducao: string | null;
  desenvolvimento: string | null;
  encerramento: string | null;
}

interface ScriptEditorProps {
  script: Script;
  onClose: () => void;
  onSaveToKanban: (scriptId: string) => Promise<void>;
}

export function ScriptEditor({ script, onClose, onSaveToKanban }: ScriptEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveToKanban(script.id);
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar no Kanban:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#1A1A1C] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Roteiro Aprofundado</h2>
              <p className="text-white/40 text-xs uppercase tracking-widest font-medium">Refinado por IA</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-8">
          <section>
            <label className="text-[10px] uppercase tracking-widest font-black text-[#FFD700] mb-3 block">01. O Gancho (Hook)</label>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-white/80 leading-relaxed italic">
              "{script.gancho}"
            </div>
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-3 block">02. Introdução</label>
            <p className="text-white/70 leading-relaxed">
              {script.introducao}
            </p>
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-3 block">03. Desenvolvimento</label>
            <p className="text-white/70 leading-relaxed">
              {script.desenvolvimento}
            </p>
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 mb-3 block">04. Conclusão / CTA</label>
            <p className="text-white/70 leading-relaxed font-bold text-[#FFD700]">
              {script.encerramento}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/5 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
          >
            Editar Manualmente
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving || saved}
            className={`flex-[2] px-6 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${
              saved 
                ? "bg-green-500 text-white" 
                : "bg-[#FFD700] text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,215,0,0.2)]"
            }`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : saved ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                SALVO NO KANBAN
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                MOVER PARA O KANBAN
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
