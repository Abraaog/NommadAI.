"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, XCircle, Zap, Plus, Sword, Target, Trophy, Info } from "lucide-react";
import { createBossChallengeAction, submitBossProofAction, getActiveBossesAction } from "@/lib/actions/bosses";

type BossCase = {
  id: string;
  bossId: string;
  status: 'aberto' | 'vencido' | 'parcial' | 'falha';
  provas: any; // Definição do desafio
  result: string | null;
  feedback: string | null;
  xpAwarded: number;
  abertoEm: string | Date | null;
  atualizadoEm: string | Date | null;
};

export default function AtivosPage() {
  const [bosses, setBosses] = useState<BossCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBoss, setSelectedBoss] = useState<BossCase | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofText, setProofText] = useState("");
  const [submissionState, setSubmissionState] = useState<"idle" | "analyzing" | "success" | "partial" | "failure">("idle");
  const [feedbackResult, setFeedbackResult] = useState<{ analysis: any; feedback: string } | null>(null);

  const fetchBosses = async () => {
    try {
      const data = await getActiveBossesAction();
      setBosses(data as any);
    } catch (err) {
      console.error("Failed to fetch bosses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBosses();
  }, []);

  const handleGenerateChallenge = async () => {
    setIsGenerating(true);
    try {
      await createBossChallengeAction();
      await fetchBosses();
    } catch (err) {
      console.error("Error generating challenge", err);
      alert("Falha ao invocar novo Chefão. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedBoss || !proofText.trim()) return;
    setSubmissionState("analyzing");
    
    try {
      const result = await submitBossProofAction(selectedBoss.id, proofText);
      setFeedbackResult({
        analysis: result.analysis,
        feedback: result.feedback
      });
      setSubmissionState(result.analysis.resultado as any);
      await fetchBosses();
    } catch (err) {
      console.error("Submission failed", err);
      setSubmissionState("idle");
      alert("Erro ao processar prova. Verifique sua conexão.");
    }
  };

  const closeModal = () => {
    setSelectedBoss(null);
    setTimeout(() => {
      setProofText("");
      setSubmissionState("idle");
      setFeedbackResult(null);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Chefões Ativos</h2>
          <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">
            {bosses.length} DESAFIOS DO MUNDO REAL EM ANDAMENTO
          </p>
        </div>
        <button 
          onClick={handleGenerateChallenge}
          disabled={isGenerating}
          className="shrink-0 bg-[#FFD700] text-black px-10 py-4 rounded-full font-black text-xs tracking-[0.15em] shadow-[0_0_40px_rgba(255,215,0,0.2)] hover:shadow-[0_0_60px_rgba(255,215,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sword className="w-4 h-4" />
          )}
          INVOCAR CHEFÃO
        </button>
      </div>

      {/* Boss Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bosses.map((boss) => {
          const challenge = boss.provas;
          return (
            <motion.div
              key={boss.id}
              layoutId={boss.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedBoss(boss)}
              className="group relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
              
              <div className="relative bg-[#0F0F13] border border-white/5 rounded-[2rem] p-6 overflow-hidden h-full flex flex-col group-hover:border-[#FFD700]/30 transition-all">
                {/* Boss Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                    challenge.categoria === 'mercado' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                    challenge.categoria === 'audiencia' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                    challenge.categoria === 'networking' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                    'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  }`}>
                    {challenge.categoria}
                  </div>
                  <div className="text-[10px] font-bold text-white/20">
                    NÍVEL: {challenge.dificuldade.toUpperCase()}
                  </div>
                </div>

                {/* Boss Title */}
                <h3 className="text-xl font-black text-white group-hover:text-[#FFD700] transition-colors uppercase leading-tight mb-3">
                  {challenge.titulo}
                </h3>

                <p className="text-white/40 text-xs leading-relaxed mb-6 flex-1 line-clamp-3">
                  {challenge.descricao}
                </p>

                {/* Rewards / Meta */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-[#FFD700]" />
                    <span className="text-[10px] font-black text-white tracking-widest uppercase">
                      {challenge.dificuldade === 'facil' ? '150' : challenge.dificuldade === 'medio' ? '250' : '400'} XP
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/20 group-hover:text-[#FFD700] transition-colors">
                    <span className="text-[9px] font-black tracking-widest uppercase">Enfrentar</span>
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {bosses.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
            <Target className="w-12 h-12 text-white/10 mb-4" />
            <p className="text-white/40 font-bold tracking-widest uppercase text-center max-w-xs">
              Nenhum Chefão ativo no seu território no momento.
            </p>
          </div>
        )}
      </div>

      {/* Battle / Submission Modal */}
      <AnimatePresence>
        {selectedBoss && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />

            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0F0F13] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-[#FFD700]/5 to-transparent">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-[9px] font-black tracking-[0.2em] uppercase rounded-full">
                      DESAFIO ATIVO
                    </span>
                    <span className="text-white/20 text-[9px] font-bold tracking-widest uppercase">
                      ID: {selectedBoss.id.slice(0, 8)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    {selectedBoss.provas.titulo}
                  </h3>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                  {/* Left: Challenge Details */}
                  <div className="lg:col-span-2 flex flex-col gap-8">
                    <section>
                      <h4 className="text-[10px] font-black text-[#FFD700] tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                        <Info className="w-3 h-3" /> A MISSÃO
                      </h4>
                      <p className="text-white/80 text-sm leading-relaxed font-medium">
                        {selectedBoss.provas.descricao}
                      </p>
                    </section>

                    <section className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <h4 className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase mb-4">CRITÉRIO DE VITÓRIA</h4>
                      <p className="text-white/60 text-xs italic leading-relaxed">
                        "{selectedBoss.provas.criterio_validacao}"
                      </p>
                    </section>

                    <div className="flex items-center gap-6 mt-auto">
                      <div>
                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">XP POTENCIAL</div>
                        <div className="text-xl font-black text-[#FFD700]">
                          +{selectedBoss.provas.dificuldade === 'facil' ? '150' : selectedBoss.provas.dificuldade === 'medio' ? '250' : '400'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">STATUS</div>
                        <div className="text-xl font-black text-blue-400 uppercase">{selectedBoss.status}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Submission Area */}
                  <div className="lg:col-span-3 flex flex-col">
                    <AnimatePresence mode="wait">
                      {submissionState === "idle" && (
                        <motion.div 
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col gap-6 h-full"
                        >
                          <div className="flex flex-col gap-3 flex-1">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex justify-between">
                              <span>PROVA DE EVIDÊNCIA (CHAT / LINK)</span>
                              <span className={proofText.length > 0 ? "text-[#FFD700]" : ""}>
                                {proofText.length} caracteres
                              </span>
                            </label>
                            <textarea 
                              rows={10}
                              value={proofText}
                              onChange={(e) => setProofText(e.target.value)}
                              placeholder="Cole aqui a transcrição da sua conversa, e-mail ou link que prove sua conquista..."
                              className="w-full flex-1 bg-black/40 border border-white/10 rounded-3xl p-6 text-white placeholder-white/20 focus:outline-none focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 transition-all resize-none text-sm leading-relaxed"
                            />
                          </div>
                          <button 
                            onClick={handleSubmitProof}
                            disabled={!proofText.trim() || proofText.length < 10}
                            className="w-full py-5 rounded-full bg-[#FFD700] text-black font-black text-sm hover:bg-[#FFD700]/90 transition-all hover:-translate-y-1 shadow-[0_20px_40px_rgba(255,215,0,0.2)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                          >
                            <Target className="w-5 h-5" /> Submeter para o Boss
                          </button>
                        </motion.div>
                      )}

                      {submissionState === "analyzing" && (
                        <motion.div 
                          key="analyzing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full min-h-[400px] flex flex-col items-center justify-center gap-6"
                        >
                          <div className="relative">
                            <div className="w-20 h-20 border-4 border-white/5 border-t-[#FFD700] rounded-full animate-spin" />
                            <Sword className="absolute inset-0 m-auto w-8 h-8 text-[#FFD700] animate-pulse" />
                          </div>
                          <div className="text-center">
                            <p className="text-white font-black text-lg tracking-widest uppercase mb-2">Analisando Evidência...</p>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">O Agente Master está validando seu movimento</p>
                          </div>
                        </motion.div>
                      )}

                      {(submissionState === "success" || submissionState === "partial" || submissionState === "failure") && feedbackResult && (
                        <motion.div 
                          key="result"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="h-full flex flex-col"
                        >
                          <div className={`p-8 rounded-[2rem] border h-full flex flex-col ${
                            submissionState === 'success' ? 'bg-[#00FF66]/5 border-[#00FF66]/20' :
                            submissionState === 'partial' ? 'bg-[#FF9900]/5 border-[#FF9900]/20' :
                            'bg-[#FF3333]/5 border-[#FF3333]/20'
                          }`}>
                            <div className="flex items-center gap-4 mb-8">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                submissionState === 'success' ? 'bg-[#00FF66]/10 text-[#00FF66]' :
                                submissionState === 'partial' ? 'bg-[#FF9900]/10 text-[#FF9900]' :
                                'bg-[#FF3333]/10 text-[#FF3333]'
                              }`}>
                                {submissionState === 'success' ? <Trophy className="w-8 h-8" /> :
                                 submissionState === 'partial' ? <AlertTriangle className="w-8 h-8" /> :
                                 <XCircle className="w-8 h-8" />}
                              </div>
                              <div>
                                <h4 className={`font-black text-2xl uppercase tracking-tighter italic ${
                                  submissionState === 'success' ? 'text-[#00FF66]' :
                                  submissionState === 'partial' ? 'text-[#FF9900]' :
                                  'text-[#FF3333]'
                                }`}>
                                  {submissionState === 'success' ? 'VITÓRIA CONFIRMADA' : 
                                   submissionState === 'partial' ? 'AVANÇO PARCIAL' : 'FALHA NO MOVIMENTO'}
                                </h4>
                                <p className="text-white/30 text-[10px] font-black tracking-widest uppercase">VEREDITO DO BOSS</p>
                              </div>
                            </div>

                            <div className="flex-1 bg-black/40 rounded-2xl p-6 border border-white/5 mb-8 overflow-y-auto max-h-[300px]">
                              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap italic">
                                {feedbackResult.feedback.replace(/\*\*/g, '')}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">XP CONCEDIDO</div>
                                <div className="text-xl font-black text-white">+{feedbackResult.analysis.xp}</div>
                              </div>
                              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">PILAR</div>
                                <div className="text-xl font-black text-white uppercase">{selectedBoss.provas.categoria}</div>
                              </div>
                            </div>

                            <button 
                              onClick={closeModal}
                              className="w-full py-5 rounded-full bg-white/10 text-white font-black text-sm hover:bg-white/20 transition-all uppercase tracking-[0.2em] border border-white/10"
                            >
                              Finalizar Sessão de Combate
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
