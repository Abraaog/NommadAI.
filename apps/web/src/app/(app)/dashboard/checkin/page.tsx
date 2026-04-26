import { requireSession } from '@/lib/supabase/server'
import { getDb } from '@/lib/db/client'
import { profiles, missions, missionTasks } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { CheckinView } from '@/components/dashboard/checkin/checkin-view'

export default async function CheckinPage() {
  const session = await requireSession()
  const db = getDb()

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, session.user.id))

  const [lastMission] = await db
    .select()
    .from(missions)
    .where(and(eq(missions.userId, session.user.id), eq(missions.status, 'active')))
    .orderBy(desc(missions.createdAt))
    .limit(1)

  // Se n\u00e3o houver rela\u00e7\u00e3o configurada no schema.ts, fazemos manual
  let tasks: string[] = []
  if (lastMission) {
    const dbTasks = await db.select().from(missionTasks).where(eq(missionTasks.missionId, lastMission.id))
    tasks = dbTasks.map(t => t.descricao)
  }

const currentProfile = {
    nivel: profile?.stage || 'iniciante',
    confronto: profile?.confrontoLevel || 1,
    missao_atual: lastMission ? {
      missoes: [{ 
        id: 'M1', 
        titulo: lastMission.titulo, 
        descricao: lastMission.descricao,
        criterio: lastMission.descricao,
        bounty: '10 pontos',
        tipo: 'daily',
        prazo_horas: (lastMission.duracaoDias || 7) * 24
      }]
    } : null,
    analise_recente: null
  }

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#0F0F13]">
      <CheckinView currentProfile={currentProfile} />
    </div>
  )
}
