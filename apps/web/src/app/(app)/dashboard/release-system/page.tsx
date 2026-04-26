"use client";

import { useState, useEffect } from "react";
import { Star, Rocket, Music, Calendar, Plus, X, Loader2, ChevronRight, CheckCircle2 } from "lucide-react";
import { calculateTimeline, TimelinePhase } from "@/lib/timeline";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GlassCard } from "@/components/ui/glass-card";

interface Release {
  id: string;
  titulo: string;
  tipo: string;
  releaseDate: string | null;
  status: string;
  timeline: Record<string, unknown> | null;
}

export default function ReleaseSystemPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("single");
  const [newDate, setNewDate] = useState("");

  async function fetchReleases() {
    try {
      const res = await fetch("/api/releases");
      const data = await res.json();
      if (data.releases) {
        setReleases(data.releases);
        if (data.releases.length > 0 && !selectedRelease) {
          setSelectedRelease(data.releases[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching releases:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReleases();
  }, []);

  async function handleCreateRelease(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: newTitle,
          tipo: newType,
          releaseDate: new Date(newDate).toISOString(),
          status: "planning",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReleases([data.release, ...releases]);
        setSelectedRelease(data.release);
        setIsModalOpen(false);
        setNewTitle("");
        setNewDate("");
      }
    } catch (error) {
      console.error("Error creating release:", error);
    } finally {
      setIsCreating(false);
    }
  }

  const timelinePhases = selectedRelease?.releaseDate 
    ? calculateTimeline(new Date(selectedRelease.releaseDate))
    : [];

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto w-full min-h-screen">
      {/* Page Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
            <span className="text-[10px] font-bold tracking-widest text-[#FFD700] uppercase">
              Exclusivo NOMMAD AI<span className="text-white">.</span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Release <span className="text-[#FFD700]">System</span>
          </h1>
          <p className="text-sm text-white/50">
            Timeline automática de lançamento: teaser → pré-save → drop → pós.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold text-sm px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
        >
          <Plus className="w-4 h-4" /> Novo release
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
        </div>
      ) : releases.length > 0 ? (
        <div className="space-y-12">
          {/* Release Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {releases.map((release) => (
              <button
                key={release.id}
                onClick={() => setSelectedRelease(release)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedRelease?.id === release.id
                    ? "bg-[#FFD700] border-[#FFD700] text-black"
                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                }`}
              >
                {release.titulo}
              </button>
            ))}
          </div>

          {/* Active Timeline */}
          {selectedRelease && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-[10px] font-bold uppercase tracking-widest">
                  {selectedRelease.tipo}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedRelease.titulo}
                </h2>
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-xs text-white/40">
                  Data de Lançamento: {selectedRelease.releaseDate ? format(new Date(selectedRelease.releaseDate), "dd 'de' MMMM", { locale: ptBR }) : "Não definida"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {timelinePhases.map((phase) => (
                  <div 
                    key={phase.id}
                    className="bg-[#141416] border border-white/5 rounded-xl p-5 hover:border-[#FFD700]/30 transition-colors relative group"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                        Fase {phase.id}
                      </span>
                      <span className="text-[10px] font-bold text-[#FFD700]">
                        {phase.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{phase.title}</h3>
                    <p className="text-[10px] text-[#FFD700]/80 mb-3 font-medium uppercase tracking-tighter">
                      {format(phase.date, "dd/MM/yyyy")}
                    </p>
                    <p className="text-xs text-white/50 leading-relaxed">{phase.description}</p>
                    
                    {/* Progress Indicator Mockup */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[9px] text-white/30 uppercase font-bold">Status</span>
                       <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                          <span className="text-[9px] text-white/40 font-bold">Pendente</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Area */}
              <div className="bg-[#141416] border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-[#FFD700]/10 rounded-xl flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Pronto para o drop?</h4>
                    <p className="text-xs text-white/40">O sistema monitora suas metas e ajusta a timeline conforme seu progresso.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors">
                    Gerenciar Tarefas
                  </button>
                  <button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold text-xs px-5 py-2.5 rounded-lg transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                    Ver no Calendário
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State Area */
        <div className="bg-[#141416] border border-white/5 rounded-2xl p-12 md:p-20 flex flex-col items-center justify-center text-center shadow-inner mt-4">
          <div className="w-16 h-16 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-2xl flex items-center justify-center mb-6">
            <Rocket className="w-8 h-8 text-[#FFD700]" />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-3">
            Nenhum release em andamento
          </h2>
          <p className="text-sm text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
            Cadastre sua próxima faixa / EP. O sistema cria os cards de conteúdo no Kanban e agenda as peças no calendário automaticamente.
          </p>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold text-sm px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
          >
            <Music className="w-4 h-4" /> Começar Agora
          </button>
        </div>
      )}

      {/* Modal - Novo Release */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-[#141416] border border-white/10 w-full max-w-md rounded-2xl p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-white mb-6">Novo <span className="text-[#FFD700]">Release</span></h2>

            <form onSubmit={handleCreateRelease} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Título do Lançamento</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: Máquina de Ansiedade"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Tipo</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors appearance-none"
                  >
                    <option value="single">Single</option>
                    <option value="ep">EP</option>
                    <option value="album">Álbum</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Data de Drop</label>
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]/50 transition-colors [color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-[#FFD700] disabled:opacity-50 hover:bg-[#FFD700]/90 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                >
                  {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Rocket className="w-5 h-5" /> Ativar Timeline</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
