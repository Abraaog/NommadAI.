"use client";

import { motion } from "framer-motion";
import { Flame, Fingerprint, Target, Activity, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface IdentityData {
  essencia: string;
  tesesCentrais: string[];
  tesesSecundarias: string[];
  dna: {
    executor: number;
    criativo: number;
    tecnico: number;
    analitico: number;
  };
}

export default function MinhaMarcaPage() {
  const [identity, setIdentity] = useState<IdentityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchIdentity(refresh = false) {
    try {
      if (refresh) setRefreshing(true);
      const res = await fetch(`/api/identity${refresh ? "?refresh=true" : ""}`);
      const data = await res.json();
      if (!data.error) {
        setIdentity(data);
      }
    } catch (err) {
      console.error("Failed to fetch identity:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchIdentity();
  }, []);

  // Helpers to calculate radar points (0-100 scale to SVG coordinates)
  // Center is 50,50. Max radius is 40.
  const getPoint = (score: number, axis: 'executor' | 'criativo' | 'tecnico' | 'analitico') => {
    const value = (score / 100) * 40;
    switch(axis) {
      case 'executor': return `50,${50 - value}`;
      case 'criativo': return `${50 + value},50`;
      case 'tecnico': return `50,${50 + value}`;
      case 'analitico': return `${50 - value},50`;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin" />
        <p className="text-white/50 animate-pulse font-mono uppercase tracking-widest text-xs">Sincronizando Identidade...</p>
      </div>
    );
  }

  const dna = identity?.dna || { executor: 50, criativo: 50, tecnico: 50, analitico: 50 };
  const radarPoints = `${getPoint(dna.executor, 'executor')} ${getPoint(dna.criativo, 'criativo')} ${getPoint(dna.tecnico, 'tecnico')} ${getPoint(dna.analitico, 'analitico')}`;

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col min-h-full">
      {/* Cabeçalho */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
            <Fingerprint className="w-8 h-8 md:w-12 md:h-12 text-[#FFD700]" />
            DNA Sonoro & Visual
          </h1>
          <p className="text-white/50 text-sm mt-3">Sua identidade consolidada. A base de todo o seu posicionamento.</p>
        </div>

        <button 
          onClick={() => fetchIdentity(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
          RECALIBRAR MARCA
        </button>
      </motion.div>

      {/* Grid de Conteúdo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Bloco 1: A Grande Tese */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden lg:col-span-2 flex flex-col justify-center"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700]/50 to-[#FFD700]/0" />
          <div className="flex items-center gap-3 mb-6 opacity-60">
            <Target className="w-5 h-5 text-white" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-white">A Grande Tese</h2>
          </div>
          <p className="text-xl md:text-3xl font-black text-white leading-snug">
            {identity?.tesesCentrais?.[0] ? (
              identity.tesesCentrais[0].split("**").map((part, i) => 
                i % 2 === 1 ? <span key={i} className="text-[#FFD700]">{part}</span> : part
              )
            ) : (
              "Sua tese principal está sendo processada..."
            )}
          </p>
        </motion.div>

        {/* Bloco 2: Inimigo Cultural */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center mb-6">
            <Flame className="w-6 h-6 text-red-500" />
          </div>
          
          <h2 className="text-xs font-bold tracking-widest uppercase text-red-400 mb-4">Inimigo Cultural</h2>
          <p className="text-white/80 text-sm leading-relaxed font-medium">
            {identity?.tesesSecundarias?.[0] || "Identificando seus bloqueios culturais..."}
          </p>
        </motion.div>

        {/* Bloco 3: Gráfico Radar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141416] backdrop-blur-md border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center justify-center lg:col-span-1 shadow-inner"
        >
          <div className="w-full flex items-center gap-3 mb-8 opacity-60">
            <Activity className="w-5 h-5 text-white" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-white">Mapeamento de DNA</h2>
          </div>

          <div className="relative w-48 h-48 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Eixos de Fundo */}
              <line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="50" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="50" y1="50" x2="50" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="50" y1="50" x2="10" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />

              {/* Teia de Fundo */}
              <polygon points="50,30 70,50 50,70 30,50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

              {/* O Radar (Preenchimento Amarelo) */}
              <motion.polygon 
                initial={{ points: "50,50 50,50 50,50 50,50" }}
                animate={{ points: radarPoints }}
                transition={{ duration: 1, ease: "easeOut" }}
                fill="rgba(255, 215, 0, 0.2)" 
                stroke="#FFD700" 
                strokeWidth="1.5" 
                className="drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
              />
              
              {/* Pontos nas vértices */}
              <circle cx="50" cy={50 - (dna.executor/100)*40} r="2" fill="#FFD700" />
              <circle cx={50 + (dna.criativo/100)*40} cy="50" r="2" fill="#FFD700" />
              <circle cx="50" cy={50 + (dna.tecnico/100)*40} r="2" fill="#FFD700" />
              <circle cx={50 - (dna.analitico/100)*40} cy="50" r="2" fill="#FFD700" />
            </svg>

            {/* Labels Absolutos */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white uppercase tracking-widest bg-[#0F0F13] px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
              Executor <span className="text-[#FFD700]">{dna.executor}%</span>
            </div>
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-widest bg-[#0F0F13] px-2 py-0.5 rounded-full border border-white/10 flex flex-col items-center">
              <span>Criativo</span>
              <span className="text-[#FFD700]">{dna.criativo}%</span>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white uppercase tracking-widest bg-[#0F0F13] px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
              Técnico <span className="text-[#FFD700]">{dna.tecnico}%</span>
            </div>
            <div className="absolute top-1/2 -left-8 -translate-y-1/2 text-[9px] font-bold text-white uppercase tracking-widest bg-[#0F0F13] px-2 py-0.5 rounded-full border border-white/10 flex flex-col items-center">
              <span>Analítico</span>
              <span className="text-[#FFD700]">{dna.analitico}%</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
