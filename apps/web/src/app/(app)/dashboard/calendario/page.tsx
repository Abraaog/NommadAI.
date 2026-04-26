"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock } from "lucide-react";

const daysOfWeek = [
  { name: "Seg", date: "15" },
  { name: "Ter", date: "16", isToday: true },
  { name: "Qua", date: "17" },
  { name: "Qui", date: "18" },
  { name: "Sex", date: "19" },
  { name: "Sáb", date: "20" },
  { name: "Dom", date: "21" },
];

export default function CalendarioPage() {
  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col min-h-full">
      {/* Cabeçalho da Página */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
      >
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-8 h-8 md:w-10 md:h-10 text-[#FFD700]" />
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Estratégia Semanal
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Navegação de Datas */}
          <div className="flex items-center gap-1 bg-[#141416] border border-white/10 rounded-lg p-1">
            <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 text-sm font-bold text-white hover:bg-white/5 rounded-md transition-colors">
              Hoje
            </button>
            <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Primário */}
          <button className="w-full sm:w-auto bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-black text-sm px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            <Plus className="w-4 h-4" />
            AGENDAR ROTEIRO
          </button>
        </div>
      </motion.div>

      {/* Grid do Calendário */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-[#141416]/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Cabeçalho dos Dias */}
        <div className="grid grid-cols-7 border-b border-white/5 bg-black/20">
          {daysOfWeek.map((day, idx) => (
            <div 
              key={idx} 
              className={`p-4 flex flex-col items-center justify-center border-r border-white/5 last:border-0 ${day.isToday ? 'bg-[#FFD700]/5' : ''}`}
            >
              <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${day.isToday ? 'text-[#FFD700]' : 'text-white/40'}`}>
                {day.name}
              </span>
              <span className={`text-xl font-black ${day.isToday ? 'text-[#FFD700]' : 'text-white'}`}>
                {day.date}
              </span>
            </div>
          ))}
        </div>

        {/* Corpo do Calendário (Colunas) */}
        <div className="grid grid-cols-7 flex-1 min-h-[500px]">
          {/* Segunda */}
          <div className="border-r border-white/5 p-2 md:p-4 space-y-3" />
          
          {/* Terça */}
          <div className="border-r border-white/5 p-2 md:p-4 space-y-3 bg-[#FFD700]/5">
            {/* Card 1: Agendado */}
            <motion.div 
              whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 border-l-[#FFD700] border-l-[3px] rounded-xl p-3 md:p-4 cursor-pointer transition-colors hover:bg-white/10 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-black bg-[#FFD700] px-2 py-0.5 rounded">
                  Agendado
                </span>
                <div className="flex items-center gap-1 text-white/40">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-mono">18:00</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Reels: Breakdown do Synth
              </h3>
            </motion.div>
          </div>

          {/* Quarta */}
          <div className="border-r border-white/5 p-2 md:p-4 space-y-3" />

          {/* Quinta */}
          <div className="border-r border-white/5 p-2 md:p-4 space-y-3">
            {/* Card 2: Rascunho */}
            <motion.div 
              whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 border-l-white/20 border-l-[3px] rounded-xl p-3 md:p-4 cursor-pointer transition-colors hover:bg-white/10 relative overflow-hidden opacity-80"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/10 px-2 py-0.5 rounded">
                  Rascunho
                </span>
                <div className="flex items-center gap-1 text-white/40">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-mono">12:00</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white/70 leading-tight">
                Carrossel: Filosofia de Palco
              </h3>
            </motion.div>
          </div>

          {/* Sexta */}
          <div className="border-r border-white/5 p-2 md:p-4 space-y-3" />

          {/* Sábado */}
          <div className="border-r border-white/5 p-2 md:p-4 space-y-3" />

          {/* Domingo */}
          <div className="p-2 md:p-4 space-y-3" />
        </div>
      </motion.div>
    </div>
  );
}
