"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Settings, BarChart2, Brain } from "lucide-react";

import { BrainChat } from "@/components/dashboard/BrainChat";

// Importando dinamicamente o gráfico pois ele manipula Canvas/DOM (sem SSR)
const BrainGraph = dynamic(() => import("@/components/dashboard/BrainGraph"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-t-2 border-[#FFD700] animate-spin" />
        <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Carregando Sinapses...</span>
      </div>
    </div>
  ),
});

export default function CerebroPage() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#0F0F13]">
      {/* Container do Gráfico (Fica por trás) */}
      <div className="absolute inset-0 z-0">
        <BrainGraph />
      </div>

      {/* Header Sobreposto (Glassmorphism) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6 md:p-8 pointer-events-none"
      >
        <div className="inline-flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#FFD700]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight pointer-events-auto">
              Mapa de Ideias
            </h1>
          </div>
          <p className="text-white/50 text-sm pointer-events-auto">
            Como suas teses e roteiros se conectam na engine.
          </p>
        </div>
      </motion.div>

      {/* Chat Flutuante */}
      <BrainChat context="brain_map" />
    </div>
  );
}
