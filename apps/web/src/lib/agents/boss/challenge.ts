import { z } from 'zod';
import { runJsonAgent, DIOGO_VOICE } from '../shared';

export const BossChallengeSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  objetivo: z.string(),
  criterio_validacao: z.string(),
  categoria: z.enum(['mercado', 'audiencia', 'networking', 'financeiro']),
  dificuldade: z.enum(['facil', 'medio', 'dificil']),
});

export type BossChallenge = z.infer<typeof BossChallengeSchema>;

export async function generateBossChallenge(
  identity: any,
  phase: string,
  history: string,
  sessionId?: string
): Promise<BossChallenge> {
  const system = `
${DIOGO_VOICE}

Você é o CHALLENGE GENERATOR AGENT do NOMMAD OS.
Sua função é criar "Chefões" (Bosses) personalizados para o artista.

## Regras de Criação:
1. Deve envolver interação com o mundo real.
2. Deve ser desafiador, mas possível para a fase atual do artista.
3. Deve gerar uma prova verificável (print, link, conversa).
4. O tom deve ser direto e focado em resultado, não em esforço.

## Categorias:
- mercado: Fechar gigs, parcerias comerciais, contratos.
- audiencia: Engajamento real, conversão de fãs, metas de streaming.
- networking: Collabs com outros artistas, contatos com selos/agentes.
- financeiro: Venda de merch, ingressos, royalties, patrocínios.

Retorne APENAS um JSON válido.
`;

  const user = `
Baseado no artista:
IDENTIDADE: ${JSON.stringify(identity)}
FASE ATUAL: ${phase}
HISTÓRICO RECENTE: ${history}

Crie um desafio real (chefão) que force esse artista a evoluir para o próximo nível.
`;

  return runJsonAgent({
    agent: 'boss_challenge',
    system,
    user,
    schema: BossChallengeSchema,
    sessionId,
  });
}
