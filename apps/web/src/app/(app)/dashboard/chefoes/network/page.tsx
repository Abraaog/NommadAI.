"use client";

import { motion } from "framer-motion";
import { Share2, Users, Database, Globe } from "lucide-react";

export default function NetworkPage() {
  const categories = [
    { name: "Contratantes", count: 42, icon: Globe, color: "text-blue-400" },
    { name: "A&R / Labels", count: 18, icon: Database, color: "text-purple-400" },
    { name: "Artistas", count: 125, icon: Users, color: "text-[#FFD700]" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0F0F13] border border-white/5 rounded-2xl p-6 flex items-center gap-5 backdrop-blur-md"
          >
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${cat.color}`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">{cat.count}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{cat.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Network Visualization (Mock) */}
      <div className="bg-[#141416] border border-white/5 rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" className="overflow-visible">
             <circle cx="50%" cy="50%" r="80" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 4" />
             <circle cx="50%" cy="50%" r="160" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 4" />
             <circle cx="50%" cy="50%" r="240" stroke="white" strokeWidth="1" fill="none" strokeDasharray="4 4" />
          </svg>
        </div>

        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-[#FFD700] flex items-center justify-center text-black font-black text-xl shadow-[0_0_50px_rgba(255,215,0,0.4)] relative z-10"
        >
          VOCÊ
        </motion.div>

        {/* Floating contacts nodes */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute"
            style={{
              top: `${50 + 35 * Math.sin(i * (Math.PI / 6))}%`,
              left: `${50 + 35 * Math.cos(i * (Math.PI / 6))}%`,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white/60">
              ID
            </div>
          </motion.div>
        ))}

        <div className="absolute bottom-8 left-8 flex items-center gap-3 text-white/40">
           <Share2 className="w-4 h-4" />
           <span className="text-[10px] font-bold tracking-widest uppercase">Mapeamento de Influência em Tempo Real</span>
        </div>
      </div>
    </div>
  );
}
