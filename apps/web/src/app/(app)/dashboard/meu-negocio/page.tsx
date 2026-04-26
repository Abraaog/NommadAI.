"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Music, TrendingUp, ChevronRight, CheckCircle2 } from "lucide-react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
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

// Tipos
type ColumnId = "prospecting" | "negotiating" | "confirmed";

interface Gig {
  id: string;
  columnId: ColumnId;
  title: string;
  subtitle: string;
  cache?: string;
  tag?: string;
}

const INITIAL_GIGS: Gig[] = [
  {
    id: "gig-1",
    columnId: "negotiating",
    title: "Festa Undergroove",
    subtitle: "Contato: Promoter João",
    cache: "R$ 2k",
  },
  {
    id: "gig-2",
    columnId: "confirmed",
    title: "Club Vibe",
    subtitle: "Warmup Slot (23h - 01h)",
    tag: "Contrato Assinado",
  },
];

const COLUMNS: { id: ColumnId; title: string; color: string }[] = [
  { id: "prospecting", title: "Prospectando", color: "text-white/80" },
  { id: "negotiating", title: "Negociando", color: "text-[#FFD700]" },
  { id: "confirmed", title: "Confirmado", color: "text-green-400" },
];

// Componente do Item Arrastável
function SortableGigItem({ gig }: { gig: Gig }) {
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
      className={`bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors shadow-lg ${
        gig.columnId === "confirmed" ? "border-l-[4px] border-l-green-400 shadow-[0_0_15px_rgba(74,222,128,0.1)] hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <h5 className="font-bold text-white text-lg leading-tight">{gig.title}</h5>
        {gig.columnId === "confirmed" && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 ml-2" />}
      </div>
      <p className="text-white/50 text-sm mb-4">{gig.subtitle}</p>
      
      <div className="flex items-center justify-between mt-auto">
        {gig.cache ? (
          <span className="text-[10px] font-black tracking-widest uppercase bg-[#FFD700] text-black px-2 py-1 rounded">
            Cachê: {gig.cache}
          </span>
        ) : gig.tag ? (
          <span className="text-[10px] font-black tracking-widest uppercase bg-white/5 text-white/60 border border-white/10 px-2 py-1 rounded">
            {gig.tag}
          </span>
        ) : (
          <div />
        )}
        {gig.columnId !== "confirmed" && <ChevronRight className="w-4 h-4 text-white/30" />}
      </div>
    </div>
  );
}

// Componente da Coluna
function Column({ column, gigs }: { column: { id: ColumnId; title: string; color: string }; gigs: Gig[] }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col gap-4 h-full"
    >
      <div className="flex items-center justify-between px-2 mb-2">
        <h4 className="text-sm font-bold text-white/80">{column.title}</h4>
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
          column.id === 'prospecting' ? 'text-white/30 bg-white/5' :
          column.id === 'negotiating' ? 'text-[#FFD700] bg-[#FFD700]/10' :
          'text-green-400 bg-green-400/10'
        }`}>
          {gigs.length}
        </span>
      </div>
      
      <SortableContext items={gigs.map(g => g.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[150px] flex-1">
          {gigs.length > 0 ? (
            gigs.map((gig) => <SortableGigItem key={gig.id} gig={gig} />)
          ) : (
            <div className="flex-1 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs font-bold uppercase tracking-widest min-h-[100px]">
              Solte aqui
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function MeuNegocioPage() {
  const [gigs, setGigs] = useState<Gig[]>(INITIAL_GIGS);
  const [activeGig, setActiveGig] = useState<Gig | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires a 5px drag to start, avoiding accidental clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const gig = gigs.find((g) => g.id === active.id);
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

    // Movendo gig sobre outro gig
    if (isActiveAGig && isOverAGig) {
      setGigs((prev) => {
        const activeIndex = prev.findIndex((g) => g.id === activeId);
        const overIndex = prev.findIndex((g) => g.id === overId);

        if (prev[activeIndex].columnId !== prev[overIndex].columnId) {
          const newGigs = [...prev];
          newGigs[activeIndex].columnId = prev[overIndex].columnId;
          return arrayMove(newGigs, activeIndex, overIndex);
        }

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    // Movendo gig sobre uma coluna vazia
    if (isActiveAGig && isOverAColumn) {
      setGigs((prev) => {
        const activeIndex = prev.findIndex((g) => g.id === activeId);
        const newGigs = [...prev];
        newGigs[activeIndex].columnId = overId as ColumnId;
        return arrayMove(newGigs, activeIndex, newGigs.length - 1);
      });
    }
  };

  const handleDragEnd = (event: any) => {
    setActiveGig(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeIndex = gigs.findIndex((g) => g.id === activeId);
    
    // Se soltou em cima de outra coluna vazia (que definiremos o ID como a própria string da coluna)
    if (COLUMNS.some(col => col.id === overId)) {
      setGigs((prev) => {
        const newGigs = [...prev];
        newGigs[activeIndex].columnId = overId as ColumnId;
        return arrayMove(newGigs, activeIndex, newGigs.length - 1);
      });
      return;
    }

    const overIndex = gigs.findIndex((g) => g.id === overId);
    if (activeIndex !== overIndex) {
      setGigs((prev) => arrayMove(prev, activeIndex, overIndex));
    }
  };

  return (
    <div className="min-h-full p-8 md:p-12 pb-32 max-w-7xl mx-auto w-full flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
          Painel de Negócios
        </h1>
        <p className="text-white/60 text-lg">
          Controle de Gigs, Networking e Metas Financeiras.
        </p>
      </motion.div>

      {/* Resumo Financeiro (Top Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Cachê Médio (Mês)</h3>
            <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#FFD700]" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <h2 className="text-3xl font-black text-white">R$ 1.500</h2>
            <span className="text-xs font-bold text-green-400 mb-1">+15% em relação ao último mês</span>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Gigs Fechadas</h3>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">4</h2>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Propostas Enviadas</h3>
            <div className="w-8 h-8 rounded-lg bg-[#FFD700]/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#FFD700]" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black text-white">12</h2>
            {/* Mini gráfico (Mock SVG) */}
            <svg className="w-24 h-8" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path 
                d="M 0 30 Q 20 20, 40 25 T 70 15 T 100 5" 
                fill="none" 
                stroke="#FFD700" 
                strokeWidth="2"
                strokeLinecap="round" 
              />
              <path 
                d="M 0 30 L 0 30 Q 20 20, 40 25 T 70 15 T 100 5 L 100 30 Z" 
                fill="url(#trendGlow)" 
                opacity="0.3"
              />
              <defs>
                <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Pipeline de Gigs (Mini Kanban) */}
      <h3 className="text-sm font-bold text-white/50 tracking-widest uppercase mb-6">
        Pipeline de Vendas (CRM)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map((col) => {
            const columnGigs = gigs.filter((gig) => gig.columnId === col.id);
            return (
              <div key={col.id} className="flex flex-col h-full">
                <Column column={col} gigs={columnGigs} />
              </div>
            );
          })}

          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } }),
            }}
          >
            {activeGig ? <SortableGigItem gig={activeGig} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

