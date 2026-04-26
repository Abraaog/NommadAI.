"use client";

import { useState, useEffect, useRef } from "react";
import { Radar, Trophy, Mic, Send, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface Analysis {
  percepcao: string;
  tendencia: string;
}

interface Mission {
  id: string;
  titulo: string;
  descricao?: string;
  status: string;
}

export default function EstrategiaPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch inicial
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/brain/chat");
        const data = await res.json();
        if (data.mission) setMission(data.mission);
        if (data.analysis) setAnalysis(data.analysis);
      } catch (error) {
        console.error("Erro ao carregar estratégia:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/brain/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, context: "strategy" }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o Cérebro");
    } finally {
      setIsTyping(false);
      // Recarregar missão e análise após o chat
      try {
        const res = await fetch("/api/brain/chat");
        const data = await res.json();
        if (data.mission) setMission(data.mission);
        if (data.analysis) setAnalysis(data.analysis);
      } catch (err) {
        console.error("Erro ao atualizar estratégia pós-chat:", err);
      }
    }
  };

  const handleMoveToKanban = async () => {
    if (!mission || isMoving) return;
    setIsMoving(true);

    try {
      const res = await fetch("/api/kanban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: mission.titulo,
          tipo: "branding",
          coluna: "ideias",
          source: "Cérebro AI",
          tag: "Estratégia",
          relacaoMissaoId: mission.id,
        }),
      });

      if (res.ok) {
        toast.success("Missão movida para o Kanban!");
        // Opcionalmente remover da lista local ou marcar como movida
      } else {
        throw new Error("Erro ao mover");
      }
    } catch (error) {
      toast.error("Falha ao mover missão");
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0F0F13]">
      <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-12 pb-40 max-w-5xl mx-auto w-full flex flex-col gap-10">
        {/* Cabeçalho */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Estratégia <span className="text-white/60">& Direção</span>
          </h1>
        </motion.div>

        {/* Container Central (Cards) */}
        <div className="flex flex-col gap-6 w-full">
          {/* Card 1: Análise */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl flex items-center justify-center">
                <Radar className="w-5 h-5 text-[#FFD700]" />
              </div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-white/80">O que eu percebi hoje</h2>
            </div>
            
            {isLoading ? (
              <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                <Loader2 className="w-3 h-3 animate-spin" /> Analisando dados...
              </div>
            ) : (
              <div className="space-y-4 text-white/60 text-sm leading-relaxed">
                <p>
                  {analysis?.percepcao || "Ainda estou processando seus últimos inputs para gerar uma análise de mercado precisa."}
                </p>
                {analysis?.tendencia && (
                  <p className="border-l-2 border-[#FFD700]/30 pl-4 italic">
                    Tendência detectada: {analysis.tendencia}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Chat History */}
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-[#FFD700] text-black font-medium" 
                      : "bg-white/5 border border-white/10 text-white/80"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-2">
                  <div className="flex gap-1">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      className="w-1.5 h-1.5 bg-[#FFD700] rounded-full" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-[#FFD700] rounded-full" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-[#FFD700] rounded-full" 
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Cérebro processando</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card 2: Missão */}
          {mission && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-md border border-[#FFD700]/30 rounded-2xl p-6 md:p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 blur-[100px] rounded-full pointer-events-none" />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#FFD700]" />
                </div>
                <h2 className="text-sm font-bold tracking-widest uppercase text-white/80">Sua Missão Ativa</h2>
              </div>

              <div className="relative z-10">
                <div className="bg-[#141416] border border-[#FFD700]/50 rounded-xl p-5 mb-6 shadow-[0_0_20px_rgba(255,215,0,0.05)]">
                  <div className="text-[10px] font-bold text-[#FFD700] uppercase tracking-widest mb-2">Objetivo Semanal</div>
                  <p className="text-white font-medium text-lg leading-snug">
                    {mission.titulo}
                  </p>
                  {mission.descricao && (
                    <p className="text-white/50 text-xs mt-2">{mission.descricao}</p>
                  )}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMoveToKanban}
                  disabled={isMoving}
                  className="bg-[#FFD700] text-black font-bold text-sm px-6 py-3 rounded-lg flex items-center justify-center transition-shadow hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] disabled:opacity-50"
                >
                  {isMoving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Mover para Kanban
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input de Chat Fixo */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 lg:left-64 right-0 p-6 z-20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A1C]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Digite sua dúvida ou nova ideia estratégica..."
              className="flex-1 bg-transparent border-none text-white placeholder:text-white/30 text-sm px-4 focus:outline-none focus:ring-0"
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 h-12 bg-[#FFD700] hover:bg-[#FFD700]/90 disabled:opacity-50 disabled:hover:bg-[#FFD700] rounded-xl flex items-center justify-center transition-all text-black shadow-[0_0_15px_rgba(255,215,0,0.2)] font-bold text-xs uppercase tracking-widest"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Enviar <Send className="w-4 h-4 ml-2" /></>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
