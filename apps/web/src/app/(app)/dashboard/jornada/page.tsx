'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, CheckCircle2, AlertCircle, Calendar, 
  History, Swords, Zap, Milestone, ChevronRight, 
  Star, Flame, Target, Award, Crown
} from 'lucide-react'
import { getJourneyEvents, type JourneyEvent } from '@/lib/actions/journey'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function JourneyPage() {
const [events, setEvents] = useState<JourneyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const data = await getJourneyEvents()
      setEvents(data)
      setLoading(false)
    }
    load()
  }, [])

  // Calcular stats uma única vez com useMemo
  const stats = useMemo(() => {
    const vitorias = events.filter(e => e.impact === 'positive').length
    const missoes = events.filter(e => e.type === 'mission').length
    return {
      totalEvents: events.length,
      vitorias,
      missoes,
      currentStreak: Math.min(vitorias, 7)
    }
  }, [events])

  const getEventIcon = (type: string, impact: string) => {
    const baseClass = "w-12 h-12 rounded-full flex items-center justify-center"
    switch(type) {
      case 'boss':
        return `${baseClass} ${impact === 'positive' ? 'bg-yellow-500' : 'bg-red-500'}`
      case 'task':
        return `${baseClass} bg-green-500`
      case 'mission':
        return `${baseClass} ${impact === 'positive' ? 'bg-blue-500' : 'bg-neutral-700'}`
      case 'level':
        return `${baseClass} bg-purple-500`
      default:
        return `${baseClass} bg-neutral-600`
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin" />
        <p className="text-[#FFD700] font-mono text-sm animate-pulse">CARREGANDO JORNADA...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Header Gamificado */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
              <Crown className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                SUA JORNADA
              </h1>
              <p className="text-white/50 text-sm">
                {stats.totalEvents} eventos • {stats.vitorias} vitórias
              </p>
            </div>
          </div>
          
          {/* Streak Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-orange-500 font-bold">{stats.currentStreak}</span>
            <span className="text-orange-500/60 text-xs">dias</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
        >
          <Trophy className="w-6 h-6 text-[#FFD700] mx-auto mb-2" />
          <p className="text-2xl font-black text-white">{stats.vitorias}</p>
          <p className="text-xs text-white/50 uppercase">Vitórias</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
        >
          <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-black text-white">{stats.missoes}</p>
          <p className="text-xs text-white/50 uppercase">Missões</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
        >
          <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-black text-white">{stats.totalEvents}</p>
          <p className="text-xs text-white/50 uppercase">Eventos</p>
        </motion.div>
      </div>

      {/* Timeline Principal */}
      {events.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-12 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-4">
            <Star size={40} className="text-[#FFD700]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sua jornada começa agora!</h3>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Complete missões, derrote chefões e conquiste recompensas para construir sua história.
          </p>
          
          {/* Progresso inicial */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Progresso</span>
              <span>0%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '5%' }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="relative"
        >
          {/* Linha central */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FFD700] via-white/20 to-transparent" />
          
          {events.map((event, idx) => (
            <motion.div 
              key={event.id}
              variants={item}
              className="relative pl-16 mb-6 group"
            >
              {/* Marker Gamificado */}
              <motion.div 
                whileHover={{ scale: 1.2 }}
                className={`absolute left-0 top-0 w-12 h-12 rounded-full border-4 border-[#0F0F13] z-10 flex items-center justify-center cursor-pointer transition-all
                  ${event.impact === 'positive' ? 'bg-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.4)]' : event.impact === 'negative' ? 'bg-red-500' : 'bg-neutral-700'}`}
                onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
              >
                {event.type === 'boss' && <Swords size={18} className={event.impact === 'positive' ? 'text-black' : 'text-white'} />}
                {event.type === 'task' && <CheckCircle2 size={18} className="text-black" />}
                {event.type === 'mission' && <Zap size={18} className="text-white" />}
                {event.type === 'level' && <Award size={18} className="text-white" />}
              </motion.div>

              {/* Card Interativo */}
              <motion.div 
                whileHover={{ x: 4 }}
                className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.05] hover:border-[#FFD700]/30 transition-all cursor-pointer"
                onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                      ${event.impact === 'positive' ? 'bg-[#FFD700]/20 text-[#FFD700]' : event.impact === 'negative' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/50'}`}
                    >
                      {event.type}
                    </span>
                    {event.impact === 'positive' && (
                      <Star size={12} className="text-[#FFD700]" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 font-mono">
                      {format(event.date, "dd MMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white mb-1 group-hover:text-[#FFD700] transition-colors">
                  {event.title}
                </h4>
                <motion.p 
                  layout
                  className={`text-sm text-white/60 ${expandedId === event.id ? '' : 'line-clamp-2'}`}
                >
                  {event.description}
                </motion.p>
                
                <AnimatePresence>
                  {expandedId === event.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
                    >
                      {event.metadata ? (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(event.metadata).map(([key, value]) => (
                            <div key={key} className="flex flex-col p-2 bg-white/5 rounded-lg border border-white/5 min-w-[100px]">
                              <span className="text-[9px] uppercase tracking-widest text-white/40 mb-1">{key}</span>
                              <span className="text-xs font-bold text-white">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-white/30 italic">Sem metadados adicionais para este evento.</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Indicador deClick */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center"
              >
                <ChevronRight size={12} className="text-black" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Footer com Dicas */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white/5 border border-white/10 rounded-full px-6 py-2 flex items-center gap-3"
      >
        <Target className="w-4 h-4 text-[#FFD700]" />
        <p className="text-xs text-white/60">
          Toque em um evento para ver detalhes
        </p>
      </motion.div>
    </div>
  )
}