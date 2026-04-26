'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Send, Sparkles, CheckCircle2, ChevronRight, BarChart3 } from 'lucide-react'
import { GlassCard, Button, DialogueBox } from '@/components/ui'
import { toast } from 'sonner'

interface CheckinViewProps {
  currentProfile: {
    nivel: string
    confronto: number
    missao_atual?: any
    analise_recente?: any
  }
}

const DEFAULT_MISSION = {
  missoes: [{
    id: 'M1',
    titulo: 'Primeiros passos',
    descricao: 'Completar onboarding',
    criterio: 'N/A',
    bounty: '10 pontos',
    tipo: 'daily' as const,
    prazo_horas: 24
  }]
}

const DEFAULT_ANALISE = {
  problema_central: 'N/A',
  padrao_comportamental: 'N/A'
}

export function CheckinView({ currentProfile }: CheckinViewProps) {
  const [update, setUpdate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async () => {
    if (update.length < 10) {
      toast.error('O update precisa de pelo menos 10 caracteres.')
      return
    }

    setIsLoading(true)
    try {
      const missao = currentProfile.missao_atual || DEFAULT_MISSION
      const analise = currentProfile.analise_recente || DEFAULT_ANALISE

      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          update,
          missao_anterior: missao,
          analise_anterior: analise,
          classification_previa: {
            nivel: currentProfile.nivel,
            confronto: currentProfile.confronto
          },
        }),
      })

      if (!res.ok) throw new Error('Falha no check-in')
      
      const data = await res.json()
      setResult(data)
      toast.success('Check-in processado!')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao processar check-in.')
    } finally {
      setIsLoading(false)
    }
  }

  if (result) {
    const text = result.text || ''
    
    // Simple bold renderer function
    const renderContent = (content: string) => {
      // 1. HARDENED: Remove ALL possible JSON fragments and mission tags
      let clean = content
        .replace(/<new_mission_if_any>[\s\S]*?<\/new_mission_if_any>/gi, '') 
        .replace(/(\*\*)?Nova missão:[\s\S]*$/gi, '') 
        .replace(/\{[\s\S]*?\}/g, '') 
        .replace(/\[\]\}?(\*\*)?/g, '') 
        .replace(/\*\*\s*\*\*/g, '') 
        .replace(/\*\*\s*$/g, '')    
        .trim()
        .replace(/\*\*+$/, '')       
      
      // 2. Ensure labels have double line breaks and consistent bolding
      const labels = [
        'Taxa:', 
        'vs período anterior:', 
        'Análise de desvio:',
        'Padrão identificado:', 
        'Sugestão:', 
        'Recomendação:', 
        'Próximo check-in:'
      ]
      
      labels.forEach(label => {
        const escapedLabel = label.replace(/\*/g, '\\*')
        const regex = new RegExp(`(\\*\\*)?${escapedLabel}(\\*\\*)?\\s*`, 'gi')
        // We want: \n\n**Label:**\n 
        clean = clean.replace(regex, (match) => `\n\n**${label}**\n `)
      })

      // 3. ENHANCED: Capitalization and Paragraphs
      clean = clean
        .replace(/(\d{2}:\d{2})\s*([a-zA-Z])/g, '$1\n\n$2') 
        .replace(/(\.)\s*([a-zA-Z])/g, '$1\n\n$2')      
        // Force uppercase after newline + optional space
        .replace(/(^|[\n])\s*([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
        .trim()

      // 4. Split and render
      const lines = clean.split('\n')
      return lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-4" />
        
        if (line.startsWith('**') && line.endsWith('**')) {
          const inner = line.slice(2, -2).trim()
          return (
            <div key={i} className="mt-6 mb-2">
              <span className="text-yellow-500 font-mono text-[11px] uppercase tracking-[0.25em] opacity-90 block border-l-2 border-yellow-500/30 pl-3">
                {inner}
              </span>
            </div>
          )
        }

        return (
          <p key={i} className="text-neutral-200 text-sm leading-relaxed mb-1 px-1">
            {line}
          </p>
        )
      })
    }

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 lg:p-10 max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Analysis Column - NOMMAD Gold Theme */}
          <div className="flex-1 w-full space-y-6">
            <div className="relative group">
              {/* Outer Glow - Amber */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              
              <GlassCard className="relative p-0 overflow-hidden border-yellow-500/20 bg-black/40 backdrop-blur-xl rounded-2xl">
                {/* Scanner Line Animation - Amber */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                  <div className="w-full h-[2px] bg-yellow-500 absolute top-0 animate-[nmd-scan_4s_linear_infinite]" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(234,179,8,0.06),rgba(234,179,8,0.02),rgba(234,179,8,0.06))] bg-[length:100%_4px,3px_100%]" />
                </div>

                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-yellow-500/10 pb-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-lg rounded-full animate-pulse" />
                        <div className="relative p-4 bg-black/40 border border-yellow-500/30 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                          <Brain className="w-8 h-8 text-yellow-500" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Cérebro <span className="text-yellow-500">Nommad</span></h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                          <span className="text-[10px] text-yellow-500/70 font-mono tracking-widest uppercase">Análise em tempo real v2.0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex flex-col items-end font-mono">
                      <span className="text-[10px] text-neutral-500 uppercase">Core Status</span>
                      <span className="text-yellow-500 text-xs font-bold">OPERACIONAL</span>
                    </div>
                  </div>
                  
                  <div className="relative min-h-[300px] p-6 bg-yellow-950/10 border border-yellow-500/5 rounded-xl">
                    <div className="font-sans text-neutral-300 space-y-2">
                      {renderContent(text)}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <Button 
                      onClick={() => setResult(null)} 
                      variant="outline" 
                      className="border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500/40 transition-all font-mono text-xs tracking-widest"
                    >
                      RECALIBRAR CHECK-IN
                    </Button>
                    <div className="flex gap-4">
                       <BarChart3 className="w-4 h-4 text-yellow-500/40" />
                       <Sparkles className="w-4 h-4 text-yellow-500/40" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Holographic Mission Side Card */}
          {result.new_mission && result.new_mission.missoes?.[0] && (
            <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24">
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
                  <h3 className="text-[10px] font-black text-yellow-500/70 uppercase tracking-[0.3em]">Protocolo de Missão</h3>
                </div>
                
                <GlassCard className="p-8 border-yellow-500/30 bg-gradient-to-br from-yellow-500/[0.08] to-transparent shadow-2xl shadow-yellow-500/10 relative overflow-hidden group">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                  
                  <div className="relative space-y-6">
                    <div className="space-y-4">
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl w-fit shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-white mb-3 leading-tight tracking-tight group-hover:text-yellow-400 transition-colors">
                          {result.new_mission.missoes[0].titulo}
                        </p>
                        <div className="h-1 w-12 bg-yellow-500/30 rounded-full mb-4" />
                        <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                          {result.new_mission.missoes[0].descricao}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase font-black tracking-widest">
                        <BarChart3 className="w-3 h-3 text-yellow-500/50" />
                        Critério de Validação
                      </div>
                      <p className="text-xs text-neutral-200 leading-relaxed italic">
                        "{result.new_mission.missoes[0].criterio}"
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-[0.2em]">Recompensa</span>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 font-mono text-xl font-black">
                            {result.new_mission.missoes[0].bounty}
                          </span>
                          <span className="text-yellow-500/40 text-[10px] font-mono">NP</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-[0.2em]">Deadline</span>
                        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                          <span className="text-white text-xs font-black font-mono">
                            {result.new_mission.missoes[0].prazo_horas}H
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-10 max-w-2xl mx-auto"
    >
      <GlassCard className="p-8 space-y-6">
        <div className="flex items-center gap-3 text-yellow-500">
          <Brain className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-widest">Check-in Semanal</span>
        </div>

        <h2 className="text-2xl font-bold text-white">
          Como você está?
        </h2>

        <p className="text-neutral-400 text-sm">
          Conte-me o que rolou essa semana. O que você fez? O que não conseguiu? 
          Quais são os próximos passos?
        </p>

        <textarea
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          placeholder="Escreva seu update aqui..."
          className="w-full h-48 bg-neutral-900/50 border border-white/10 rounded-lg p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-500/50 resize-none"
        />

        <div className="flex justify-between items-center">
          <span className="text-xs text-neutral-500">{update.length} caracteres</span>
          <Button onClick={handleSubmit} disabled={isLoading || update.length < 10}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Processando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Enviar
              </span>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {currentProfile.missao_atual && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-white/10"
            >
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">
                Missão Atual
              </h3>
              <div className="bg-neutral-900/50 rounded-lg p-4 space-y-2">
                <p className="text-white font-medium">
                  {currentProfile.missao_atual.missoes?.[0]?.titulo || currentProfile.missao_atual.titulo || 'N/A'}
                </p>
                <p className="text-neutral-500 text-sm">
                  {currentProfile.missao_atual.missoes?.[0]?.descricao || currentProfile.missao_atual.descricao || 'N/A'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}