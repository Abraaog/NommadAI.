'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase/client'

export function ActivityChart() {
  const [data, setData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
  const [loading, setLoading] = useState(true)
  const [score, setScore] = useState(0)

  useEffect(() => {
    async function fetchActivity() {
      const supabase = createSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const days: string[] = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          days.push(d.toISOString().split('T')[0])
        }

        const activityPromises = days.map(day => {
          const startOfDay = `${day}T00:00:00.000Z`
          const endOfDay = `${day}T23:59:59.999Z`
          
          return Promise.all([
            supabase.from('sessions').select('id').eq('user_id', user.id).gte('created_at', startOfDay).lte('created_at', endOfDay),
            supabase.from('kanban_cards').select('id').eq('user_id', user.id).gte('created_at', startOfDay).lte('created_at', endOfDay),
            supabase.from('contacts').select('id').eq('user_id', user.id).gte('created_at', startOfDay).lte('created_at', endOfDay),
            supabase.from('missions').select('id').eq('user_id', user.id).gte('created_at', startOfDay).lte('created_at', endOfDay),
          ])
        })

        const results = await Promise.all(activityPromises)
        
        const activityScores = results.map(([sessions, cards, contacts, missions]) => {
          const s = sessions?.length || 0
          const c = cards?.length || 0
          const ct = contacts?.length || 0
          const m = missions?.length || 0
          return (s * 3) + (c * 2) + (ct * 3) + (m * 5)
        })

        setData(activityScores as number[])
        
        const totalScore = activityScores.reduce((a: number, b: number) => a + b, 0)
        setScore(Math.min(100, Math.round(totalScore / 5)))
      }
      setLoading(false)
    }

    fetchActivity()
  }, [])

  const max = Math.max(...data, 1)
  const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
  
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Engajamento do Sistema</h3>
          <p className="text-sm text-neutral-500">Atividade total nos últimos 7 dias</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{loading ? '...' : `${score} pts`}</span>
        </div>
      </div>

      <div className="relative h-48 w-full mt-4">
        <svg viewBox="0 0 700 200" className="w-full h-full preserve-3d">
          <defs>
            <linearGradient id="gradientReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <motion.path
            initial={{ d: "M 0 200 L 700 200 L 0 200 Z", opacity: 0 }}
            animate={{ 
              d: `M 0 200 ${data.map((v, i) => `L ${i * 100} ${200 - (v / max) * 150}`).join(' ')} L 600 200 Z`,
              opacity: 1 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            fill="url(#gradientReal)"
          />

          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={`M 0 ${200 - (data[0] / max) * 150} ${data.slice(1).map((v, i) => `L ${(i + 1) * 100} ${200 - (v / max) * 150}`).join(' ')}`}
            fill="none"
            stroke="rgb(234, 179, 8)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((v, i) => (
            <motion.circle
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              cx={i * 100}
              cy={200 - (v / max) * 150}
              r="6"
              fill="#0a0a0c"
              stroke="rgb(234, 179, 8)"
              strokeWidth="3"
            />
          ))}
        </svg>

        <div className="flex justify-between mt-4">
          {dayLabels.map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{day}</span>
              <span className="text-[9px] text-neutral-500">{loading ? '-' : data[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}