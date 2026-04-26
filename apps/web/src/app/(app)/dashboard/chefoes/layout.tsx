"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function ChefoesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Ativos", href: "/dashboard/chefoes/ativos" },
    { name: "Concluídos", href: "/dashboard/chefoes/concluidos" },
    { name: "Network", href: "/dashboard/chefoes/network" },
    { name: "Ranking", href: "/dashboard/chefoes/ranking" },
  ];

  return (
    <div className="min-h-full p-8 md:p-12 pb-32 max-w-7xl mx-auto w-full flex flex-col gap-10 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
            <span className="text-[10px] font-bold tracking-widest text-[#FFD700] uppercase">
              Dossiês da Carreira
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Seus Chefões
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl leading-relaxed">
            Cada contato real da sua carreira é um caso aberto. Cole a conversa, o sistema carimba o status e o Diogo aconselha o próximo movimento.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 w-max backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link 
              key={tab.href}
              href={tab.href}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.2)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
