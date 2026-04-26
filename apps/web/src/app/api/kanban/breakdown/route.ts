import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/supabase/server'
import { getDb } from '@/lib/db/client'
import { missions, identity, profiles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { runBreakdown } from '@/lib/agents/breakdown'

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const { missionId } = await req.json()

    if (!missionId) {
      return NextResponse.json({ error: 'Missing missionId' }, { status: 400 })
    }

    const db = getDb()

    // 1. Fetch Mission
    const [mission] = await db
      .select()
      .from(missions)
      .where(and(eq(missions.id, missionId), eq(missions.userId, session.user.id)))
    
    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
    }

    // 2. Fetch Identity Context
    const [userIdentity] = await db
      .select()
      .from(identity)
      .where(eq(identity.userId, session.user.id))

    const [userProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, session.user.id))

    const identityContext = userIdentity 
      ? `Essência: ${userIdentity.essencia}. Teses: ${JSON.stringify(userIdentity.tesesCentrais)}`
      : 'Identidade ainda não mapeada.'

    // 3. Run Breakdown Agent
    const result = await runBreakdown(
      {
        titulo: mission.titulo,
        descricao: mission.descricao || '',
        criterio: mission.descricao || '', // Mission table doesn't have criterio, using descricao as fallback
      },
      {
        identity: identityContext,
        phase: userProfile?.faseCarreira || 'Não informada',
      }
    )

    return NextResponse.json({ tasks: result.tasks, missionId })
  } catch (err) {
    console.error('[BREAKDOWN_API_ERROR]', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
