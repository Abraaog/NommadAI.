'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Rocket, Layers, Star, Target, TrendingUp, Shield, Award } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase/client'

export function StatsGrid() {
  const [stats, setStats] = useState({
    network: 0,
    releases: 0,
    classifications: 0,
    xp: 0,
    level: 1,
    engagement: 0,
    efficacy: 0,
    accuracy: 0,
    conversion: 0,
  })
  const [loading, setLoading] = useState(true)
  const [prevStats, setPrevStats] = useState({
    network: 0,
    releases: 0,
    classifications: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const supabase = createSupabaseClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const [
          { data: networkData },
          { data: releasesData },
          { data: classificationsData },
          { data: profileData },
          { data: contactsData },
          { data: missionsData },
          { data: sessionsData },
          { data: kanbanData },
        ] = await Promise.all([
          supabase.from('contacts').select('id').eq('user_id', user.id),
          supabase.from('releases').select('id').eq('user_id', user.id),
          supabase.from('classifications').select('id').eq('user_id', user.id),
          supabase.from('profiles').select('xp, np').eq('id', user.id).single(),
          supabase.from('contacts').select('status').eq('user_id', user.id),
          supabase.from('missions').select('id, status').eq('user_id', user.id),
          supabase.from('sessions').select('id').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
          supabase.from('kanban_cards').select('id, coluna, resultado').eq('user_id', user.id),
        ])

        const networkCount = networkData?.length || 0
        const releasesCount = releasesData?.length || 0
        const classificationsCount = classificationsData?.length || 0
        const xp = profileData?.xp || 0
        const level = Math.floor(xp / 100) + 1

        const totalContacts = contactsData?.length || 0
        const closedContacts = contactsData?.filter((c: { status: string }) => c.status === 'closed').length || 0
        const conversion = totalContacts > 0 ? Math.round((closedContacts / totalContacts) * 100) : 0

        const totalMissions = missionsData?.length || 0
        const completedMissions = missionsData?.filter((m: { status: string }) => m.status === 'completed').length || 0
        const efficacy = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 84

        const totalClassifications = classificationsData?.length || 0
        const successfulClassifications = classificationsData?.filter((c: { status: string }) => c.status === 'completed').length || 0
        const accuracy = totalClassifications > 0 ? Math.round((successfulClassifications / totalClassifications) * 100) : 92

        const sessionsLast7Days = sessionsData?.length || 0
        const engagement = Math.min(100, Math.round((sessionsLast7Days / 7) * 20 + (xp / 1000) * 30))

        setPrevStats({
          network: networkCount,
          releases: releasesCount,
          classifications: classificationsCount,
        })

        setStats({
          network: networkCount,
          releases: releasesCount,
          classifications: classificationsCount,
          xp,
          level,
          engagement,
          efficacy,
          accuracy,
          conversion,
        })
      }
      setLoading(false)
    }

    fetchStats()
  }, [])

  const cards = [
    { label: 'Network', value: stats.network, prev: prevStats.network, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: stats.network > prevStats.network },
    { label: 'Releases', value: stats.releases, prev: prevStats.releases, icon: Rocket, color: 'text-green-400', bg: 'bg-green-400/10', trend: stats.releases > prevStats.releases },
    { label: 'Analises AI', value: stats.classifications, prev: prevStats.classifications, icon: Layers, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: stats.classifications > prevStats.classifications },
    { label: 'Engajamento', value: `${stats.engagement}%`, icon: TrendingUp, color: 'text-yellow-500', bg: 'bg-yellow-500/10', trend: true },
    { label: 'Eficácia', value: `${stats.efficacy}%`, icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-400/10', trend: stats.efficacy >= 70 },
    { label: 'Acurácia', value: `${stats.accuracy}%`, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: stats.accuracy >= 80 },
    { label: 'Conversão', value: `${stats.conversion}%`, icon: Award, color: 'text-orange-500', bg: 'bg-orange-500/10', trend: stats.conversion >= 10 },
    { label: 'Nível', value: `LVL ${stats.level}`, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: true },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card rounded-2xl p-3 flex flex-col gap-2"
        >
          <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center`}>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{card.label}</p>
            <p className="text-xl font-black text-white">{loading ? '...' : card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}