import { z } from 'zod';
import { runJsonAgent } from '../shared';

export const ProofAnalysisSchema = z.object({
  resultado: z.enum(['sucesso', 'parcial', 'falha']),
  analise: z.string(),
  feedback_tecnico: z.string(),
  oportunidade: z.string(),
  xp: z.number().int(),
  contexto_atualizado: z.string().describe("Resumo destilado da situação atual para persistência de memória, focando em onde paramos e qual o próximo passo técnico."),
});

export type ProofAnalysis = z.infer<typeof ProofAnalysisSchema>;

export async function interpretProof(
  challenge: any,
  conversa: string,
  previousContext?: any,
  sessionId?: string
): Promise<ProofAnalysis> {
  const system = `
Você é o PROOF INTERPRETER AGENT do NOMMAD OS.
Sua função é analisar evidências reais (transcrições de conversas, prints de WhatsApp, e-mails) para validar se um artista venceu um "Chefão".

## Sua Análise deve considerar:
1. O artista conseguiu atingir o objetivo do desafio?
2. Qual foi a reação da outra parte (contratante, público, parceiro)?
3. O artista se posicionou de forma profissional e estratégica?
4. Existe alguma oportunidade futura detectada na conversa?

## Critérios de Resultado:
- sucesso: Objetivo atingido com bom posicionamento.
- parcial: Avanço significativo, mas objetivo final não concluído ou falha de posicionamento.
- falha: Negativa clara ou falta de progresso real.

## XP Sugerido:
- Sucesso: 150-250 XP
- Parcial: 50-100 XP
- Falha: 0-20 XP (pelo aprendizado)

Retorne APENAS um JSON válido.
`;

  const user = `
CONTEXTO PRÉVIO (O que aconteceu antes):
${JSON.stringify(previousContext || 'Nenhum contexto anterior.')}

DESAFIO (CHEFÃO):
${JSON.stringify(challenge)}

EVIDÊNCIA (CONVERSA/PROVA ATUAL):
${conversa}

Avalie se o artista venceu o desafio baseado na evidência fornecida e na continuidade do contexto prévio. Atualize o 'contexto_atualizado' com um resumo curto do estado atual.
`;

  return runJsonAgent({
    agent: 'boss_proof',
    system,
    user,
    schema: ProofAnalysisSchema,
    sessionId,
  });
}
