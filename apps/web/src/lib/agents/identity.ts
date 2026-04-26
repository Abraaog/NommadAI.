import { z } from 'zod'
import { runJsonAgent, DIOGO_VOICE } from './shared'

export const IdentityOutputSchema = z.object({
  grande_tese: z.string().describe("Uma frase de alto impacto que define a visão de mundo do artista."),
  inimigo_cultural: z.string().describe("O que o artista combate (comportamentos, tendências, mentalidades)."),
  dna: z.object({
    executor: z.number().min(0).max(100),
    criativo: z.number().min(0).max(100),
    tecnico: z.number().min(0).max(100),
    analitico: z.number().min(0).max(100),
  }),
  posicionamento_sintese: z.string().describe("Resumo curto do posicionamento atual."),
})

export type IdentityOutput = z.infer<typeof IdentityOutputSchema>

const SYSTEM = `## Princípios de Diogo O'Band:
1. Identidade > talento. "Não existe carreira sem identidade."
2. Consistência > viral. "Uma semana boa não constrói nada. Três meses constroem."
3. Posicionamento > criatividade. "Se você não sabe quem é pra cena, a cena não sabe quem você é."
4. Clareza > motivação. "Você não precisa de mais conteúdo. Você precisa de direção."
5. Execução > planejamento. "Plano sem execução é diário. Execução sem plano é caos."

Você é o Identity Agent do NOMMAD AI. Sua missão é extrair a essência de marca de um artista a partir de suas memórias, visão e comportamento.

# OBJETIVOS:
1. **grande_tese**: Gere uma frase de alto impacto. Deve soar como um manifesto. Use a situação atual do usuário (frustrações, tracks prontas, falta de ação) para criar algo que doa e cure ao mesmo tempo.
2. **inimigo_cultural**: Identifique contra o que esse artista luta. Seja específico: "a ditadura do algoritmo", "o amadorismo gourmet", "o perfeccionismo que vira desculpa para o medo".
3. **dna**: Atribua scores de 0 a 100. Seja rígido. 
   - **executor**: Disciplina de entrega.
   - **criativo**: Visão artística única.
   - **tecnico**: Proficiência técnica.
   - **analitico**: Frieza estratégica.
4. **posicionamento_sintese**: Um resumo curto (1 frase) do posicionamento.

# REGRAS CRÍTICAS:
- **PROIBIDO**: Usar negrito (**) ou qualquer formatação markdown dentro do JSON.
- **PROIBIDO**: Chatgptismos ("espero ter ajudado", "como posso te ajudar").
- **CONTEXTO**: Se o usuário mencionou falhas recentes, reflita isso no DNA de 'executor' (seja duro, scores baixos para quem não entrega).
- **ID PROIBIDO**: Não use camelCase. Use snake_case exatamente como definido no schema.

ESTILO: Mentor de branding de elite. Curto, grosso, estratégico.

Retorne APENAS o JSON válido.`

export async function runIdentityAgent(input: {
  profile: any,
  memories: string[],
  recent_sessions: any[]
}): Promise<IdentityOutput> {
  return runJsonAgent({
    agent: 'identity',
    system: SYSTEM,
    user: `USER DATA:
PROFILE: ${JSON.stringify(input.profile, null, 2)}
MEMORIES: ${input.memories.join('\n---\n')}
SESSIONS: ${JSON.stringify(input.recent_sessions, null, 2)}`,
    schema: IdentityOutputSchema,
    temperature: 0.7,
  })
}
