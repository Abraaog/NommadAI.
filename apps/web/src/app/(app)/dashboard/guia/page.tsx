"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ChevronDown, 
  Target, 
  Zap, 
  Palette, 
  Brain, 
  Rocket,
  MessageSquare,
  Play,
  Layers
} from "lucide-react";

// --- Dados do Guia ---
const MODULES = [
  {
    id: "estrategia",
    title: "Estratégia e Planejamento",
    icon: Target,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    content: "O módulo de Estratégia é o cérebro da sua carreira. Aqui você define suas metas (branding, lançamentos, gigs) e a NOMMAD AI quebra isso em passos executáveis. Funciona como seu manager pessoal. Sempre comece por aqui antes de lançar uma nova track."
  },
  {
    id: "gerador",
    title: "Gerador de Conteúdo",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    content: "Ficou sem ideias do que postar? O Gerador usa modelos treinados na cultura eletrônica para criar roteiros de Reels, legendas para o Instagram e scripts para o TikTok baseados na sua persona. Basta dar um tema ou enviar um áudio."
  },
  {
    id: "design",
    title: "Design Studio (AI Image)",
    icon: Palette,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    content: "Integrado com a API da Freepik, este módulo permite gerar capas de singles, assets visuais para shows (VJ loops) e texturas. Descreva o cenário em detalhes (ex: 'Estética cyberpunk, neon azul, estilo Flux') e a IA cuidará do resto."
  },
  {
    id: "cerebro",
    title: "O Cérebro AI",
    icon: Brain,
    color: "text-green-400",
    bg: "bg-green-400/10",
    content: "O núcleo do ecossistema. O Cérebro conecta todos os seus dados. Você pode conversar com ele para pedir conselhos sobre sua carreira, e ele entenderá seu contexto atual, injetando as missões que você pedir diretamente no seu Kanban."
  },
  {
    id: "release",
    title: "Release System",
    icon: Rocket,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    content: "O seu pipeline de lançamentos de música. Arraste suas faixas desde a ideia no Ableton, passando pela Mix/Master, Pitching nas Playlists Editoriais até o dia do Drop. Nada passa despercebido."
  },
  {
    id: "classificador",
    title: "Classificador Universal",
    icon: Layers,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    content: "Nossa IA de triagem. Envie links (Spotify, Instagram, Contratos) ou arquivos. O sistema analisa a origem e o conteúdo para categorizar automaticamente e dar uma nota de confiança. Útil para organizar referências e documentos de carreira."
  }
];

const FAQS = [
  {
    question: "Como o NOMMAD AI sabe qual é o meu estilo?",
    answer: "Durante o Onboarding e ao interagir com o 'Cérebro', a IA molda suas respostas com base no subgênero de música eletrônica que você selecionou e no seu tom de voz (ex: Underground, Comercial, Misterioso)."
  },
  {
    question: "Onde ficam salvas minhas tarefas?",
    answer: "Todas as tarefas criadas manualmente ou injetadas pelo Cérebro AI ficam consolidadas na tela 'Kanban'. Essa é sua central de execução definitiva."
  },
  {
    question: "Posso conectar meu Spotify for Artists?",
    answer: "A integração direta via API do Spotify está prevista no Roadmap V3. No momento, o sistema analisa os números que você reporta manualmente na tela de Evolução."
  }
];

// --- Novos Dados ---
const TABS = [
  { id: "regras", label: "Regras de Ouro (O Loop)" },
  { id: "visao", label: "Visão Geral" },
  { id: "passo", label: "Ações Práticas" },
  { id: "glossario", label: "Glossário & FAQ" }
] as const;

type TabId = typeof TABS[number]["id"];

const RULES = [
  {
    title: "A Regra de Ouro: Foco Único",
    status: "positive",
    content: "O Cérebro NOMMAD funciona em 'Ralph Loop'. Nunca peça duas estratégias complexas ao mesmo tempo. Resolva o lançamento da Track A antes de planejar o marketing da Track B. A dispersão é o inimigo número 1 do artista independente.",
    do: "Foque em uma única 'Missão Ativa' no Kanban até ela ser concluída.",
    dont: "Pular de uma tarefa para outra sem finalizar o que o Cérebro propôs."
  },
  {
    title: "Sincronização: O Check-in é Lei",
    status: "positive",
    content: "O Cérebro só é inteligente se tiver dados. Se você executa na vida real mas não relata no Daily Loop, a IA continuará te cobrando coisas antigas e sua estratégia ficará obsoleta.",
    do: "Faça o Check-in Diário mesmo em dias que você 'não produziu'. Relatar o bloqueio é progresso.",
    dont: "Ficar mais de 48h sem atualizar o Daily Loop."
  },
  {
    title: "Conversa com a IA: Contexto é Tudo",
    status: "positive",
    content: "Ao falar com o Cérebro na Estratégia, seja específico. Use nomes de gravadoras, cidades e tracks. A IA usa Busca Vetorial (RAG) para encontrar detalhes no seu histórico.",
    do: "Mencione nomes: 'Solid Grooves', 'Hellbent', 'Curitiba'.",
    dont: "Ser vago. Evite frases como 'Quero crescer' sem dizer 'como' ou 'onde'."
  }
];

const ONBOARDING_STEPS = [
  { step: 1, title: "Análise de Entrada", desc: "Faça o seu update diário no Daily Loop. Relate o que produziu, o que travou e qual sua meta para as próximas 24h." },
  { step: 2, title: "Sincronia Estratégica", desc: "Vá até o módulo Estratégia e veja se a 'Percepção' do Cérebro mudou após o seu relato. Se necessário, peça um novo conselho." },
  { step: 3, title: "Execução no Kanban", desc: "Mova as tarefas que o Cérebro injetou para a coluna 'Em Desenvolvimento'. Não tenha mais que 3 tarefas ativas ao mesmo tempo." },
  { step: 4, title: "Geração de Assets", desc: "Use o Gerador e o Design Studio apenas para as tarefas que estão no seu Kanban hoje. Evite criar 'por criar'." }
];

const GLOSSARY = [
  { term: "Ralph Loop", desc: "Metodologia de execução focada em ciclos curtos de feedback e ajuste constante de rota via IA." },
  { term: "RAG (Retrieval-Augmented Generation)", desc: "Tecnologia que permite ao Cérebro buscar no seu histórico de conversas para dar respostas personalizadas." },
  { term: "Confronto", desc: "Métrica que mede o quão ativo e desafiador você está sendo no mercado real (lançamentos, redes, gigs)." },
  { term: "Drop", desc: "O momento exato em que a sua música ou conteúdo é liberado para o público." }
];

export default function GuiaPage() {
  const [activeTab, setActiveTab] = useState<TabId>("regras");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-full p-8 md:p-12 max-w-[1200px] mx-auto w-full flex flex-col gap-10">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <BookOpen className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight italic uppercase">
              Manual de Sobrevivência
            </h1>
            <p className="text-[#FFD700] text-sm font-bold mt-1 uppercase tracking-widest">
              Protocolo Ralph Loop v2.0
            </p>
          </div>
        </div>
        <p className="text-white/60 text-lg max-w-2xl leading-relaxed mt-2">
          Não é apenas uma ferramenta, é um método de guerra para o mercado fonográfico. Siga as regras ou perca a sincronia com a engine.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-px overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id 
                ? "border-[#FFD700] text-[#FFD700]" 
                : "border-transparent text-white/40 hover:text-white/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* TAB: REGRAS DE OURO */}
        {activeTab === "regras" && (
          <motion.div
            key="regras"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RULES.map((rule, idx) => (
                <div key={idx} className="flex flex-col gap-4 bg-[#141416] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap className="w-16 h-16 text-[#FFD700]" />
                  </div>
                  <h3 className="text-[#FFD700] font-black italic uppercase tracking-tighter text-xl">
                    {rule.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {rule.content}
                  </p>
                  <div className="space-y-3 mt-auto">
                    <div className="flex gap-3 items-start p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px] font-bold mt-0.5">✓</div>
                      <p className="text-green-500/80 text-[11px] font-bold leading-tight">{rule.do}</p>
                    </div>
                    <div className="flex gap-3 items-start p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-[10px] font-bold mt-0.5">✕</div>
                      <p className="text-red-500/80 text-[11px] font-bold leading-tight">{rule.dont}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#FFD700]/5 border border-[#FFD700]/20 p-8 rounded-3xl mt-6">
              <h4 className="text-[#FFD700] font-black italic uppercase mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5" /> ATENÇÃO: SITUAÇÃO ATUAL (MILESTONE 2)
              </h4>
              <p className="text-white/80 text-sm leading-relaxed max-w-4xl">
                O NOMMAD está na fase de <strong>Consolidação de Memória</strong>. Isso significa que a IA agora "lembra" de conversas passadas. Se você mudar de nome artístico, de estilo ou de cidade, você PRECISA relatar isso explicitamente para a IA no módulo de Estratégia, ou ela continuará baseando suas dicas na persona antiga.
              </p>
            </div>
          </motion.div>
        )}

        {/* TAB: VISÃO GERAL */}
        {activeTab === "visao" && (
          <motion.div
            key="visao"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-12"
          >
            {/* Video Tutorial Placeholder */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0C] aspect-video max-h-[400px] flex items-center justify-center group cursor-pointer shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-50" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.3)] group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-black ml-1" />
                </div>
                <p className="text-white font-bold tracking-widest uppercase text-sm">Assistir Tour Rápido (3 Minutos)</p>
              </div>
            </section>

            {/* Grid de Módulos */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Módulos do Sistema</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MODULES.map((mod, idx) => (
                  <motion.div 
                    key={mod.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + (idx * 0.05) }}
                    className="bg-[#141416] border border-white/5 rounded-2xl p-6 hover:border-[#FFD700]/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.05)] transition-all group flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.bg}`}>
                        <mod.icon className={`w-5 h-5 ${mod.color}`} />
                      </div>
                      <h3 className="font-bold text-white/90 group-hover:text-white transition-colors">{mod.title}</h3>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {mod.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* TAB: PASSO A PASSO */}
        {activeTab === "passo" && (
          <motion.div
            key="passo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-8 max-w-3xl"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white">Fluxo de Trabalho Diário</h2>
              <p className="text-white/50 mt-2">Como usar o NOMMAD no seu dia a dia de estúdio.</p>
            </div>

            <div className="relative border-l-2 border-white/5 ml-4 flex flex-col gap-10">
              {ONBOARDING_STEPS.map((step, idx) => (
                <div key={step.step} className="relative pl-8">
                  {/* Bullet */}
                  <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#1A1A1E] border-2 border-[#FFD700] flex items-center justify-center text-[#FFD700] font-black text-xs shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                    {step.step}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 pt-1">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB: GLOSSÁRIO E FAQ */}
        {activeTab === "glossario" && (
          <motion.div
            key="glossario"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-12 max-w-4xl"
          >
            {/* Glossário */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-5 h-5 text-[#FFD700]" />
                <h2 className="text-2xl font-bold text-white">Glossário da Indústria</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GLOSSARY.map((item, idx) => (
                  <div key={idx} className="bg-[#141416] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors">
                    <h4 className="text-[#FFD700] font-bold text-sm uppercase tracking-widest mb-2">{item.term}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-white/5" />

            {/* FAQ Accordion */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-5 h-5 text-white/40" />
                <h2 className="text-xl font-bold text-white">Perguntas Frequentes (FAQ)</h2>
              </div>

              <div className="flex flex-col gap-4 max-w-3xl">
                {FAQS.map((faq, index) => (
                  <div 
                    key={index}
                    className={`bg-[#141416] border transition-colors rounded-2xl overflow-hidden ${
                      openFaq === index ? "border-white/20" : "border-white/5 hover:border-white/10"
                    }`}
                  >
                    <button 
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4"
                    >
                      <span className="font-bold text-white/90 text-sm md:text-base">
                        {faq.question}
                      </span>
                      <ChevronDown 
                        className={`w-5 h-5 text-white/40 transition-transform duration-300 ${
                          openFaq === index ? "rotate-180 text-[#FFD700]" : ""
                        }`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 text-white/50 text-sm leading-relaxed border-t border-white/5">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
