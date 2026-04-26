import { Trophy, Coins } from "lucide-react";

export default function GamificationHeader() {
  return (
    <header className="h-20 border-b border-white/5 bg-[#0F0F13]/90 backdrop-blur-md px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
      
      {/* Left: Level & XP */}
      <div className="flex items-center gap-8">
        
        {/* Level Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFD700] rounded-lg flex items-center justify-center text-black font-black text-lg relative">
            14
            {/* Small check icon on top left */}
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#FFD700] border-2 border-[#0F0F13] rounded-full flex items-center justify-center">
               <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
          </div>
          <div>
            <div className="text-[9px] text-white/50 font-bold tracking-widest uppercase">
              Nível Atual
            </div>
            <div className="text-xs font-black text-white uppercase tracking-wider">
              Artista Ativo
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="w-64">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-white/50 font-bold tracking-widest uppercase">Experiência</span>
            <span className="text-[10px] font-mono font-bold text-[#FFD700]">2.450 / 3.000 XP</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#FFD700] rounded-full w-[81.6%]" />
          </div>
        </div>
      </div>

      {/* Right: Currency & Profile */}
      <div className="flex items-center gap-6">
        
        {/* NP Coins */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
          <Coins className="w-4 h-4 text-[#FFD700]" />
          <span className="text-xs font-mono font-bold text-[#FFD700]">1.250 NP</span>
        </div>

        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors">
          <Trophy className="w-4 h-4" />
        </button>

        <div className="h-8 w-px bg-white/10" />

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors">Vitor Nomad</div>
            <div className="text-[10px] text-white/40">@vitor_producer</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A1A1C] to-[#2A2A2E] border border-white/10 overflow-hidden flex items-center justify-center shadow-inner">
            <div className="w-full h-full bg-[url('https://i.pravatar.cc/150?u=a042581f4e29026024d')] bg-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all" />
          </div>
        </div>

      </div>
    </header>
  );
}
