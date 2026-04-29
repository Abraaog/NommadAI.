import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDb } from '@/lib/db/client'
import { requireUser } from '@/lib/supabase/server'
import { profiles, kanbanCards } from '@/lib/db/schema'
import { eq, and, desc, sql, gte, lt, count } from 'drizzle-orm'

const Body = z.object({
  cacheMedio: z.number().optional(),
  gigsFechadas: z.number().optional(),
  propostasEnviadas: z.number().optional(),
  ultimaGigData: z.string().optional(),
})

export async function GET() {
  try {
    const user = await requireUser()
    const db = getDb()

    const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1)
    const configJson = (profile?.configJson as Record<string, any>) || {}

    const cacheMedio = Number(configJson.cacheMedio) || 0
    const gigsFechadas = Number(configJson.gigsFechadas) || 0
    const propostasEnviadas = Number(configJson.propostasEnviadas) || 0
    const ultimaGigData = String(configJson.ultimaGigData || '')

    const ideiasCount = await db.select({ c: count() }).from(kanbanCards)
      .where(and(eq(kanbanCards.userId, user.id), eq(kanbanCards.coluna, 'ideias')))
    const agendadoCount = await db.select({ c: count() }).from(kanbanCards)
      .where(and(eq(kanbanCards.userId, user.id), eq(kanbanCards.coluna, 'agendado')))
    const publicadoCount = await db.select({ c: count() }).from(kanbanCards)
      .where(and(eq(kanbanCards.userId, user.id), eq(kanbanCards.coluna, 'publicado')))

    const gigsPipeline = await db.select({
      id: kanbanCards.id,
      titulo: kanbanCards.titulo,
      coluna: kanbanCards.coluna,
      tipo: kanbanCards.tipo,
      createdAt: kanbanCards.createdAt,
    }).from(kanbanCards)
      .where(and(eq(kanbanCards.userId, user.id), sql`${kanbanCards.coluna} IN ('ideias', 'agendado', 'publicado')`))
      .orderBy(desc(kanbanCards.createdAt))
      .limit(20)

    const nIdeias = Number(ideiasCount[0]?.c) || 0
    const nAgendado = Number(agendadoCount[0]?.c) || 0
    const nPublicado = Number(publicadoCount[0]?.c) || 0

    const taxaConversao = propostasEnviadas > 0 ? Math.round((gigsFechadas / propostasEnviadas) * 100) : 0
    const ultimaGigDate = ultimaGigData ? new Date(ultimaGigData) : null
    const diasSemGig = ultimaGigDate ? Math.floor((Date.now() - ultimaGigDate.getTime()) / (1000 * 60 * 60 * 24)) : null

    const receitaPotencial = Math.round((cacheMedio * nAgendado) + (cacheMedio * nIdeias * (taxaConversao / 100)))

    const historico = configJson.pipelineHistorico || { cache: [] }
    const historicoCache = Array.isArray(historico.cache) ? historico.cache : []
    const ultimoValor = historicoCache.length > 0 ? historicoCache[historicoCache.length - 1] : cacheMedio
    const variacaoCache = (cacheMedio > 0 && ultimoValor > 0 && ultimoValor !== cacheMedio) 
      ? Math.round(((cacheMedio - ultimoValor) / ultimoValor) * 100) 
      : 0

    const stats = {
      cacheMedio,
      gigsFechadas,
      propostasEnviadas,
      taxaConversao,
      diasSemGig,
      receitaPotencial,
      variacaoCache,
      pipeline: {
        ideias: nIdeias,
        agendado: nAgendado,
        publicado: nPublicado,
        gigs: gigsPipeline.map(g => ({
          id: g.id,
          titulo: g.titulo,
          coluna: g.coluna,
          tipo: g.tipo,
        })),
      },
      recommendations: generateRecommendations(nIdeias, nAgendado, nPublicado, taxaConversao),
    }

    return NextResponse.json(stats)
  } catch (err) {
    console.error('[negocio:get]', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

function generateRecommendations(ideias: number, agendado: number, publicado: number, taxa: number): string[] {
  const recs: string[] = []

  if (ideias === 0 && agendado === 0) {
    recs.push('Comece a prospectar! Adicione suas primeiras ideias de gigs.')
  }

  if (agendado === 0 && ideias > 0) {
    recs.push('Você tem ideias mas nenhuma gig confirmada. Foque em negociar!')
  }

  if (ideias > 0 && agendado > 0) {
    const ratio = ideias / agendado
    if (ratio > 4) {
      recs.push('Muitas ideias para pouca negociação. Concentre-se em fechar!')
    } else if (ratio < 1) {
      recs.push('Pipeline apertado. Hora de prospectar mais!')
    }
  }

  if (taxa > 50) {
    recs.push('Excelente taxa de conversão! Seu marketing está funcionando.')
  } else if (taxa > 0 && taxa < 20) {
    recs.push('Taxa baixa: revise suas propostas ou qualifique melhor os leads.')
  }

  if (publicado > 0) {
    recs.push('Atualize o status para "Publicado" após cada show!')
  }

  if (recs.length === 0) {
    recs.push('Pipeline vazio. Que tal adicionar uma ideia?')
  }

  return recs
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser()
    const body = Body.parse(await req.json())
    const db = getDb()
    const now = new Date()

    const [profile] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1)
    const currentConfig = (profile?.configJson as Record<string, any>) || {}

    const pipelineHistorico = currentConfig.pipelineHistorico || { cache: [] }
    
    if (body.cacheMedio !== undefined && body.cacheMedio !== currentConfig.cacheMedio) {
      const oldCache = Number(currentConfig.cacheMedio) || 0
      if (oldCache > 0) {
        pipelineHistorico.cache = [...(pipelineHistorico.cache || []), oldCache].slice(-10)
      }
    }

    const newConfig = {
      ...currentConfig,
      ...body,
      pipelineHistorico,
    }

    await db.update(profiles).set({
      configJson: newConfig,
      updatedAt: now,
    }).where(eq(profiles.id, user.id))

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    console.error('[negocio:patch]', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}