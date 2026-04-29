"use server";

import { db } from "@/lib/db/client";
import { bossCases, leaderboardScores, profiles, identity, contacts } from "@/lib/db/schema";
import { requireSession } from "@/lib/supabase/server";
import { eq, sql, and, or, desc } from "drizzle-orm";
import { BossMasterAgent } from "../agents/boss/master";
import { revalidatePath } from "next/cache";

/**
 * Gera um novo desafio (Chefão) baseado no contexto do artista.
 */
export async function createBossChallengeAction() {
  const { user } = await requireSession();
  
  // 1. Buscar dados do artista para contexto
  const profileData = await db.select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1)
    .then(res => res[0]);

  const identityData = await db.select()
    .from(identity)
    .where(eq(identity.userId, user.id))
    .limit(1)
    .then(res => res[0]);

  // 2. Gerar desafio via Agente
  const challenge = await BossMasterAgent.createNewChallenge(
    identityData || {},
    profileData?.stage || 'iniciante',
    "Interações recentes no CRM e objetivos de carreira"
  );

  // 3. Salvar no banco
  const [newCase] = await db.insert(bossCases).values({
    userId: user.id,
    bossId: challenge.categoria, 
    status: 'aberto',
    provas: challenge, 
    abertoEm: new Date(),
    atualizadoEm: new Date(),
  }).returning();

  revalidatePath('/dashboard/chefoes/ativos');
  return { success: true, caseId: newCase.id, challenge };
}

/**
 * Processa a submissão de uma prova (conversa/link) contra um Chefão ativo.
 */
export async function submitBossProofAction(caseId: string, proofText: string) {
  const { user } = await requireSession();

  if (!proofText || proofText.trim().length < 10) {
    throw new Error("A prova enviada é muito curta ou inválida.");
  }

  // 1. Buscar o caso ativo
  const caseData = await db.select()
    .from(bossCases)
    .where(and(eq(bossCases.id, caseId), eq(bossCases.userId, user.id)))
    .limit(1)
    .then(res => res[0]);

  if (!caseData) throw new Error("Chefão não encontrado ou já finalizado.");

  // 2. Processar com Agente Master
  const result = await BossMasterAgent.processSubmission(
    caseData.provas as any,
    proofText,
    caseData.contextJson
  );

  // 2.1 Salvar ativos de rede no CRM se houver
  if (result.network?.contatos && result.network.contatos.length > 0) {
    for (const contact of result.network.contatos) {
      try {
        await db.insert(contacts).values({
          userId: user.id,
          name: contact.nome,
          category: contact.tipo,
          status: 'lead',
          notes: `${contact.contexto} | Potencial: ${contact.potencial}`,
          updatedAt: new Date(),
        });
      } catch (e) {
        console.error(`[boss:network] Falha ao salvar contato ${contact.nome}:`, e);
      }
    }
  }

  const statusMap = {
    'sucesso': 'vencido',
    'parcial': 'parcial',
    'falha': 'falha'
  } as const;

  // 3. Atualizar Caso no Banco
  await db.update(bossCases)
    .set({
      status: statusMap[result.analysis.resultado as keyof typeof statusMap] || 'falha',
      result: result.analysis.resultado,
      feedback: result.feedback,
      xpAwarded: result.analysis.xp,
      networkData: result.network,
      contextJson: result.newContext,
      atualizadoEm: new Date(),
    })
    .where(eq(bossCases.id, caseId));

  // 4. Atualizar XP do Perfil e Leaderboard se houve ganho
  if (result.analysis.xp > 0) {
    await db.update(profiles)
      .set({ 
        xp: sql`${profiles.xp} + ${result.analysis.xp}`,
        updatedAt: new Date()
      })
      .where(eq(profiles.id, user.id));

    await db.insert(leaderboardScores)
      .values({
        userId: user.id,
        score: result.analysis.xp,
        bossScore: result.analysis.xp,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [leaderboardScores.userId],
        set: {
          score: sql`${leaderboardScores.score} + ${result.analysis.xp}`,
          bossScore: sql`${leaderboardScores.bossScore} + ${result.analysis.xp}`,
          updatedAt: new Date(),
        },
      });
  }

  revalidatePath('/dashboard/chefoes/ativos');
  return { success: true, analysis: result.analysis, feedback: result.feedback };
}

/**
 * Lista os chefões ativos do usuário.
 */
export async function getActiveBossesAction() {
  const { user } = await requireSession();
  
  return db.select()
    .from(bossCases)
    .where(and(
      eq(bossCases.userId, user.id),
      or(eq(bossCases.status, 'aberto'), eq(bossCases.status, 'parcial'))
    ))
    .orderBy(desc(bossCases.atualizadoEm));
}
