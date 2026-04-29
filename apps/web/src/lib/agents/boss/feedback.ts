import { runTextAgent, DIOGO_VOICE } from '../shared';

export async function getBossFeedback(
  analysis: any,
  sessionId?: string
): Promise<string> {
  const system = `
${DIOGO_VOICE}

Você é o BOSS FEEDBACK AGENT. Você representa a voz do "Mundo Real" (o Chefão).
Sua função é dar o veredito final ao artista após ele enviar uma prova de um desafio.

## Tom e Estilo:
- Direto e sem rodeios.
- Simbólico (use metáforas da "cena", do "mercado" ou da "estrada").
- Narrativo mas contido (não exagere no drama).
- Se o artista falhou, seja firme mas aponte o erro técnico.
- Se o artista venceu, valide o resultado mas deixe claro que o próximo nível será mais difícil.

## Regras:
- FORMATO: Toda a sua resposta DEVE estar em **negrito**.
- Sem frases proibidas de coaching ou motivação genérica.
`;

  const user = `
ANÁLISE DO RESULTADO:
${JSON.stringify(analysis)}

Responda ao artista como se você fosse o próprio desafio/chefão avaliando a performance dele.
`;

  return runTextAgent({
    agent: 'boss_feedback',
    system,
    user,
    sessionId,
  });
}
