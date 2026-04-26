import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireSession } from '@/lib/supabase/server'
import { PREVIEW_MODE } from '@/lib/env'
import { getDb } from '@/lib/db/client'
import { classifications } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { runJsonAgent } from '@/lib/agents/shared'
import { memoryService } from '@/lib/brain/memory-service'

const CreateBody = z.object({
  source: z.string().min(1),
  type: z.enum(['link', 'file']),
})

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession()
    
    // In PREVIEW_MODE or if DB is not ready, return mock data
    if (PREVIEW_MODE) {
      return NextResponse.json([
        {
          id: '1',
          source: 'https://spotify.com/track/123',
          type: 'link',
          category: 'Single',
          status: 'completed',
          result: { confidence: 98, genre: 'Electronic', bpm: 124 },
          justification: 'Análise baseada nos metadados do Spotify e histórico do artista.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        }
      ])
    }

    const db = getDb()
    const results = await db
      .select()
      .from(classifications)
      .where(eq(classifications.userId, session.user.id))
      .orderBy(desc(classifications.createdAt))

    return NextResponse.json(results)
  } catch (err) {
    console.error('GET classifications error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = CreateBody.parse(await req.json())

    if (PREVIEW_MODE) {
      return NextResponse.json({
        id: crypto.randomUUID(),
        ...body,
        category: 'Processando...',
        status: 'processing',
        createdAt: new Date().toISOString(),
      })
    }

    const db = getDb()
    
    // 0. Fetch User Context
    const memories = await memoryService.searchContext({
      userId: session.user.id,
      query: "objetivos carreira identidade estilo musical subgenero",
      limit: 3
    })
    const userContext = memories.map(m => m.content).join('\n---\n')

    // 1. Insert as pending
    const [newItem] = await db
      .insert(classifications)
      .values({
        userId: session.user.id,
        source: body.source,
        type: body.type,
        status: 'processing',
        category: 'Analisando...',
      })
      .returning()

    // 2. Real Brain Classification
    const runAnalysis = async () => {
      try {
        const schema = z.object({
          category: z.string(),
          confidence: z.number(),
          justification: z.string(),
          tags: z.array(z.string())
        })

        const analysis = await runJsonAgent<z.infer<typeof schema>>({
          agent: 'classifier',
          system: `Você é o Classificador Universal do NOMMAD.
          Sua tarefa é analisar uma entrada (Link ou Arquivo) e categorizá-la para o artista atual.
          
          Categorias: Release, Contract, Demo, Social Media, Press Kit, Educational, Reference.
          
          REGRAS DE OURO:
          - CONTEXTO: Analise se a entrada faz sentido para o perfil do artista (MPB, Rock, etc.).
          - REFERÊNCIA: Se for 'Reference', identifique o gênero musical e comente se há um choque ou sinergia com o estilo do artista. 
          - CONFIDENCE: 0 a 100.
          - JUSTIFICATIVA: Explique o critério e a compatibilidade com o artista.`,
          user: `CONTEÚDO DO ARTISTA ATUAL (NOMMAD):\n${userContext}\n\nENTRADA PARA CLASSIFICAR:\n${body.source} (${body.type})`,
          schema
        })

        await db.update(classifications)
          .set({
            status: 'completed',
            category: analysis.category,
            justification: analysis.justification,
            result: {
              confidence: analysis.confidence,
              tags: analysis.tags,
              processedAt: new Date().toISOString()
            }
          })
          .where(eq(classifications.id, newItem.id))

      } catch (e) {
        console.error('Real classification failed:', e)
        
        // Se a IA estiver desligada via flag, avisamos na justificativa
        const justification = (e as any)?.message?.includes('AI disabled')
          ? 'Análise interrompida: A Inteligência Artificial está desativada globalmente via .env.local'
          : 'Erro técnico durante a análise da IA.'

        await db.update(classifications)
          .set({ 
            status: 'failed',
            justification 
          })
          .where(eq(classifications.id, newItem.id))
      }
    }

    runAnalysis()

    return NextResponse.json(newItem)
  } catch (err) {
    console.error('POST classifications error:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireSession()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const db = getDb()
    await db
      .delete(classifications)
      .where(and(eq(classifications.id, id), eq(classifications.userId, session.user.id)))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE classification error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

