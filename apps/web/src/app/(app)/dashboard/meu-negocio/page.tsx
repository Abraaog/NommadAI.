"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Music, TrendingUp, ChevronRight, CheckCircle2, Plus, Pencil, X, HelpCircle, Info, Sparkles, Target, Calendar, TrendingDown } from "lucide-react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";

type ColumnId = "ideias" | "agendado" | "publicado";

interface Gig {
  id: string;
  columnId: ColumnId;
  titulo: string;
  subtitulo?: string;
  tipo?: string;
}

interface DashboardStats {
  cacheMedio: number;
  gigsFechadas: number;
  propostasEnviadas: number;
  taxaConversao: number;
  diasSemGig: number | null;
  receitaPotencial: number;
  variacaoCache: number;
  pipeline: {
    ideias: number;
    agendado: number;
    publicado: number;
    gigs: Gig[];
  };
  recommendations: string[];
}

const COLUMNS: { id: ColumnId; title: string; color: string }[] = [
  { id: "ideias", title: "Ideias", color: "text-white/80" },
  { id: "agendado", title: "Agendado", color: "text-[#FFD700]" },
  { id: "publicado", title: "Publicado", color: "text-green-400" },
];

function SortableGigItem({ gig, onEdit }: { gig: Gig; onEdit: (g: Gig) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: gig.id, data: { type: "Gig", gig } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors ${
        gig.columnId === "publicado" ? "border-l-[4px] border-l-green-400" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h5 className="font-bold text-white text-base">{gig.titulo}</h5>
          <p className="text-white/50 text-xs mt-1">{gig.subtitulo}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(gig); }}
          className="p-1 text-white/30 hover:text-white/60"
        >
          <Pencil className="w-3 h-3" />
        </button>
      </div>
      {gig.columnId === "publicado" && <CheckCircle2 className="w-4 h-4 text-green-400 mt-2" />}
    </div>
  );
}

function Column({ column, gigs, onEdit }: { column: { id: ColumnId; title: string; color: string }; gigs: Gig[]; onEdit: (g: Gig) => void }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div ref={setNodeRef} className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-sm font-bold text-white/80">{column.title}</h4>
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
          column.id === 'ideias' ? 'text-white/30 bg-white/5' :
          column.id === 'agendado' ? 'text-[#FFD700] bg-[#FFD700]/10' :
          'text-green-400 bg-green-400/10'
        }`}>
          {gigs.length}
        </span>
      </div>
      <SortableContext items={gigs.map(g => g.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[100px] flex-1">
          {gigs.length > 0 ? (
            gigs.map((gig) => <SortableGigItem key={gig.id} gig={gig} onEdit={onEdit} />)
          ) : (
            <div className="flex-1 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs font-bold uppercase min-h-[80px]">
              Solte aqui
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function EditModal({ isOpen, onClose, stats, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  stats: DashboardStats;
  onSave: (s: Partial<DashboardStats>) => void;
}) {
  const [form, setForm] = useState({ cacheMedio: 0, gigsFechadas: 0, propostasEnviadas: 0 });

  useEffect(() => {
    if (isOpen) {
      setForm({
        cacheMedio: stats.cacheMedio,
        gigsFechadas: stats.gigsFechadas,
        propostasEnviadas: stats.propostasEnviadas,
      });
    }
  }, [isOpen, stats]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Editar Métricas</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
              Cachê Médio (R$)
            </label>
            <input
              type="number"
              value={form.cacheMedio}
              onChange={(e) => setForm({ ...form, cacheMedio: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
              Gigs Fechadas
            </label>
            <input
              type="number"
              value={form.gigsFechadas}
              onChange={(e) => setForm({ ...form, gigsFechadas: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
              Propostas Enviadas
            </label>
            <input
              type="number"
              value={form.propostasEnviadas}
              onChange={(e) => setForm({ ...form, propostasEnviadas: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 text-white/60 hover:text-white border border-white/10 rounded-lg">
            Cancelar
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-3 bg-[#FFD700] text-black font-bold rounded-lg"
          >
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function MeuNegocioPage() {
  const [stats, setStats] = useState<DashboardStats>({
    cacheMedio: 0,
    gigsFechadas: 0,
    propostasEnviadas: 0,
    taxaConversao: 0,
    diasSemGig: null,
    receitaPotencial: 0,
    variacaoCache: 0,
    pipeline: { ideias: 0, agendado: 0, publicado: 0, gigs: [] },
    recommendations: [],
  });
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [activeGig, setActiveGig] = useState<Gig | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/negocio');
        const data = await res.json();
        if (data.cacheMedio !== undefined) {
          setStats(data);
          setGigs(data.pipeline?.gigs || []);
        }
      } catch (err) {
        console.error('[negocio] fetch error', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleSave = async (newStats: Partial<DashboardStats>) => {
    try {
      const res = await fetch('/api/negocio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStats),
      });
      if (res.ok) {
        setStats(prev => ({ ...prev, ...newStats }));
      }
    } catch (err) {
      console.error('[negocio] save error', err);
    }
  };

  const handleDragStart = (event: any) => {
    const gig = gigs.find(g => g.id === event.active.id);
    if (gig) setActiveGig(gig);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveAGig = active.data.current?.type === "Gig";
    const isOverAGig = over.data.current?.type === "Gig";
    const isOverAColumn = over.data.current?.type === "Column";
    if (!isActiveAGig) return;
    if (isActiveAGig && isOverAGig) {
      setGigs(prev => {
        const activeIndex = prev.findIndex(g => g.id === activeId);
        const overIndex = prev.findIndex(g => g.id === overId);
        if (prev[activeIndex].columnId !== prev[overIndex].columnId) {
          const newGigs = [...prev];
          newGigs[activeIndex].columnId = prev[overIndex].columnId;
          return arrayMove(newGigs, activeIndex, overIndex);
        }
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    if (isActiveAGig && isOverAColumn) {
      setGigs(prev => {
        const activeIndex = prev.findIndex(g => g.id === activeId);
        const newGigs = [...prev];
        newGigs[activeIndex].columnId = overId as ColumnId;
        return arrayMove(newGigs, activeIndex, newGigs.length - 1);
      });
    }
  };

  const handleDragEnd = (event: any) => {
    setActiveGig(null);
    const { over } = event;
    if (!over) return;
    const overId = over.id;
    if (COLUMNS.some(col => col.id === overId)) {
      setGigs(prev => {
        const activeIdx = prev.findIndex(g => g.id === event.active.id);
        if (activeIdx === -1) return prev;
        const newGigs = [...prev];
        newGigs[activeIdx].columnId = overId as ColumnId;
        return arrayMove(newGigs, activeIdx, newGigs.length - 1);
      });
    }
  };

  const handleEditGig = (gig: Gig) => {
    console.log('edit gig', gig);
  };

  if (loading) {
    return (
      <div className="min-h-full p-8 md:p-12 flex items-center justify-center">
        <div className="text-white/50">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-8 md:p-12 pb-32 max-w-7xl mx-auto w-full flex flex-col">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
              Meu Negócio
            </h1>
            <p className="text-white/60 text-lg">
              Controle de Métricas e Pipeline de Gigs.
            </p>
          </div>
          <button
            onClick={() => setHelpOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-bold">Ajuda</span>
          </button>
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span className="text-sm font-bold">Editar</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Cachê Médio</h3>
            <DollarSign className="w-4 h-4 text-[#FFD700]" />
          </div>
          <h2 className="text-2xl font-black text-white">
            R$ {stats.cacheMedio.toLocaleString('pt-BR')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Gigs Fechadas</h3>
            <Music className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">{stats.gigsFechadas}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Taxa Conversão</h3>
            <TrendingUp className="w-4 h-4 text-[#FFD700]" />
          </div>
          <h2 className="text-2xl font-black text-white">{stats.taxaConversao}%</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Dias sem Gig</h3>
            <span className={`text-xs px-2 py-0.5 rounded ${stats.diasSemGig && stats.diasSemGig > 30 ? 'text-red-400 bg-red-400/10' : 'text-white/50 bg-white/5'}`}>
              {stats.diasSemGig !== null ? stats.diasSemGig : '-'}
            </span>
          </div>
          <p className="text-xs text-white/50">
            {stats.diasSemGig === null ? 'Sem gigs registry' : stats.diasSemGig > 30 ? 'Atenção!' : 'Em dia'}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/5 border border-[#FFD700]/30 rounded-2xl p-5 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-[#FFD700]" />
              <h3 className="text-sm font-bold text-[#FFD700] uppercase tracking-wider">Receita Potencial</h3>
            </div>
            <p className="text-3xl md:text-4xl font-black text-white">
              R$ {stats.receitaPotencial.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-white/50 mt-1">
              Baseado em {stats.pipeline.agendado} gigs confirmadas + {stats.pipeline.ideias} ideias (Taxa: {stats.taxaConversao}%)
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {stats.pipeline.ideias === 0 && (
              <Link
                href="/dashboard/cerebro"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FFD700] hover:bg-[#FFD700]/90 rounded-lg text-black font-bold transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Gerar Ideias com IA
              </Link>
            )}
            <Link
              href="/dashboard/cerebro"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white/80 text-sm transition-colors"
            >
              <Target className="w-4 h-4" />
              Análise Estratégica
            </Link>
          </div>
        </div>
      </motion.div>

      {stats.variacaoCache !== 0 && (
        <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
          {stats.variacaoCache > 0 ? (
            <>
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400">+{stats.variacaoCache}%</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-red-400">{stats.variacaoCache}%</span>
            </>
          )}
          <span>vs. último mês</span>
        </div>
      )}

      {stats.recommendations.length > 0 && (
        <div className="bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl p-4 mb-8">
          <h4 className="text-sm font-bold text-[#FFD700] mb-3 uppercase tracking-wider">Recomendações</h4>
          <ul className="space-y-2">
            {stats.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-[#FFD700] shrink-0 mt-0.5" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white/50 tracking-widest uppercase">
          Pipeline de Gigs
        </h3>
        <div className="flex gap-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <span className="text-xs text-white/60">{stats.pipeline.ideias}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD700]/10 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
            <span className="text-xs text-[#FFD700]">{stats.pipeline.agendado}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-400/10 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-400">{stats.pipeline.publicado}</span>
          </div>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[400px]">
          {COLUMNS.map(col => {
            const columnGigs = gigs.filter(gig => gig.columnId === col.id);
            return (
              <div key={col.id} className="flex flex-col h-full">
                <Column column={col} gigs={columnGigs} onEdit={handleEditGig} />
              </div>
            );
          })}
        </div>
        <DragOverlay dropAnimation={undefined}>
          {activeGig ? <SortableGigItem gig={activeGig} onEdit={handleEditGig} /> : null}
        </DragOverlay>
      </DndContext>

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        stats={stats}
        onSave={handleSave}
      />

      <AnimatePresence>
        {helpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setHelpOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Como Usar</h3>
                </div>
                <button onClick={() => setHelpOpen(false)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#FFD700]" />
                    Métricas (Cards do topo)
                  </h4>
                  <p className="text-white/60 text-sm">
                    Os 3 cards superiores mostram suas métricas pessoais. Clique em <span className="text-[#FFD700]">Editar</span> para atualizar os valores manualmente. Esses dados ficam salvos no seu perfil.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Pipeline de Gigs
                  </h4>
                  <p className="text-white/60 text-sm">
                    Arraste gigs entre colunas para acompanhar seu progresso:
                  </p>
                  <ul className="mt-2 space-y-2 text-white/50 text-sm">
                    <li><span className="text-white/80 font-bold">Ideias</span> — Gigs que você ainda está pensando</li>
                    <li><span className="text-[#FFD700] font-bold">Agendado</span> — Gigs confirmadas ou em negociação</li>
                    <li><span className="text-green-400 font-bold">Publicado</span> — Gigs que já aconteceram</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Music className="w-4 h-4 text-white" />
                    Recomendado
                  </h4>
                  <p className="text-white/60 text-sm">
                    Para um negócio saudável, equilibre seu pipeline: <span className="text-white font-bold">3 ideias</span> para cada <span className="text-[#FFD700]">1 agendada</span>. Mantenha 1-2 gigs confirmada
                  </p>
                </div>
              </div>

              <button
                onClick={() => setHelpOpen(false)}
                className="w-full mt-6 py-3 bg-[#FFD700] text-black font-bold rounded-lg"
              >
                Entendi!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}