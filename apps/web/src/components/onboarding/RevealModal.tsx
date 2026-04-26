"use client";

import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { Sparkles, Trophy, Target, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export const RevealModal = ({ classification }: { classification?: any }) => {
  const stageMap: Record<string, { title: string; color: string }> = {
    iniciante: { title: "Rising Talent", color: "text-blue-400" },
    intermediario: { title: "High Potential", color: "text-yellow-500" },
    avancado: { title: "Elite Standard", color: "text-red-500" },
  };

  const stage = classification?.nivel || "intermediario";
  const { title, color } = stageMap[stage] || stageMap.intermediario;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="w-full max-w-2xl relative"
      >
        <div className="absolute -inset-4 bg-yellow-500/10 blur-3xl rounded-[3rem] -z-10" />

        <GlassCard className="p-10 text-center space-y-8 border-yellow-500/20" hover={false}>
          <div className="mx-auto w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center relative border border-yellow-500/20">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-yellow-500/30 rounded-full"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-[0.3em]">Diagnóstico Concluído</h2>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              Seu Perfil é <br />
              <span className={`${color}`}>{title}.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
              {classification?.justificativa_curta || "Nossa IA analisou seu perfil e identificou uma base sólida para escala imediata."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-8">
            <div className="space-y-1">
              <div className="text-2xl font-black text-yellow-500">{classification?.confronto || "3"}/5</div>
              <div className="text-[10px] text-white/40 uppercase font-bold">Nível Confronto</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-white capitalize">{stage}</div>
              <div className="text-[10px] text-white/40 uppercase font-bold">Categoria</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-yellow-500">READY</div>
              <div className="text-[10px] text-white/40 uppercase font-bold">Status</div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Link href="/dashboard" className="w-full">
              <Button size="lg" className="w-full py-8 text-xl bg-yellow-500 text-black hover:bg-yellow-400 font-black" glow>
                ENTRAR NO DASHBOARD <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <p className="text-xs text-white/30">
              Acesso liberado ao seu novo Sistema Operacional Artístico.
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
