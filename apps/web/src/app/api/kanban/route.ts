import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireSession } from '@/lib/supabase/server'
import { PREVIEW_MODE } from '@/lib/env'
import { getDb } from '@/lib/db/client'
import { kanbanCards, kanbanCardLogs, missions } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

const KanbanColuna = z.enum(['ideias', 'em_desenvolvimento', 'agendado', 'publicado', 'arquivado'])
const CardTipo = z.enum(['conteudo', 'musica', 'branding'])

const CreateBody = z.object({
  titulo: z.string().min(1).max(200),
  tipo: CardTipo.default('conteudo'),
  coluna: KanbanColuna.default('ideias'),
  source: z.string().optional(),
  tag: z.string().optional(),
  relacaoMissaoId: z.string().uuid().optional().nullable(),
})

const UpdateBody = z.object({
  id: z.string().uuid(),
  coluna: KanbanColuna.optional(),
  titulo: z.string().min(1).max(200).optional(),
  source: z.string().optional(),
  tag: z.string().optional(),
  resultado: z.enum(['viralizou', 'normal', 'flopou']).optional(),
  insights: z.string().optional(),
  metricas: z.any().optional(),
  relacaoMissaoId: z.string().uuid().optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession()
    if (PREVIEW_MODE) return NextResponse.json({ cards: [] })

    const db = getDb()
    const cards = await db
      .select()
      .from(kanbanCards)
      .where(eq(kanbanCards.userId, session.user.id))
      .orderBy(kanbanCards.createdAt)

    return NextResponse.json({ cards })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = CreateBody.parse(await req.json())

    if (PREVIEW_MODE) {
      return NextResponse.json({ id: crypto.randomUUID(), ...body, _preview: true })
    }

    const db = getDb()
    const [card] = await db
      .insert(kanbanCards)
      .values({ userId: session.user.id, ...body })
      .returning()

    // Log creation
    await db.insert(kanbanCardLogs).values({
      cardId: card.id,
      userId: session.user.id,
      action: 'create',
      details: { title: card.titulo }
    })

    return NextResponse.json(card)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = UpdateBody.parse(await req.json())

    if (PREVIEW_MODE) {
      return NextResponse.json({ ok: true, _preview: true })
    }

    const db = getDb()
    
    // Get old card for logging
    const [oldCard] = await db.select().from(kanbanCards).where(eq(kanbanCards.id, body.id))

    const set: Partial<typeof kanbanCards.$inferInsert> = {}
    if (body.coluna) set.coluna = body.coluna
    if (body.titulo) set.titulo = body.titulo
    if (body.source) set.source = body.source
    if (body.tag) set.tag = body.tag
    if (body.resultado) set.resultado = body.resultado
    if (body.insights !== undefined) set.insights = body.insights
    if (body.metricas !== undefined) set.metricas = body.metricas
    if (body.relacaoMissaoId !== undefined) set.relacaoMissaoId = body.relacaoMissaoId
    set.updatedAt = new Date()

    await db
      .update(kanbanCards)
      .set(set)
      .where(and(eq(kanbanCards.id, body.id), eq(kanbanCards.userId, session.user.id)))

    // Log update
    if (oldCard) {
      const changes: Record<string, any> = {}
      for (const key in set) {
        if (key === 'updatedAt') continue
        const oldVal = (oldCard as any)[key]
        const newVal = (set as any)[key]
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          changes[key] = { old: oldVal, new: newVal }
        }
      }
      
      if (Object.keys(changes).length > 0) {
        await db.insert(kanbanCardLogs).values({
          cardId: body.id,
          userId: session.user.id,
          action: body.coluna && body.coluna !== oldCard.coluna ? 'move' : 'edit',
          details: changes
        })
      }
    }

    // Auto-complete mission if all linked tasks are published
    const mid = body.relacaoMissaoId || (oldCard as any)?.relacaoMissaoId
    if (mid && (body.coluna === 'publicado' || oldCard?.coluna === 'publicado')) {
      const linkedTasks = await db.select().from(kanbanCards).where(eq(kanbanCards.relacaoMissaoId, mid))
      const allDone = linkedTasks.every(t => {
        if (t.id === body.id) return body.coluna === 'publicado'
        return t.coluna === 'publicado'
      })
      if (allDone && linkedTasks.length > 0) {
        await db.update(missions).set({ status: 'completed' }).where(eq(missions.id, mid))
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireSession()
    const { id } = z.object({ id: z.string().uuid() }).parse(await req.json())

    if (PREVIEW_MODE) return NextResponse.json({ ok: true, _preview: true })

    const db = getDb()
    await db
      .delete(kanbanCards)
      .where(and(eq(kanbanCards.id, id), eq(kanbanCards.userId, session.user.id)))

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
