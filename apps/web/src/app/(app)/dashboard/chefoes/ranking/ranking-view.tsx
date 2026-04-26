"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, TrendingUp, Zap, Star, Crown } from "lucide-react";

interface RankingViewProps {
  stats: any[];
  currentUser: any;
  leaderboard: any[];
}

export function RankingView({ stats, currentUser: defaultUser, leaderboard: defaultLeaderboard }: RankingViewProps) {
  const [activeFilter, setActiveFilter] = useState("Sua Fase: Intermediário");
  const filters = ["Sua Fase: Intermediário", "Global", "Local", "Semanal"];

  const datasets: Record<string, { leaderboard: any[], currentUser: any, insight: string }> = {
    "Sua Fase: Intermediário": {
      leaderboard: defaultLeaderboard,
      currentUser: defaultUser,
      insight: "Você está à frente de 78% dos artistas na sua fase. Fechar um Chefão de Networking te colocaria no Top 3."
    },
    "Global": {
      leaderboard: [
        { pos: 1, name: "VINTAGE CULTURE", score: "15.420" },
        { pos: 2, name: "ALOK", score: "14.850" },
        { pos: 3, name: "ANNA", score: "13.900" },
        { pos: 4, name: "MOCHAKK", score: "12.700" },
        { pos: 5, name: "VICTOR LOU", score: "11.200" }
      ],
      currentUser: { pos: 4250, name: defaultUser.name, score: defaultUser.score },
      insight: "No ranking global, a consistência de lançamentos é o seu maior gargalo. Foque em fechar o próximo contrato de label."
    },
    "Local": {
      leaderboard: [
        { pos: 1, name: "DJ BRUNO", score: "3.200" },
        { pos: 2, name: "LUCAS BEATS", score: "2.850" },
        { pos: 3, name: "ANA FLOW", score: "2.100" },
        { pos: 4, name: "MARCO V", score: "1.950" },
        { pos: 5, name: "REBECA S", score: "1.700" }
      ],
      currentUser: { pos: 12, name: defaultUser.name, score: defaultUser.score },
      insight: "Você é o 12º em sua região. Mais 2 datas em clubs locais te colocam no Top 10."
    },
    "Semanal": {
      leaderboard: [
        { pos: 1, name: "KIKO", score: "+850" },
        { pos: 2, name: "TATI", score: "+720" },
        { pos: 3, name: "PEDRO P", score: "+610" },
        { pos: 4, name: "GABI M", score: "+450" },
        { pos: 5, name: "JEAN L", score: "+390" }
      ],
      currentUser: { pos: 25, name: defaultUser.name, score: "+120" },
      insight: "Esta semana você subiu 5 posições. Continue executando as tarefas diárias para manter o momentum."
    }
  };

  const currentData = datasets[activeFilter] || datasets["Sua Fase: Intermediário"];

  const IconMap: Record<string, any> = {
    Zap,
    Crown,
    Star,
    TrendingUp
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
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 z-10">
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
        <h2 className="text-xl font-bold text-white mb-2">Top 5 - {activeFilter}</h2>
        
        <div className="bg-[#141416] border border-white/5 rounded-2xl p-2 flex flex-col gap-1">
          {currentData.leaderboard.map((user, idx) => (
            <div key={user.pos + user.name} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-8 text-center font-black text-lg ${idx < 3 ? "text-[#FFD700]" : "text-white/40"}`}>
                  #{user.pos}
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                   <User className="w-6 h-6 text-white/50" />
                </div>
                <div className="font-bold text-white text-lg">{user.name}</div>
              </div>
              <div className="font-black text-white/80 text-xl">{user.score}</div>
            </div>
          ))}
        </div>

        {/* Current User Fixed Row */}
        <div className="mt-2 p-5 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700] flex items-center justify-between shadow-[0_0_30px_rgba(255,215,0,0.1)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-8 text-center font-black text-xl text-[#FFD700]">#{currentData.currentUser.pos}</div>
            <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center overflow-hidden border border-[#FFD700]/50 shrink-0">
              <User className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div className="font-bold text-white text-lg">{currentData.currentUser.name}</div>
          </div>
          <div className="font-black text-[#FFD700] text-2xl relative z-10">{currentData.currentUser.score}</div>
        </div>

        {/* AI Insight */}
        <div className="mt-4 flex items-start gap-4 p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center shrink-0 border border-[#FFD700]/30">
            <Zap className="w-5 h-5 text-[#FFD700]" />
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed pt-0.5">
            <strong className="text-white block mb-1">Insight da Inteligência:</strong>
            {currentData.insight}
          </p>
        </div>
      </motion.div>

    </div>
  );
}
