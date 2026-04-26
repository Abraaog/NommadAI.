"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, ArrowRight, HelpCircle, Activity, Cpu, Check,
  UserCircle2, Moon, BarChart2, LayoutDashboard, Rocket,
  FileText, Settings, Menu, User, Sparkles, Zap, ChevronLeft,
  Users, Clock, ZapIcon, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { DashboardSkeleton } from "@/components/onboarding/DashboardSkeleton";
import { RevealModal } from "@/components/onboarding/RevealModal";
import { createSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Onboarding Sub-components ---

const OnboardingHeader = ({ step, onBack }: { step: number; onBack?: () => void }) => {
  const steps = [
    { id: 1, label: "CALIBRAR" },
    { id: 2, label: "GRAVAR" },
    { id: 3, label: "PROCESSAR" },
    { id: 4, label: "REVELAR" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white/50" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-black text-xl">N</div>
          <div className="flex flex-col -space-y-1">
            <span className="text-white text-lg font-black tracking-tighter uppercase">NOMMAD AI<span className="text-yellow-500">.</span></span>
            <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-[0.2em]">Artist OS</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8">
        <nav className="flex items-center gap-3 md:gap-6">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center gap-1 md:gap-2">
              <div className={`text-[8px] md:text-[10px] font-black px-1.5 md:px-2 py-0.5 rounded flex items-center gap-1 ${
                s.id === step ? "bg-yellow-500 text-black" : "text-white/20"
              }`}>
                <span>{s.id}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {s.id < 4 && <div className="w-4 md:w-8 h-[1px] bg-white/5" />}
            </div>
          ))}
        </nav>
        
        {/* Help Icon (?) with Tutorial Tooltip */}
        <div className="relative group">
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-yellow-500/50 transition-all">
            <HelpCircle className="w-5 h-5 text-white/40 group-hover:text-yellow-500" />
          </button>
          <div className="absolute right-0 top-12 w-64 p-4 glass-card border-yellow-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <p className="text-xs text-white/70 leading-relaxed">
              <span className="text-yellow-500 font-bold block mb-1">Dica de Uso:</span>
              Fale naturalmente sobre sua carreira. Nossos agentes analisam seu tom, frequência e objetivos para configurar seu Sistema Operacional personalizado.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

function StartStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-6 pt-32 md:pt-40 relative z-20 min-h-screen overflow-y-auto">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          src="/images/musical_instrument.png"
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      <div className="max-w-5xl w-full text-center space-y-10 relative z-30">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center border border-yellow-500/40 relative shadow-2xl shadow-yellow-500/10">
             <Mic className="w-8 h-8 text-yellow-500" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_#EAB308]" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-[11px] md:text-[13px] font-black text-yellow-500 uppercase tracking-[0.5em]">Diagnóstico Inicial • Precision OS</div>
          <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-4xl mx-auto text-white drop-shadow-2xl">
            Você não precisa de <br />
            <span className="text-white/90">mais conteúdo.</span> <br />
            <span className="text-yellow-500 underline decoration-yellow-500/20 underline-offset-8">Você precisa de direção.</span>
          </h1>
          <p className="text-white/80 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            A NOMMAD AI precisa entender de onde você vem para calcular onde você vai chegar. Sem formulários. Só você e sua visão.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            onClick={onNext}
            className="px-14 py-8 text-base font-black uppercase tracking-[0.2em] rounded-2xl bg-yellow-500 text-black hover:bg-yellow-400 transition-all scale-110 md:scale-125"
            glow
          >
            Iniciar Diagnóstico <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-12">
          {[
            { label: "Artistas Mapeados", value: "1.200+", icon: Users },
            { label: "Duração", value: "2-5 min", icon: Clock },
            { label: "Resultados", value: "Imediatos", icon: ZapIcon },
          ].map((stat, i) => (
            <GlassCard key={i} className="p-5 flex flex-col items-center justify-center space-y-1 border-white/10 bg-black/40 backdrop-blur-xl" hover={false}>
              <div className="text-2xl font-black text-white tracking-tighter">{stat.value}</div>
              <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">{stat.label}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function InputStep({ onNext, onBack }: { onNext: (text: string) => void; onBack: () => void }) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [method, setMethod] = useState<"text" | "audio">("text");

  const handleSubmit = () => {
    if (method === "text" && !text.trim()) return;
    setIsSubmitting(true);
    // Simular processamento
    setTimeout(() => {
      onNext(text);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-6 pt-24 md:pt-32 relative z-20 min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          src="/images/studio_mic.png"
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-30">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">GRAVAR SUA <span className="text-yellow-500">VISÃO.</span></h2>
          <p className="text-white/70 text-center mx-auto max-w-md font-medium text-sm md:text-base">Escolha como prefere calibrar seu Sistema Operacional.</p>
        </div>

        {/* Method Toggle */}
        <div className="flex justify-center p-1 bg-white/5 backdrop-blur-xl rounded-xl w-fit mx-auto border border-white/10">
          <button
            onClick={() => setMethod("text")}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              method === "text" ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "text-white/40 hover:text-white/60"
            }`}
          >
            Entrada de Texto
          </button>
          <button
            onClick={() => setMethod("audio")}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              method === "audio" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
            }`}
          >
            <Mic className="w-3 h-3" />
            Via Áudio
            <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white/40">BREVE</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {method === "text" ? (
            <motion.div
              key="text-input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative w-full group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-yellow-500/0 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ex: Sou produtor de Tech House há 2 anos, sinto que travei na criação de basslines e meu objetivo é lançar em labels como Solid Grooves..."
                className="w-full h-48 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 transition-all resize-none font-medium leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{text.length} caracteres</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="audio-input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full h-48 bg-black/40 backdrop-blur-xl border border-white/10 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-white/10 group-hover:scale-110 transition-transform">
                <Mic className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Diagnóstico por Voz</p>
                <p className="text-[10px] text-white/20 font-medium">Em breve: Fale com a IA em tempo real.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-6 pt-4">
          <Button 
            onClick={handleSubmit}
            disabled={method === "audio" || !text.trim() || isSubmitting}
            className="px-12 py-6 text-sm font-black uppercase tracking-[0.2em] rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            glow
          >
            {isSubmitting ? "Enviando..." : "Processar Diagnóstico"} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <button 
            onClick={onBack}
            className="text-[10px] font-black text-white/30 hover:text-white/60 uppercase tracking-[0.3em] transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}

function ProcessingStep({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onNext, 4000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-6 pt-32 md:pt-40 relative z-20 min-h-screen">
       <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          src="/images/neural_core.png"
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/90" />
      </div>

      <div className="max-w-md w-full space-y-12 relative z-30">
        <div className="flex justify-center">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="w-24 h-24 rounded-3xl border-2 border-yellow-500/20 border-t-yellow-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-10 h-10 text-yellow-500 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tighter uppercase text-white">PROCESSANDO DIAGNÓSTICO</h2>
            <p className="text-white/60 text-sm font-medium">Agentes IA analisando sua assinatura sonora e mercado.</p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Activity, label: "Analisando Coerência Artística", delay: 0 },
              { icon: BarChart2, label: "Mapeando Oportunidades de Mercado", delay: 1 },
              { icon: Zap, label: "Configurando Precision OS", delay: 2 },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.delay }}
                className="flex items-center gap-4 p-4 glass-card border-white/10 bg-black/60 backdrop-blur-xl"
              >
                <item.icon className="w-5 h-5 text-yellow-500" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">{item.label}</span>
                <div className="ml-auto">
                  <motion.div 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#EAB308]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RevealStep({ classification }: { classification: any }) {
  return (
    <div className="relative min-h-screen bg-black">
      <DashboardSkeleton />
      <RevealModal classification={classification} />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [visionText, setVisionText] = useState("");
  const [classification, setClassification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if already finished onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('stage')
        .eq('id', user.id)
        .single();

      if (profile && profile.stage !== 'pendente') {
        router.push("/dashboard");
        return;
      }

      setLoading(false);
    }
    checkUser();
  }, [router]);

  const handleInputNext = (text: string) => {
    setVisionText(text);
    setStep(3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
      </div>
    );
  }

  const handleProcessingComplete = async () => {
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visionText }),
      });

      if (!response.ok) throw new Error('Onboarding failed');

      const data = await response.json();
      setClassification(data.classification);
      setStep(4);
    } catch (error) {
      console.error(error);
      // Fallback ou erro
      setStep(2); 
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      {step < 4 && (
        <OnboardingHeader 
          step={step} 
          onBack={step === 2 ? () => setStep(1) : undefined} 
        />
      )}
      
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col"
          >
            <StartStep onNext={() => setStep(2)} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col"
          >
            <InputStep onNext={handleInputNext} onBack={() => setStep(1)} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <ProcessingStep onNext={handleProcessingComplete} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            <RevealStep classification={classification} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
