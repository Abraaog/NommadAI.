'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { StatsGrid } from '@/components/dashboard/analytics/stats-grid'
import { ActivityChart } from '@/components/dashboard/analytics/activity-chart'
import { GlobalInsights } from '@/components/dashboard/analytics/global-insights'
import { TrendingUp, BarChart2, Shield, Target, Award } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'

interface Metric {
  label: string
  value: string
  trend: string
  color: string
  positive: boolean
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Eficácia de Networking', value: '--', trend: '0%', color: 'text-blue-400', positive: true },
    { label: 'Acurácia de Timeline', value: '--', trend: '0%', color: 'text-green-400', positive: true },
    { label: 'Taxa de Conversão Gigs', value: '--', trend: '0%', color: 'text-red-400', positive: false },
  ])
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState<'stable' | 'degraded' | 'error'>('stable')

  useEffect(() => {
    async function fetchMetrics() {
      const supabase = createSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const [contactsData, missionsData, kanbanData, releasesData] = await Promise.all([
          supabase.from('contacts').select('status').eq('user_id', user.id),
          supabase.from('missions').select('id, status, duracao_dias, completed_at, created_at').eq('user_id', user.id),
          supabase.from('kanban_cards').select('id, coluna, resultado').eq('user_id', user.id),
          supabase.from('releases').select('id, status, release_date, timeline').eq('user_id', user.id),
        ])

        const totalContacts = contactsData?.length || 0
        const closedContacts = contactsData?.filter((c: { status: string }) => c.status === 'closed').length || 0
        const networkingEfficacy = totalContacts > 0 ? Math.round((closedContacts / totalContacts) * 100) : 0

        const completedMissions = missionsData?.filter((m: { status: string }) => m.status === 'completed').length || 0
        const activeMissions = missionsData?.filter((m: { status: string }) => m.status === 'active').length || 0
        let timelineAccuracy = 0
        if (completedMissions > 0) {
          const onTimeMissions = missionsData?.filter((m: { completedAt: string | null, created_at: string, duracao_dias: number | null }) => {
            if (!m.completedAt || !m.created_at) return false
            const created = new Date(m.created_at).getTime()
            const completed = new Date(m.completedAt).getTime()
            const duration = m.duracao_dias || 7
            const expectedEnd = created + (duration * 24 * 60 * 60 * 1000)
            return completed <= expectedEnd
          }).length || 0
          timelineAccuracy = Math.round((onTimeMissions / completedMissions) * 100)
        } else if (activeMissions > 0) {
          timelineAccuracy = 75
        }

        const publishedCards = kanbanData?.filter((c: { coluna: string }) => c.coluna === 'publicado').length || 0
        const gigsCards = kanbanData?.filter((c: { tag: string | null, coluna: string }) => c.tag === 'gig' && c.coluna === 'publicado').length || 0
        const totalPublished = kanbanData?.filter((c: { coluna: string }) => c.coluna === 'publicado').length || 0
        const conversionRate = totalPublished > 0 ? Math.round((gigsCards / totalPublished) * 100) : 0

        const newMetrics: Metric[] = [
          { 
            label: 'Eficácia de Networking', 
            value: `${networkingEfficacy}%`, 
            trend: networkingEfficacy >= 50 ? '+5%' : '-2%', 
            color: 'text-blue-400',
            positive: networkingEfficacy >= 30
          },
          { 
            label: 'Acurácia de Timeline', 
            value: `${timelineAccuracy}%`, 
            trend: timelineAccuracy >= 80 ? '+3%' : '-5%', 
            color: 'text-green-400',
            positive: timelineAccuracy >= 70
          },
          { 
            label: 'Taxa de Conversão Gigs', 
            value: `${conversionRate}%`, 
            trend: conversionRate >= 10 ? '+2%' : '-1%', 
            color: 'text-red-400',
            positive: conversionRate >= 5
          },
        ]

        setMetrics(newMetrics)

        const hasErrors = networkingEfficacy === 0 && totalContacts === 0
        setSystemStatus(hasErrors ? 'error' : networkingEfficacy < 20 ? 'degraded' : 'stable')
      }
      setLoading(false)
    }

    fetchMetrics()
  }, [])

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-8 max-w-[1600px] mx-auto pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">Executivo</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Analytics & Insights</h1>
          <p className="text-neutral-500 text-sm">Performance artística e operacional em tempo real.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
            systemStatus === 'stable' 
              ? 'bg-green-500/10 border-green-500/20' 
              : systemStatus === 'degraded'
              ? 'bg-yellow-500/10 border-yellow-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}
        >
          <Shield className={`w-4 h-4 ${
            systemStatus === 'stable' 
              ? 'text-green-500' 
              : systemStatus === 'degraded'
              ? 'text-yellow-500'
              : 'text-red-500'
          }`} />
          <span className={`text-xs font-bold uppercase tracking-widest ${
            systemStatus === 'stable' 
              ? 'text-green-500' 
              : systemStatus === 'degraded'
              ? 'text-yellow-500'
              : 'text-red-500'
          }`}>
            {systemStatus === 'stable' ? 'Sistema Estável' : systemStatus === 'degraded' ? 'Sistema Degradado' : 'Sem Dados'}
          </span>
        </motion.div>
      </header>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <GlobalInsights />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="glass-card rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{item.label}</p>
              <h4 className={`text-2xl font-black ${item.color}`}>{loading ? '...' : item.value}</h4>
            </div>
            <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
              item.positive 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-red-500/10 text-red-500'
            }`}>
              {item.trend}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}