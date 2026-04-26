"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Zap, MessageSquare, Music, Palette, Brain, BarChart3, Clock, Target, Shield, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const agents = [
  {
    icon: Target,
    title: "Strategist Agent",
    description: "Define o norte. Analisa seu momento atual e traça a rota crítica para o próximo nível de carreira.",
  },
  {
    icon: Brain,
    title: "Psycho Agent",
    description: "Identifica autossabotagem. O agente que te confronta quando você para de executar o que importa.",
  },
  {
    icon: MessageSquare,
    title: "Cleaner Agent",
    description: "Transforma o caos em clareza. Mande um áudio bruto e receba um plano de ação estruturado em minutos.",
  },
  {
    icon: Rocket,
    title: "Release System",
    description: "A engine de lançamentos. Do cronograma de produção ao plano de marketing para o dia do drop.",
  },
  {
    icon: Shield,
    title: "A&R Agent",
    description: "Seu filtro de qualidade. Analisa suas tracks com o ouvido de quem decide o que entra nas grandes labels.",
  },
  {
    icon: BarChart3,
    title: "Network Builder",
    description: "CRM Artístico. Mapeia e gerencia seus contatos com contratantes, labels e outros artistas.",
  },
];

const stats = [
  { value: "R$ 0", label: "Gasto em Gestores" },
  { value: "10 min", label: "Tempo p/ Plano" },
  { value: "8", label: "Agentes Ativos" },
  { value: "24/7", label: "Disponibilidade" },
];

export default function LandingPage() {
  const scrollToMethod = () => {
    document.getElementById('metodo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background selection:bg-yellow-500/30">
      <Navbar />
      
      {/* Hero Section with Studio Background */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-4 md:px-6 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/dark_studio.png" 
            alt="Dark Studio Background" 
            fill 
            className="object-cover opacity-40 grayscale-[0.5]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-yellow-500/20 backdrop-blur-xl"
          >
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] md:text-xs font-bold text-yellow-500 tracking-widest uppercase">Acesso Exclusivo por Aplicação</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.95]"
          >
            Do Áudio ao Plano em <br />
            <span className="text-yellow-500 text-glow-amber italic">10 Minutos.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-neutral-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            O primeiro <span className="text-white font-bold">Artist OS</span> projetado para escalar carreiras reais na música eletrônica. 
            Sua estratégia de anos, executada em semanas.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" glow className="px-12 py-8 text-xl font-black uppercase tracking-tight">Quero meu Plano Estratégico</Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-8 text-xl border-white/20 hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-500 backdrop-blur-md transition-all"
              onClick={scrollToMethod}
            >
              Ver o Método
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 md:px-6 border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-[10px] text-yellow-500 uppercase tracking-widest font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section id="metodo" className="py-24 md:py-40 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-3 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6">Metodologia Diogo O'Band</div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Pare de brincar de ser <br /><span className="text-yellow-500 italic">"produtor de conteúdo".</span></h2>
            <p className="text-neutral-400 text-xl mb-10 leading-relaxed">
              O NOMMAD AI não é uma ferramenta de postar no Instagram. É um sistema de inteligência orquestrada. 
              Nós não te damos "ideias de reels". Nós te damos um mapa de mercado, uma rede de contatos e a direção exata para sua próxima gig.
            </p>
            <div className="space-y-6">
              <div className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Fim da Ansiedade</h4>
                  <p className="text-neutral-500 text-sm">Direção clara todos os dias. Você sabe exatamente o que fazer ao acordar.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Execução Implacável</h4>
                  <p className="text-neutral-500 text-sm">O Psycho Agent identifica seus padrões de procrastinação e te traz de volta pro jogo.</p>
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <Link href="/register">
                <Button size="lg" glow className="px-10 py-7 text-lg font-black uppercase tracking-tight">Quero meu Plano Estratégico</Button>
              </Link>
            </motion.div>
          </div>
          <div className="relative group">
            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-yellow-500/10 blur-[60px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <GlassCard className="relative p-1.5 border-white/10 overflow-hidden backdrop-blur-2xl bg-black/40 rotate-1 group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-white/5">
                <Image 
                  src="/images/dashboard_mockup.png" 
                  alt="NOMMAD AI Dashboard Interface" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="glass px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md">
                    <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-1">Status do Sistema</p>
                    <p className="text-white font-bold text-sm">8 AGENTES ONLINE</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center glow-accent">
                    <Zap className="w-6 h-6 text-black fill-black" />
                  </div>
                </div>
              </div>
            </GlassCard>
            
            {/* Second card behind for depth */}
            <div className="absolute -bottom-6 -right-6 -left-6 h-full -z-10 bg-white/5 border border-white/10 rounded-2xl blur-sm -rotate-2" />
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section id="recursos" className="py-24 md:py-32 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Oito Especialistas. <span className="text-yellow-500">Uma Só Mente.</span></h2>
          <p className="text-neutral-400 text-xl max-w-2xl mx-auto">Sua equipe de estratégia pessoal, disponível 24/7 para cada fase da sua carreira.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full border-white/5 hover:border-yellow-500/20 transition-all group bg-black/20 backdrop-blur-xl">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <agent.icon className="w-7 h-7 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{agent.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {agent.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-24 md:py-40 px-4 md:px-6 bg-black/60 border-y border-white/5 relative z-10 backdrop-blur-md">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Módulos de Escala</h2>
          <p className="text-neutral-400 text-xl mb-20">Selecione o nível de interferência estratégica na sua carreira.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            <GlassCard hover={false} className="glass-card text-left border-white/10 flex flex-col p-10 md:p-14 bg-black/40">
              <h3 className="text-3xl font-bold mb-2">Pro</h3>
              <p className="text-neutral-500 mb-8">Para artistas em fase de estruturação e crescimento.</p>
              <div className="text-5xl font-black mb-10 text-white">R$ 500<span className="text-base text-neutral-500 font-medium">/mês</span></div>
              
              <ul className="space-y-5 mb-12 flex-grow">
                {[
                  "Onboarding Estratégico Diogo O'Band",
                  "8 Agentes Core Disponíveis 24/7",
                  "Kanban de Lançamentos 2.0",
                  "Acesso ao Release System",
                  "Análise de Mercado Semanal"
                ].map(item => (
                  <li key={item} className="flex items-center gap-4 text-neutral-300">
                    <CheckCircle2 className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/register">
                <Button variant="outline" className="w-full py-8 text-lg font-bold border-white/10 hover:bg-white/5">Aplicar para o Pro</Button>
              </Link>
            </GlassCard>

            <GlassCard hover={false} className="text-left border-yellow-500/40 relative glass-accent flex flex-col p-10 md:p-14 bg-yellow-500/[0.02]">
              <div className="absolute top-8 right-10 px-4 py-1.5 bg-yellow-500 text-black text-[10px] font-black rounded uppercase tracking-widest">Recomendado</div>
              <h3 className="text-3xl font-bold mb-2">Premium</h3>
              <p className="text-neutral-400 mb-8">Acompanhamento agressivo para artistas em escala.</p>
              <div className="text-5xl font-black mb-10 text-white">R$ 1.500<span className="text-base text-neutral-600 font-medium">/mês</span></div>
              
              <ul className="space-y-5 mb-12 flex-grow">
                {[
                  "Tudo do plano Pro",
                  "Psycho Agent Ativado (Modo Confronto)",
                  "Consultoria em Grupo (Call Mensal)",
                  "Análise de Perfil Profunda Trimestral",
                  "Prioridade na Fila de Processamento"
                ].map(item => (
                  <li key={item} className="flex items-center gap-4 text-white font-medium">
                    <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/register">
                <Button variant="primary" className="w-full py-8 text-xl font-black" glow>Aplicar para o Premium</Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-24 md:py-32 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Vozes da <span className="text-yellow-500">Escala.</span></h2>
          <p className="text-neutral-400 text-xl max-w-2xl mx-auto">Artistas que pararam de tentar e começaram a executar com precisão.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Victor Lou",
              role: "Shark",
              quote: "O NOMMAD AI trouxe uma clareza que eu não conseguia nem com uma equipe de 5 pessoas. É cirúrgico.",
              avatar: "/images/avatars/vlou.png"
            },
            {
              name: "Duarte",
              role: "Underground Artist",
              quote: "O Strategist Agent definiu meu próximo lançamento e foi o meu melhor resultado em 2 anos de carreira.",
              avatar: "/images/avatars/duarte.png"
            },
            {
              name: "Meca",
              role: "Mainstage Artist",
              quote: "Finalmente um sistema que entende a rotina de tour e produção. O Cleaner Agent me economiza horas por dia.",
              avatar: "/images/avatars/meca.png"
            }
          ].map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-10 border-white/5 bg-black/20 backdrop-blur-xl h-full flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-neutral-300 text-lg italic mb-10 flex-grow">"{item.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-800 overflow-hidden border border-white/10 flex items-center justify-center">
                    {/* Placeholder for avatar */}
                    <div className="w-full h-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold">
                      {item.name[0]}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{item.name}</h4>
                    <p className="text-yellow-500 text-[10px] uppercase font-black tracking-widest">{item.role}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-56 px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="glass-accent py-24 md:py-32 px-10 bg-black/40" hover={false}>
              <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">O próximo hit não é sobre sorte. <br />É sobre <span className="text-yellow-500">direção.</span></h2>
              <p className="text-neutral-400 text-xl mb-12 max-w-xl mx-auto">
                As vagas para o ciclo atual estão quase esgotadas. Inicie seu onboarding e descubra se o seu projeto está pronto para a escala do NOMMAD.
              </p>
              <Link href="/register">
                <Button size="lg" glow className="px-20 py-10 text-2xl font-black uppercase tracking-tighter">Iniciar Onboarding Agora</Button>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 px-4 md:px-6 bg-black/40 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-black text-2xl">N</div>
              <span className="text-white font-bold tracking-tighter text-2xl uppercase">NOMMAD AI<span className="text-yellow-500">.</span></span>
            </div>
            <p className="text-neutral-500 leading-relaxed max-w-xs">
              Sua equipe de inteligência estratégica pessoal. Treinada na cena, projetada para escala.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-20 gap-y-8">
            <div className="space-y-6">
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.3em]">Plataforma</h4>
              <nav className="flex flex-col gap-3">
                <Link href="#" className="text-neutral-500 hover:text-yellow-500 transition-colors">Dashboard</Link>
                <Link href="#" className="text-neutral-500 hover:text-yellow-500 transition-colors">Chefões</Link>
                <Link href="#" className="text-neutral-500 hover:text-yellow-500 transition-colors">Metodologia</Link>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.3em]">Legal</h4>
              <nav className="flex flex-col gap-3">
                <Link href="#" className="text-neutral-500 hover:text-yellow-500 transition-colors">Termos</Link>
                <Link href="#" className="text-neutral-500 hover:text-yellow-500 transition-colors">Privacidade</Link>
              </nav>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-neutral-800 mb-2 font-mono">ESTABLISHED 2026</p>
            <p className="text-xs text-neutral-800">© NOMMAD AI. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}