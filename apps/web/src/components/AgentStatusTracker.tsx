'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase/client'

type AgentStatus = 'idle' | 'running' | 'degraded' | 'error' | 'done';

export function AgentStatusTracker() {
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>({
    Cleaner: 'idle',
    Strategist: 'idle',
    Generator: 'idle',
    Reviewer: 'idle',
    Orchestrator: 'idle',
    Checkin: 'idle',
    Psycho: 'idle',
    Design: 'idle'
  })
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Realtime subscription na tabela agent_runs
    const channel = supabase
      .channel('agent-runs-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'agent_runs' },
        (payload: { new: { agent_name: string, status: string } }) => {
          const { agent_name, status } = payload.new
          if (agent_name) {
            setStatuses(prev => ({
              ...prev,
              [agent_name]: (status === 'ok' ? 'done' : status) as AgentStatus
            }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="p-4 glass rounded-lg mt-4">
      <h3 className="text-lg font-bold mb-4 text-glow">Status dos Agentes (Real-time)</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(statuses).map(([agent, status]) => (
          <div key={agent} className="flex justify-between items-center bg-[#0a0a0c] p-2 rounded border border-white/5">
            <span className="text-sm font-medium">{agent}</span>
            <span className={`text-xs px-2 py-1 rounded-full 
              ${status === 'running' ? 'bg-blue-500/20 text-blue-400 animate-pulse' : ''}
              ${status === 'done' ? 'bg-green-500/20 text-green-400' : ''}
              ${status === 'idle' ? 'bg-gray-500/20 text-gray-400' : ''}
              ${status === 'error' ? 'bg-red-500/20 text-red-400' : ''}
            `}>
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
