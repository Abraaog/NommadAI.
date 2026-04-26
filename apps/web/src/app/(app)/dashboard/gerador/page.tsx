"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronDown, Wand2, X, Sparkles, Plus } from "lucide-react";
import { useState } from "react";
import { generateHooksAction, expandHookAction, saveToKanbanAction, discardHookAction } from "@/lib/actions/gerador";
import { ScriptEditor } from "@/components/gerador/ScriptEditor";

interface Hook {
  id: string;
  title: string;
  body: string;
  category: string;
}

export default function GeradorPage() {
  const [pilar, setPilar] = useState("Processo de Produção (Ableton)");
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanding, setIsExpanding] = useState<string | null>(null);
  const [activeScript, setActiveScript] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newHooks = await generateHooksAction(pilar);
      setHooks(newHooks);
    } catch (error) {
      console.error("Erro ao gerar hooks:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExpand = async (hookId: string, title: string) => {
    setIsExpanding(hookId);
    try {
      const script = await expandHookAction(hookId, title);
      setActiveScript(script);
    } catch (error) {
      console.error("Erro ao expandir hook:", error);
    } finally {
      setIsExpanding(null);
    }
  };

  const handleDiscard = async (hookId: string) => {
    try {
      await discardHookAction(hookId);
      setHooks(hooks.filter(h => h.id !== hookId));
    } catch (error) {
      console.error("Erro ao descartar hook:", error);
    }
  };

  const handleSaveToKanban = async (scriptId: string) => {
    await saveToKanbanAction(scriptId);
  };

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto w-full flex flex-col min-h-full">
      {/* Cabeçalho e Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4 mb-8">
          <Zap className="w-8 h-8 md:w-12 md:h-12 text-[#FFD700]" />
          Fábrica de Conteúdo
        </h1>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-auto flex-1 max-w-sm">
            <select 
              value={pilar}
              onChange={(e) => setPilar(e.target.value)}
              className="appearance-none w-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium px-4 py-3 pr-10 rounded-xl focus:outline-none focus:border-[#FFD700]/50 transition-colors cursor-pointer"
            >
              <option className="bg-[#1A1A1C] text-white">Processo de Produção (Ableton)</option>
              <option className="bg-[#1A1A1C] text-white">Vida de DJ (Tour/Gigs)</option>
              <option className="bg-[#1A1A1C] text-white">Mindset & Estratégia</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full md:w-auto bg-[#FFD700] hover:bg-[#FFD700]/90 disabled:opacity-50 text-black font-black text-sm px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.2)] min-w-[200px]"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            GERAR NOVOS HOOKS
          </button>
        </div>
      </motion.div>

      {/* Lista de Cards (Hooks) */}
      <div className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {hooks.length === 0 && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-white/10" />
              </div>
              <p className="text-white/40 font-medium text-center max-w-xs">
                Selecione um pilar acima e deixe a IA criar os melhores ganchos para seu conteúdo.
              </p>
            </motion.div>
          )}

          {hooks.map((hook, index) => (
            <motion.div
              key={hook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-white/10 transition-all shadow-xl"
            >
              {/* Tag Absoluta */}
              <div className="absolute top-6 right-6 bg-[#FFD700] text-black font-black text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase shadow-lg">
                Reels / TikTok
              </div>

              <h3 className="text-xl font-bold text-white mb-3 pr-24">{hook.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {hook.body}
              </p>

              {/* Ações */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                <button 
                  onClick={() => handleDiscard(hook.id)}
                  className="text-white/40 hover:text-red-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors group/btn"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-red-500/10">
                    <X className="w-4 h-4" />
                  </div>
                  Descartar
                </button>
                
                <button 
                  onClick={() => handleExpand(hook.id, hook.title)}
                  disabled={isExpanding === hook.id}
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-[0_5px_15px_rgba(255,215,0,0.15)] disabled:opacity-50"
                >
                  {isExpanding === hook.id ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Aprofundar AI
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal de Roteiro */}
      <AnimatePresence>
        {activeScript && (
          <ScriptEditor 
            script={activeScript} 
            onClose={() => setActiveScript(null)} 
            onSaveToKanban={handleSaveToKanban}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
