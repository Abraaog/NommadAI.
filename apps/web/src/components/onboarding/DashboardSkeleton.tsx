"use client";

import { GlassCard } from "../ui/GlassCard";
import { LayoutDashboard, Users, Music, TrendingUp, Calendar, Settings } from "lucide-react";

export const DashboardSkeleton = () => {
  return (
    <div className="w-full h-screen bg-background p-6 flex gap-6 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full glass rounded-3xl p-6 hidden lg:flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-black">N</div>
          <span className="text-white font-bold tracking-tighter">NOMMAD AI<span className="text-primary">.</span></span>
        </div>
        <nav className="space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Music, label: "Projetos" },
            { icon: TrendingUp, label: "Analytics" },
            { icon: Calendar, label: "Lançamentos" },
            { icon: Users, label: "Comunidade" },
            { icon: Settings, label: "Configurações" },
          ].map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-default",
                item.active ? "bg-primary text-black font-bold" : "text-white/40"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-6">
        <header className="flex justify-between items-center">
          <div className="h-10 w-48 bg-white/5 rounded-xl border border-white/10" />
          <div className="flex gap-4">
            <div className="h-10 w-10 bg-white/5 rounded-full border border-white/10" />
            <div className="h-10 w-32 bg-white/5 rounded-xl border border-white/10" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="h-32 opacity-30" hover={false} />
          <GlassCard className="h-32 opacity-30" hover={false} />
          <GlassCard className="h-32 opacity-30" hover={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
          <GlassCard className="lg:col-span-2 opacity-20" hover={false} />
          <GlassCard className="opacity-20" hover={false} />
        </div>
      </main>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
