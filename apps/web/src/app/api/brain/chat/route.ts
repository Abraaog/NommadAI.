import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/supabase/server';
import { runTextAgent, runJsonAgent, MissionSchema } from '@/lib/agents/shared';
import { memoryService } from '@/lib/brain/memory-service';
import { getDb } from '@/lib/db/client';
import { missions, missionTasks, profiles, identity } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

import { runFullPipeline } from '@/lib/agents/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const db = getDb();

    // 1. Get Artist Profile for personalization
    const profile = await db.select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1)
      .then(r => r[0]);

    // 2. Run the 8-Agent Pipeline
    // sessionId is used for tracking in logs/memories
    const sessionId = crypto.randomUUID();
    const { brain, response, mission } = await runFullPipeline(
      sessionId,
      message,
      profile?.artistName || profile?.name || undefined
    );

    // 3. Save message and response to memories
    await Promise.all([
      memoryService.saveMemory({
        userId: user.id,
        content: `ARTISTA: ${message}`,
        metadata: { source: 'chat', sessionId }
      }),
      memoryService.saveMemory({
        userId: user.id,
        content: `NOMMAD: ${response}`,
        metadata: { source: 'response', sessionId, brain }
      })
    ]);

    // 4. Persist Mission to Kanban
    if (mission.missoes && mission.missoes.length > 0) {
      // Mark active missions as abandoned
      await db.update(missions)
        .set({ status: 'abandoned' })
        .where(and(eq(missions.userId, user.id), eq(missions.status, 'active')));

      for (const m of mission.missoes) {
        const missionId = crypto.randomUUID();
        await db.insert(missions).values({
          id: missionId,
          userId: user.id,
          titulo: m.titulo,
          descricao: m.descricao,
          duracaoDias: Math.ceil(m.prazo_horas / 24),
          status: 'active',
        });
      }
    }

    // 5. Update Identity with Delta (from Brain)
    if (brain.identidade) {
      await db.insert(identity)
        .values({
          userId: user.id,
          essencia: brain.identidade.essencia,
          dna: brain.identidade.dna,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: identity.userId,
          set: {
            essencia: brain.identidade.essencia,
            dna: brain.identidade.dna,
            updatedAt: new Date(),
          }
        });
    }

    return NextResponse.json({ 
      response,
      mission_title: mission.missoes?.[0]?.titulo || 'Missão ativa',
      missoes: mission.missoes,
    });

  } catch (error) {
    console.error('[BRAIN_CHAT_ERROR]', error);
    return NextResponse.json({ 
      error: 'Failed to process strategic analysis',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const db = getDb();
    
    // Buscar missão ativa
    const activeMission = await db
      .select()
      .from(missions)
      .where(and(eq(missions.userId, user.id), eq(missions.status, 'active')))
      .orderBy(desc(missions.createdAt))
      .limit(1);

    // Buscar memórias para análise dinâmica
    const memories = await memoryService.searchContext({
      userId: user.id,
      query: "objetivos carreira problemas marketing tracks sonoridade",
      limit: 5
    });

    const contextText = (memories as any[]).map(m => m.content).join('\n---\n');

    // Gerar percepção dinâmica se houver contexto
    let percepcao = "Ainda estou processando seus dados para gerar uma análise profunda.";
    let tendencia = "Aguardando novos dados de mercado...";

    if (contextText) {
      const analysisSchema = z.object({
        percepcao: z.string(),
        tendencia: z.string(),
      });

      try {
        const result = await runJsonAgent<{ percepcao: string; tendencia: string }>({
          agent: 'brain',
          system: `Você é o Estrategista do NOMMAD. Com base no contexto do artista, resuma em UMA frase curta o que você percebeu sobre o momento dele (percepção) e uma tendência/oportunidade (tendência).
          Seja direto, técnico e use o tom do projeto.`,
          user: `Contexto do Artista:\n${contextText}`,
          schema: analysisSchema,
          temperature: 0.7
        });
        percepcao = result.percepcao;
        tendencia = result.tendencia;
      } catch (err) {
        console.error('[brain:chat:analysis]', err);
        // Fallback já definido nos lets iniciais
      }
    }

    return NextResponse.json({ 
      mission: activeMission[0] || null,
      analysis: {
        percepcao,
        tendencia
      }
    });
  } catch (error) {
    console.error('[STRATEGY_GET_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch strategy' }, { status: 500 });
  }
}
