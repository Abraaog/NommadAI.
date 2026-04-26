"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Target, Fingerprint, Briefcase, Zap, Calendar, Palette, 
  Kanban, Brain, Trophy, Headphones, Rocket, TrendingUp, 
  BookOpen, Settings, SlidersHorizontal, Award 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Estratégia", icon: Target, href: "/dashboard/estrategia" },
    { name: "Minha Marca", icon: Fingerprint, href: "/dashboard/minha-marca" },
    { name: "Meu Negócio", icon: Briefcase, href: "/dashboard/meu-negocio" },
    { name: "Gerador", icon: Zap, href: "/dashboard/gerador" },
    { name: "Calendário", icon: Calendar, href: "/dashboard/calendario" },
    { name: "Design", icon: Palette, href: "/dashboard/design" },
    { name: "Kanban", icon: Kanban, href: "/dashboard/kanban" },
    { name: "Cérebro", icon: Brain, href: "/dashboard/cerebro" },
    { name: "Chefões", icon: Trophy, href: "/dashboard/chefoes", star: true },
    { name: "Sound Design", icon: Headphones, href: "/dashboard/sound-design", star: true },
    { name: "Release System", icon: Rocket, href: "/dashboard/release-system", star: true },
    { name: "Classificador AI", icon: Zap, href: "/dashboard/classificador", star: true },
    { name: "Ranking", icon: Award, href: "/dashboard/ranking", star: true },
    { name: "Evolução", icon: TrendingUp, href: "#" },
    { name: "Guia de Uso", icon: BookOpen, href: "/dashboard/guia" },
    { name: "Configurações", icon: Settings, href: "/dashboard/configuracoes" },
  ];

  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-[#0F0F13] flex flex-col shrink-0 overflow-y-auto no-scrollbar">
      {/* Logo */}
      <div className="p-6 sticky top-0 bg-[#0F0F13] z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FFD700] rounded-md flex items-center justify-center text-black font-black text-sm">
            N
          </div>
          <div>
            <div className="font-black text-lg tracking-tighter text-white leading-none">
              NOMMAD AI<span className="text-[#FFD700]">.</span>
            </div>
            <div className="text-[10px] text-[#FFD700] font-bold tracking-widest uppercase mt-1">
              Artist OS
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-6 space-y-1">
        {menuItems.map((item, idx) => {
          const isItemActive = item.href !== "#" && pathname.startsWith(item.href);
          
          return (
            <Link 
              key={idx} 
              href={item.href}
              className={`
                flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isItemActive 
                  ? 'bg-white/5 text-[#FFD700] border-l-2 border-[#FFD700]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${isItemActive ? 'text-[#FFD700]' : 'text-white/40'}`} />
                <span>{item.name}</span>
              </div>
            {item.star && (
              <div className="w-4 h-4 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full" />
              </div>
            )}
          </Link>
          );
        })}
      </nav>

      {/* Footer Settings Button */}
      <div className="p-4 sticky bottom-0 bg-[#0F0F13] z-10 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-left">
          <SlidersHorizontal className="w-5 h-5 text-white/40 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white/90 truncate">Ajustes do Sistema</div>
            <div className="text-[9px] font-mono text-white/40 mt-0.5">V2.92-STABLE</div>
          </div>
        </button>
      </div>
    </aside>
  );
}
