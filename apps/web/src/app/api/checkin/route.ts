import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runCheckin } from '@/lib/agents/checkin'
import { runCheckinClassifier } from '@/lib/agents/classifier'
import { requireSession } from '@/lib/supabase/server'
import { MissionSchema } from '@/lib/agents/shared'
import { PREVIEW_MODE } from '@/lib/env'
import { GROQ_CONFIGURED } from '@/lib/groq'
import { getDb } from '@/lib/db/client'
import { sessions, missions, missionTasks, profiles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

const Body = z.object({
  update: z.string().min(10),
  missao_anterior: MissionSchema,
  analise_anterior: z.object({
    problema_central: z.string(),
    padrao_comportamental: z.string(),
  }),
  classification_previa: z.object({ nivel: z.string(), confronto: z.number() }),
  historico_recente_resumido: z.string().optional(),
})

const CHECKIN_PREVIEW = PREVIEW_MODE || !GROQ_CONFIGURED

async function persistCheckin(
  userId: string,
  sessionId: string,
  result: Awaited<ReturnType<typeof runCheckin>>,
) {
  const db = getDb()

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    kind: 'checkin',
  }).onConflictDoNothing()

if (result.new_mission && result.new_mission.missoes && result.new_mission.missoes.length > 0) {
    await db.update(missions)
      .set({ status: 'abandoned' })
      .where(and(eq(missions.userId, userId), eq(missions.status, 'active')))

    for (const m of result.new_mission.missoes) {
      const missionId = crypto.randomUUID()
      await db.insert(missions).values({
        id: missionId,
        userId,
        sessionId,
        titulo: m.titulo,
        descricao: m.descricao,
        duracaoDias: Math.ceil(m.prazo_horas / 24),
        status: 'active',
      })
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = Body.parse(await req.json())

    if (CHECKIN_PREVIEW) {
      return NextResponse.json({
        text: 'Preview mode — configure ANTHROPIC_API_KEY para check-ins reais.',
        new_mission: null,
        _preview: true,
      })
    }

    const result = await runCheckin({
      update_do_artista: body.update,
      missao_anterior: body.missao_anterior,
      analise_anterior: body.analise_anterior,
      classification_previa: body.classification_previa,
      historico_recente_resumido: body.historico_recente_resumido,
    })

    // 2. Recalibrar Perfil (Classifier)
    const classification = await runCheckinClassifier({
      current_nivel: body.classification_previa.nivel,
      current_confronto: body.classification_previa.confronto,
      update_texto: body.update,
      mission_result: result.status === 'full' ? 'completed' : result.status === 'partial' ? 'partial' : 'failed',
    }).catch(err => {
      console.error('[checkin:classifier]', err)
      return null
    })

    const sessionId = crypto.randomUUID()
    const db = getDb()

    // 3. Persistir dados e atualizar perfil em paralelo
    const persistPromise = Promise.all([
      persistCheckin(session.user.id, sessionId, result),
      classification ? db.update(profiles)
        .set({ 
          stage: classification.nivel as any, 
          confrontoLevel: classification.confronto,
          // Novos campos
          faseCarreira: (classification as any).fase_carreira,
          nivelTecnico: (classification as any).nivel_tecnico,
          arquetipoEstrategico: (classification as any).arquetipo_estrategico ? JSON.stringify((classification as any).arquetipo_estrategico) : null,
          network: (classification as any).network,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, session.user.id)) : Promise.resolve()
    ])

    persistPromise.catch((err) =>
      console.error('[checkin:persist]', err instanceof Error ? err.message : err),
    )

    return NextResponse.json({
      ...result,
      classification: classification || body.classification_previa
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      console.error('[checkin:zod]', err.issues)
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    console.error('[checkin]', err)
    return NextResponse.json({ error: 'Check-in failed' }, { status: 500 })
  }
}
