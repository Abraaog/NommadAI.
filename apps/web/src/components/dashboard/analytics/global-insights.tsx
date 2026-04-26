'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, TrendingUp, AlertTriangle, ShieldCheck, Users, Rocket, Zap, Brain } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'

interface Insight {
  title: string
  description: string
  icon: typeof Lightbulb
  color: string
  bg: string
}

export function GlobalInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInsights() {
      const supabase = createSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const newInsights: Insight[] = []

        const [contactsData, releasesData, missionsData, kanbanData, profileData, sessionsData] = await Promise.all([
          supabase.from('contacts').select('status, category').eq('user_id', user.id),
          supabase.from('releases').select('id, status').eq('user_id', user.id),
          supabase.from('missions').select('id, status, duracao_dias').eq('user_id', user.id),
          supabase.from('kanban_cards').select('id, coluna, resultado').eq('user_id', user.id),
          supabase.from('profiles').select('xp, genre').eq('id', user.id).single(),
          supabase.from('sessions').select('id, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(7),
        ])

        const genre = profileData?.genre || 'music'
        const closedContacts = contactsData?.filter((c: { status: string }) => c.status === 'closed').length || 0
        const totalContacts = contactsData?.length || 0
        if (totalContacts > 0 && closedContacts > 0) {
          const growth = Math.round((closedContacts / totalContacts) * 100)
          newInsights.push({
            title: 'Expansão de Network',
            description: `${closedContacts} de ${totalContacts} contatos fechados. Taxa de conversão de ${growth}%.`,
            icon: Users,
            color: 'text-green-400',
            bg: 'bg-green-400/10'
          })
        }

const released = releasesData?.filter((r: { status: string }) => r.status === 'released').length || 0

        const activeMissions = missionsData?.filter((m: { status: string }) => m.status === 'active').length || 0
        const completedMissions = missionsData?.filter((m: { status: string }) => m.status === 'completed').length || 0
        if (activeMissions > 0 || completedMissions > 0) {
          const efficacy = completedMissions + activeMissions > 0 
            ? Math.round((completedMissions / (completedMissions + activeMissions)) * 100) 
            : 0
          if (efficacy >= 70) {
            newInsights.push({
              title: 'Eficácia de Missões',
              description: `${efficacy}% de missões concluídas. ${activeMissions} ativas no momento.`,
              icon: Zap,
              color: 'text-yellow-500',
              bg: 'bg-yellow-500/10'
            })
          } else if (activeMissions > 0) {
            newInsights.push({
              title: 'Foco Necessário',
              description: `${activeMissions} missões ativas. ${efficacy}% de conclusão. Complete para avançar.`,
              icon: AlertTriangle,
              color: 'text-orange-500',
              bg: 'bg-orange-500/10'
            })
          }
        }

        const publishedCards = kanbanData?.filter((c: { coluna: string }) => c.coluna === 'publicado').length || 0
        const viralCards = kanbanData?.filter((c: { resultado: string | null }) => c.resultado === 'viralizou').length || 0
        if (publishedCards > 0) {
          newInsights.push({
            title: 'Performance de Conteúdo',
            description: `${publishedCards} conteúdos publicados. ${viralCards} viralizaram.`,
            icon: TrendingUp,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
          })
        }

        const recentSessions = sessionsData?.length || 0
        if (genre && recentSessions < 3) {
          newInsights.push({
            title: 'Oportunidade Estratégica',
            description: `Baseado no seu gênero (${genre}). Há oportunidades de networking em eventos da cena.`,
            icon: Lightbulb,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
          })
        }
        if (recentSessions >= 5) {
          newInsights.push({
            title: 'Consistência de Uso',
            description: `${recentSessions} interações esta semana. Continue mantendo o ritmo!`,
            icon: Brain,
            color: 'text-cyan-400',
            bg: 'bg-cyan-400/10'
          })
        } else if (recentSessions > 0) {
          newInsights.push({
            title: ' building Momentum',
            description: `${recentSessions} interações esta semana.Meta: 5+ para máximo de XP.`,
            icon: Lightbulb,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
          })
        } else {
          newInsights.push({
            title: 'Comece uma Sessão',
            description: 'Nenhuma sessão esta semana. Inicie um check-in para gain XP.',
            icon: AlertTriangle,
            color: 'text-red-400',
            bg: 'bg-red-400/10'
          })
        }

        if (newInsights.length === 0) {
          newInsights.push({
            title: 'Bem-vindo ao NOOMMAD',
            description: 'Complete o onboarding para começar a trackear seu progresso.',
            icon: ShieldCheck,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
          })
        }

        setInsights(newInsights)
      }
      setLoading(false)
    }

    fetchInsights()
  }, [])

  const icons = [Lightbulb, TrendingUp, AlertTriangle, ShieldCheck, Users, Rocket, Zap, Brain]

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-white">Cérebro Global: Insights</h3>
        <p className="text-sm text-neutral-500">Análise estratégica cross-módulo</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          insights.map((insight, i) => {
            const IconComponent = icons[i % icons.length]
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${insight.bg} flex items-center justify-center shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${insight.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{insight.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{insight.description}</p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}