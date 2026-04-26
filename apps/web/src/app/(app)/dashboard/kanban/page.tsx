"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, CheckCircle2, CircleDashed, Clock, Sparkles, X, Plus, ChevronLeft, ChevronRight, MoreHorizontal, FolderPlus, Brain, Target, Info, BarChart3, Search, Filter, MoreVertical } from "lucide-react";
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
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { TaskDetailModal } from "@/components/kanban/TaskDetailModal";

// Tipos
type ColumnId = string;

interface Task {
  id: string;
  columnId: ColumnId;
  title: string;
  source: string; 
  sourceColor?: string;
  tag?: string;
  tagColor?: string;
  type: string;
  insights?: string;
  metrics?: any;
  result?: string;
  relacaoMissaoId?: string | null;
  updatedAt?: string;
}

// Remoção de INITIAL_TASKS estático

const DEFAULT_COLUMNS: { id: ColumnId; title: string; icon: any; color: string; bg: string }[] = [
  { id: "ideias", title: "Backlog / Ideias", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "em_desenvolvimento", title: "Em Andamento", icon: Clock, color: "text-[#FFD700]", bg: "bg-[#FFD700]/10" },
  { id: "agendado", title: "Agendado", icon: CircleDashed, color: "text-white/60", bg: "bg-white/5" },
  { id: "publicado", title: "Publicado", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10" },
];
// Note: Adjusted IDs to match DB schema enums ('ideias', 'em_desenvolvimento', 'agendado', 'publicado')

// Componente do Item Arrastável
function SortableTaskItem({ task, onClick }: { task: Task; onClick?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "Task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#141416] backdrop-blur-md border border-white/5 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-white/10 transition-colors shadow-md group relative overflow-hidden ${
        task.columnId === "publicado" ? "border-l-[3px] border-l-green-400 opacity-70 hover:opacity-100" : ""
      }`}
    >
      {/* Handle de arraste fixo para evitar conflito com clique */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute inset-0 z-0" 
      />

      <div 
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="relative z-10 ml-1.5 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${task.source === 'Gerador' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#FFD700]/10 text-[#FFD700]'}`}>
            {task.source}
          </span>
          {task.relacaoMissaoId && (
            <div className="bg-purple-500/20 p-1 rounded" title="Vinculado a uma Missão AI">
              <Brain className="w-3 h-3 text-purple-400" />
            </div>
          )}
        </div>
        <h3 className={`text-sm font-bold mb-2 leading-tight group-hover:text-[#FFD700] transition-colors line-clamp-2 ${task.columnId === 'publicado' ? 'text-white/40 line-through' : 'text-white'}`}>
          {task.title}
        </h3>
        {task.tag && (
          <span 
            className="text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border"
            style={{ 
              color: task.tagColor || '#ffffff60', 
              borderColor: `${task.tagColor || '#ffffff'}30`,
              backgroundColor: `${task.tagColor || '#ffffff'}10`
            }}
          >
            {task.tag}
          </span>
        )}
      </div>
    </div>
  );
}

// Componente da Coluna
function Column({ column, tasks, onTaskClick }: { column: { id: ColumnId; title: string; icon: any; color: string; bg: string }; tasks: Task[]; onTaskClick: (task: Task) => void }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const Icon = column.icon;

  return (
    <div
      ref={setNodeRef}
      className="bg-[#0A0A0C] rounded-2xl p-3 border border-white/5 flex flex-col gap-3 h-[calc(100vh-250px)] min-h-[500px]"
    >
      <div className="flex items-center justify-between px-1 mb-1 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded flex items-center justify-center ${column.bg}`}>
            <Icon className={`w-3 h-3 ${column.color}`} />
          </div>
          <h4 className="text-xs font-bold text-white/80">{column.title}</h4>
        </div>
        <span className="text-[10px] font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded">
          {tasks.length}
        </span>
      </div>
      
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar pb-10">
          {tasks.length > 0 ? (
            tasks.map((task) => <SortableTaskItem key={task.id} task={task} onClick={() => onTaskClick(task)} />)
          ) : (
            <div className="flex-1 border border-dashed border-white/5 rounded-lg flex items-center justify-center text-white/10 text-[10px] font-bold uppercase tracking-widest min-h-[100px]">
              Solte as missões aqui
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [sources, setSources] = useState([
    { label: "Manual", color: "#ffffff" },
    { label: "Estratégia", color: "#a29bfe" },
    { label: "Gerador", color: "#fd79a8" },
    { label: "Release", color: "#00cec9" },
    { label: "Networking", color: "#e17055" },
  ]);
  const [tags, setTags] = useState([
    { label: "Geral", color: "#FFD700" },
    { label: "Marketing", color: "#ff7675" },
    { label: "Design", color: "#74b9ff" },
    { label: "A&R", color: "#55efc4" },
    { label: "Conteúdo", color: "#ffeaa7" },
    { label: "Financeiro", color: "#00b894" },
  ]);

  const [newTaskSource, setNewTaskSource] = useState(sources[0]);
  const [newTaskTag, setNewTaskTag] = useState(tags[0]);

  const boardRef = useRef<HTMLDivElement>(null);

  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSourceInput, setNewSourceInput] = useState("");
  const [newSourceColor, setNewSourceColor] = useState("#a29bfe");

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [newTagColor, setNewTagColor] = useState("#FFD700");

  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("#a29bfe");

  // Fetch inicial
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/kanban');
      const data = await res.json();
      if (data.cards) {
        const mappedTasks = data.cards.map((card: any) => ({
          id: card.id,
          columnId: card.coluna,
          title: card.titulo,
          source: card.source || 'Manual',
          sourceColor: sources.find(s => s.label === card.source)?.color || '#ffffff',
          tag: card.tag,
          tagColor: tags.find(t => t.label === card.tag)?.color || '#FFD700',
          type: card.tipo,
          insights: card.insights,
          metrics: card.metricas,
          result: card.resultado,
          relacaoMissaoId: card.relacaoMissaoId,
          updatedAt: card.updatedAt
        }));
        setTasks(mappedTasks);
      }
    } catch (error) {
      console.error("Erro ao carregar Kanban:", error);
      toast.error("Erro ao carregar tarefas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Supabase Realtime
    const supabase = createSupabaseClient();
    const channel = supabase
      .channel('kanban_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kanban_cards' },
        (_payload: any) => {
          console.log('Change received!', _payload);
          // Recarregar tudo para garantir ordem e consistência
          // Em um app maior, faríamos merge local
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddColumnClick = () => {
    const val = newColumnName.trim();
    if (val && !columns.find(c => c.title === val)) {
      const newColId = val.toLowerCase().replace(/\s+/g, '-') as ColumnId;
      const newColumn = {
        id: newColId,
        title: val,
        icon: CircleDashed,
        color: newColumnColor,
        bg: `${newColumnColor}/10`
      };
      setColumns([...columns, newColumn]);
    }
    setNewColumnName("");
    setShowColumnMenu(false);
  };

  const handleAddColumnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColumnClick();
    }
  };

  const handleAddSource = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    const val = newSourceInput.trim();
    if (val && !sources.find(s => s.label === val)) {
      const newSrc = { label: val, color: newSourceColor };
      setSources([...sources, newSrc]);
      setNewTaskSource(newSrc);
    }
    setIsAddingSource(false);
    setNewSourceInput("");
  };

  const handleImportMissions = async () => {
    try {
      const res = await fetch('/api/missions');
      const data = await res.json();
      if (data.missions && data.missions.length > 0) {
        const unlinkedMissions = data.missions.filter((m: any) => 
          !tasks.find(t => t.relacaoMissaoId === m.id)
        );

        if (unlinkedMissions.length === 0) {
          toast.info("Todas as missões já estão no Kanban.");
          return;
        }

        // Import unlinked missions as cards in Backlog
        for (const mission of unlinkedMissions) {
          await fetch('/api/kanban', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              titulo: mission.titulo,
              tipo: 'branding', // Default for missions
              coluna: 'ideias',
              source: 'Cérebro AI',
              tag: 'Missão',
              relacaoMissaoId: mission.id,
            })
          });
        }
        toast.success(`${unlinkedMissions.length} missões importadas do Cérebro!`);
        fetchTasks();
      } else {
        toast.info("Nenhuma missão ativa encontrada no Cérebro.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao importar missões");
    }
  };

  const handleAddTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    const val = newTagInput.trim();
    if (val && !tags.find(t => t.label === val)) {
      const newTg = { label: val, color: newTagColor };
      setTags([...tags, newTg]);
      setNewTaskTag(newTg);
    }
    setIsAddingTag(false);
    setNewTagInput("");
  };

  const handleCreateMission = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/kanban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: newTaskTitle.trim(),
          tipo: 'conteudo',
          coluna: 'ideias',
          source: newTaskSource.label,
          tag: newTaskTag.label !== "Geral" ? newTaskTag.label : undefined,
        })
      });

      if (!res.ok) throw new Error("Falha ao criar card");
      
      const newCard = await res.json();
      // O realtime cuidará do refresh, mas podemos adicionar localmente para UX instantânea
      const newTask: Task = {
        id: newCard.id,
        columnId: newCard.coluna, 
        title: newCard.titulo,
        source: newCard.source || 'Manual',
        sourceColor: newTaskSource.color,
        tag: newCard.tag,
        tagColor: newTaskTag.color,
        type: newCard.tipo
      };

      setTasks((prev) => [newTask, ...prev]);
      setIsModalOpen(false);
      setNewTaskTitle("");
      setNewTaskSource(sources[0]);
      setNewTaskTag(tags[0]);
      toast.success("Missão adicionada!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar missão");
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveATask) return;

    // Movendo task sobre outra task
    if (isActiveATask && isOverATask) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const overIndex = prev.findIndex((t) => t.id === overId);

        if (prev[activeIndex].columnId !== prev[overIndex].columnId) {
          const newTasks = [...prev];
          newTasks[activeIndex].columnId = prev[overIndex].columnId;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    // Movendo task sobre uma coluna vazia
    if (isActiveATask && isOverAColumn) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const newTasks = [...prev];
        newTasks[activeIndex].columnId = overId as ColumnId;
        return arrayMove(newTasks, activeIndex, newTasks.length - 1);
      });
    }
  };

  const handleDragEnd = async (event: any) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    if (activeIndex === -1) return;

    let newColumnId = tasks[activeIndex].columnId;
    let overIndex = -1;

    // Se soltou direto na coluna
    if (columns.some(col => col.id === over.id)) {
      newColumnId = over.id as ColumnId;
    } else {
      // Se soltou sobre outra task
      overIndex = tasks.findIndex((t) => t.id === over.id);
      if (overIndex !== -1) {
        newColumnId = tasks[overIndex].columnId;
      }
    }

    if (newColumnId !== tasks[activeIndex].columnId) {
      // Update local state optimistically
      setTasks((prev) => {
        const newTasks = [...prev];
        newTasks[activeIndex].columnId = newColumnId;
        return arrayMove(newTasks, activeIndex, newColumnId === prev[activeIndex].columnId ? overIndex : newTasks.length - 1);
      });

      // Update database
      try {
        const res = await fetch('/api/kanban', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: activeId,
            coluna: newColumnId
          })
        });
        if (!res.ok) throw new Error("Erro ao atualizar coluna");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao salvar movimento");
        fetchTasks(); // Revert state
      }
    } else {
      // Reordenação na mesma coluna (opcional implementar persistência de ordem)
      const overIndex = tasks.findIndex((t) => t.id === over.id);
      if (overIndex !== -1 && activeIndex !== overIndex) {
        setTasks((prev) => arrayMove(prev, activeIndex, overIndex));
      }
    }
  };

  return (
    <div className="h-full p-8 md:p-12 max-w-[1600px] mx-auto w-full flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <LayoutDashboard className="w-5 h-5 text-[#FFD700]" />
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Kanban de Missões
            </h1>
          </div>
          <p className="text-white/50 text-sm md:text-base max-w-2xl">
            Sua central de execução. Acompanhe tarefas geradas pelo Cérebro AI, conteúdos do Gerador e etapas de lançamento do Release System.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleImportMissions}
            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/30 font-bold text-sm px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
            title="Importar missões geradas pela AI"
          >
            <Brain className="w-4 h-4" /> Importar AI
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold text-sm px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.2)] whitespace-nowrap"
          >
            + Nova Missão
          </button>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="bg-white/5 hover:bg-white/10 text-white font-bold text-sm px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10"
          >
            <Plus className="w-4 h-4" /> Coluna
          </button>
          
          {showColumnMenu && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-[#0F0F13] border border-white/10 rounded-xl p-4 z-20 shadow-xl">
              <p className="text-xs text-white/50 mb-3 uppercase tracking-widest">Nova Coluna</p>
              <div className="flex flex-col gap-3">
                <input 
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={handleAddColumnKeyDown}
                  placeholder="Nome da coluna..."
                  className="w-full bg-[#1A1A1E] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FFD700]/50"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={newColumnColor} 
                    onChange={(e) => setNewColumnColor(e.target.value)} 
                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
                  />
                  <button 
                    onClick={handleAddColumnClick}
                    disabled={!newColumnName.trim()}
                    className="flex-1 py-2 rounded-lg bg-[#FFD700] text-black font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={() => boardRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => boardRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <span className="text-xs text-white/30 ml-2">
          Arraste as missões entre colunas
        </span>
      </div>

      {/* Board */}
      <div ref={boardRef} className="flex-1 w-full overflow-x-auto pb-8 no-scrollbar">
        <div className="inline-flex gap-4 h-full min-w-full items-stretch">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {columns.map((col) => {
              const columnTasks = tasks.filter((task) => task.columnId === col.id);
              return (
                <div key={col.id} className="w-[280px] shrink-0 h-full flex flex-col">
                  <Column 
                    column={col} 
                    tasks={columnTasks} 
                    onTaskClick={(task) => {
                      setSelectedTask(task);
                      setIsDetailModalOpen(true);
                    }} 
                  />
                </div>
              );
            })}

            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.4" } } }),
              }}
            >
              {activeTask ? <SortableTaskItem task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Modal Nova Missão */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0F0F13] border border-white/10 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white tracking-tight">Criar Missão</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Título */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest">O que precisa ser feito?</label>
                  <input 
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Ex: Fechar data do show em SP..."
                    className="w-full bg-[#1A1A1E] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/50 transition-all placeholder:text-white/20"
                    autoFocus
                  />
                </div>

                {/* Fonte / Categoria */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Origem</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {sources.map(source => {
                      const isActive = newTaskSource.label === source.label;
                      return (
                        <button
                          key={source.label}
                          onClick={() => setNewTaskSource(source)}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                          style={{
                            backgroundColor: isActive ? `${source.color}20` : 'transparent',
                            borderColor: isActive ? source.color : 'rgba(255,255,255,0.1)',
                            color: isActive ? source.color : 'rgba(255,255,255,0.5)'
                          }}
                        >
                          {source.label}
                        </button>
                      );
                    })}
                    {isAddingSource ? (
                      <div className="flex items-center gap-1">
                        <input 
                          type="color" 
                          value={newSourceColor} 
                          onChange={e => setNewSourceColor(e.target.value)} 
                          className="w-7 h-7 p-0 border-0 rounded cursor-pointer bg-transparent"
                        />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Nova origem..."
                          value={newSourceInput}
                          onChange={(e) => setNewSourceInput(e.target.value)}
                          onKeyDown={(e) => handleAddSource(e)}
                          className="w-24 bg-[#1A1A1E] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                        />
                        <button onClick={() => handleAddSource()} className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20">
                          <CheckCircle2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingSource(true)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white transition-colors"
                        title="Adicionar Origem"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Tag */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Tag de Foco</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {tags.map(tag => {
                      const isActive = newTaskTag.label === tag.label;
                      return (
                        <button
                          key={tag.label}
                          onClick={() => setNewTaskTag(tag)}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                          style={{
                            backgroundColor: isActive ? `${tag.color}20` : 'transparent',
                            borderColor: isActive ? tag.color : 'rgba(255,255,255,0.1)',
                            color: isActive ? tag.color : 'rgba(255,255,255,0.5)'
                          }}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                    {isAddingTag ? (
                      <div className="flex items-center gap-1">
                        <input 
                          type="color" 
                          value={newTagColor} 
                          onChange={e => setNewTagColor(e.target.value)} 
                          className="w-7 h-7 p-0 border-0 rounded cursor-pointer bg-transparent"
                        />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Nova tag..."
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => handleAddTag(e)}
                          className="w-24 bg-[#1A1A1E] border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                        />
                        <button onClick={() => handleAddTag()} className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20">
                          <CheckCircle2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingTag(true)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white transition-colors"
                        title="Adicionar Tag"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <button 
                onClick={handleCreateMission}
                disabled={!newTaskTitle.trim()}
                className="w-full mt-2 bg-[#FFD700] disabled:bg-white/5 disabled:text-white/30 text-black font-black py-3.5 rounded-xl transition-all"
              >
                Adicionar ao Backlog
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Detalhes */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdate={fetchTasks}
        />
      )}
    </div>
  );
}
