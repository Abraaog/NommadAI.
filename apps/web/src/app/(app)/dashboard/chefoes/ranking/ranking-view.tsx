"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, TrendingUp, Zap, Star, Crown, Sword, Target } from "lucide-react";

interface RankingViewProps {
  stats: any[];
  currentUser: any;
  leaderboard: any[];
}

export function RankingView({ stats, currentUser: defaultUser, leaderboard: defaultLeaderboard }: RankingViewProps) {
  const [activeFilter, setActiveFilter] = useState("Global");
  const filters = ["Global", "Local", "Sua Fase", "Semanal"];

  const IconMap: Record<string, any> = {
    Zap,
    Crown,
    Star,
    TrendingUp,
    Sword,
    Target
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap gap-3">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all backdrop-blur-md ${
                activeFilter === f 
                  ? "bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]" 
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Your Stats (4 Pilares) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = IconMap[stat.icon] || Zap;
          return (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              className={`p-6 rounded-2xl border backdrop-blur-md flex flex-col gap-3 relative overflow-hidden ${
                stat.highlight 
                  ? "bg-[#FFD700]/5 border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.05)]" 
                  : "bg-white/5 border-white/10"
              }`}
            >
              {stat.highlight && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 blur-[40px] rounded-full pointer-events-none" />
              )}
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 z-10">
                <Icon className={`w-4 h-4 ${stat.highlight ? "text-[#FFD700]" : "text-white/40"}`} />
                {stat.title}
              </div>
              <div className={`text-3xl md:text-4xl font-black tracking-tight z-10 ${stat.highlight ? "text-[#FFD700]" : "text-white"}`}>
                {stat.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <motion.div 
        key={activeFilter}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Top 5 - {activeFilter}</h2>
        
        <div className="bg-[#141416] border border-white/5 rounded-2xl p-2 flex flex-col gap-1">
          {defaultLeaderboard.map((user, idx) => (
            <div key={user.pos + user.name} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-8 text-center font-black text-lg ${idx < 3 ? "text-[#FFD700]" : "text-white/40"}`}>
                  #{user.pos}
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                   <User className="w-6 h-6 text-white/50" />
                </div>
                <div className="font-black text-white text-base tracking-tight uppercase italic">{user.name}</div>
              </div>
              <div className="font-black text-white/80 text-xl">{user.score}</div>
            </div>
          ))}
        </div>

        {/* Current User Fixed Row */}
        <div className="mt-2 p-5 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-between shadow-[0_0_30px_rgba(255,215,0,0.05)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-8 text-center font-black text-xl text-[#FFD700]">#{defaultUser.pos}</div>
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/20 flex items-center justify-center overflow-hidden border border-[#FFD700]/50 shrink-0">
              <User className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div className="font-black text-white text-base uppercase italic">{defaultUser.name}</div>
          </div>
          <div className="font-black text-[#FFD700] text-2xl relative z-10">{defaultUser.score}</div>
        </div>

        {/* AI Insight */}
        <div className="mt-4 flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center shrink-0 border border-[#FFD700]/30">
            <Zap className="w-5 h-5 text-[#FFD700]" />
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed pt-0.5">
            <strong className="text-[#FFD700] font-black uppercase tracking-widest block mb-1">Análise de Progresso</strong>
            O seu maior potencial de crescimento hoje está no pilar de <strong>Chefões</strong>. Invoque um novo desafio para acelerar sua subida no ranking global.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
