"use client"

import { Search, Bell, User, MessageSquareCode } from "lucide-react"

export default function TopBar() {
  return (
    <header className="h-16 glass-topbar flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Buscar missões, arquivos ou estratégias..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/5 rounded-full transition-all relative">
          <MessageSquareCode className="w-5 h-5 text-neutral-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border border-black"></span>
        </button>
        <button className="p-2 hover:bg-white/5 rounded-full transition-all">
          <Bell className="w-5 h-5 text-neutral-400" />
        </button>
        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
        <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-white/5 rounded-full transition-all group">
          <div className="text-right">
            <p className="text-[10px] font-bold text-white leading-none">Abraão G.</p>
            <p className="text-[9px] text-amber-500/80 leading-none mt-1">Admin</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-neutral-500" />
          </div>
        </button>
      </div>
    </header>
  )
}
