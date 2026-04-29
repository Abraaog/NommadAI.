'use server'

import { getDb } from '@/lib/db/client'
import { bossCases, kanbanCards, missions, leaderboardScores } from '@/lib/db/schema'
import { requireSession } from '@/lib/supabase/server'
import { eq, desc, and, isNotNull } from 'drizzle-orm'

export type JourneyEventType = 'boss' | 'task' | 'mission' | 'level' | 'checkpoint'

export interface JourneyEvent {
  id: string
  type: JourneyEventType
  title: string
  description: string
  date: Date
  impact: 'positive' | 'negative' | 'neutral'
  metadata?: any
}

export async function getJourneyEvents(): Promise<JourneyEvent[]> {
  const { user } = await requireSession()
  const userId = user.id

  const db = getDb()
  const events: JourneyEvent[] = []

  // 1. Fetch Boss Battles
  const cases = await db
    .select()
    .from(bossCases)
    .where(eq(bossCases.userId, userId))
    .limit(20)

  cases.forEach(c => {
    if (c.result) {
      events.push({
        id: c.id,
        type: 'boss',
        title: `Batalha contra Chefão: ${c.bossId}`,
        description: c.feedback || (c.result === 'sucesso' ? 'Vitória estratégica!' : 'Derrota estratégica.'),
        date: c.atualizadoEm || new Date(),
        impact: c.result === 'sucesso' ? 'positive' : 'negative',
        metadata: { result: c.result }
      })
    }
  })

  // 2. Fetch Kanban Completions
  const cards = await db
    .select()
    .from(kanbanCards)
    .where(and(eq(kanbanCards.userId, userId), eq(kanbanCards.coluna, 'publicado')))
    .limit(20)

  cards.forEach(card => {
    events.push({
      id: card.id,
      type: 'task',
      title: `Tarefa Concluída: ${card.titulo}`,
      description: card.insights || 'Execução finalizada com sucesso.',
      date: card.updatedAt || new Date(),
      impact: 'positive',
      metadata: { tag: card.tag }
    })
  })

  // 3. Fetch Missions
  const userMissions = await db
    .select()
    .from(missions)
    .where(eq(missions.userId, userId))
    .limit(10)

  userMissions.forEach(m => {
    events.push({
      id: m.id,
      type: 'mission',
      title: m.status === 'completed' ? `Missão Finalizada: ${m.titulo}` : `Nova Missão Iniciada: ${m.titulo}`,
      description: m.descricao || '',
      date: m.completedAt || m.createdAt || new Date(),
      impact: m.status === 'completed' ? 'positive' : 'neutral',
    })
  })

  // Sort by date descending
  return events.sort((a, b) => b.date.getTime() - a.date.getTime())
}
