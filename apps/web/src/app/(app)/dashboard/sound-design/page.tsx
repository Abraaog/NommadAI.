"use client";

import { motion } from "framer-motion";
import { Activity, Headphones, PlayCircle, Plus } from "lucide-react";

export default function SoundDesignPage() {
  return (
    <div className="min-h-full p-8 md:p-12 pb-32 max-w-7xl mx-auto w-full flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
          Engenharia & Sound Design
        </h1>
        <p className="text-white/60 text-lg">
          Seu cofre de presets e identidade de mixagem.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Coluna Esquerda: Textual */}
        <div className="flex flex-col gap-6">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-[#FFD700]" />
              </div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-white/80">Groove & Bateria</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] mt-2 shrink-0" />
                <span className="text-white/70 text-sm leading-relaxed">
                  <strong className="text-white block">Kicks curtos e secos</strong>
                  Fundamental tail muito curto, focado no punch.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700] mt-2 shrink-0" />
                <span className="text-white/70 text-sm leading-relaxed">
                  <strong className="text-white block">Hi-hats com swing de 16ths</strong>
                  Velocity dinâmico acentuado nos contratempos.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                <span className="text-white/70 text-sm leading-relaxed">
                  <strong className="text-white block">Percussão Orgânica</strong>
                  Claps sobrepostos com snap acoustics.
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl flex items-center justify-center">
                <Headphones className="w-5 h-5 text-[#FFD700]" />
              </div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-white/80">Sintetizadores Base</h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2 text-white/80">
                <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                Serum
              </div>
              <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2 text-white/80">
                <span className="w-2 h-2 rounded-full bg-[#FFD700]" />
                Diva
              </div>
              <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2 text-white/80">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                Moog Sub37
              </div>
              <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg text-sm flex items-center gap-2 text-white/80">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                Vital
              </div>
            </div>
          </motion.div>
        </div>

        {/* Coluna Direita: Espectro */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-8 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#FFD700]" />
              </div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-white/80">Faixa Ideal</h2>
            </div>
            <div className="text-[10px] font-mono text-white/40">PRO-Q SIMULATION</div>
          </div>

          {/* Gráfico Espectral (Mock) */}
          <div className="flex-1 relative border border-white/5 bg-black/50 rounded-lg overflow-hidden flex items-end">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-[0.03]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border-r border-t border-white" />
              ))}
            </div>

            {/* Curva EQ */}
            <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path 
                d="M 0 80 Q 20 80, 30 20 T 60 70 T 90 40 T 100 40" 
                fill="none" 
                stroke="#FFD700" 
                strokeWidth="0.5" 
                vectorEffect="non-scaling-stroke"
              />
              <path 
                d="M 0 100 L 0 80 Q 20 80, 30 20 T 60 70 T 90 40 T 100 40 L 100 100 Z" 
                fill="url(#eqGlow)" 
                opacity="0.2"
              />
              <defs>
                <linearGradient id="eqGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Frequency Labels */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-[9px] font-mono text-white/20">
              <span>20Hz</span>
              <span>100Hz</span>
              <span>1kHz</span>
              <span>10kHz</span>
              <span>20kHz</span>
            </div>
          </div>

          <div className="mt-8 z-10 flex justify-end">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#FFD700] text-black font-bold text-sm px-6 py-3 rounded-lg flex items-center justify-center transition-shadow hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] gap-2"
            >
              <Plus className="w-4 h-4" />
              Analisar Nova Track
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
