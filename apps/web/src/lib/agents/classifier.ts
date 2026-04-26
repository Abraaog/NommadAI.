import { z } from 'zod'
import { Nivel, Confronto, type CleanedInput, runJsonAgent, DIOGO_VOICE } from './shared'

export const ClassifierOutputSchema = z.object({
  nivel: Nivel,
  confronto: Confronto,
  justificativa_curta: z.string(),
  fase_carreira: z.enum(['estudio', 'residente_local', 'regional', 'nacional', 'mainstream', 'legacy']).optional(),
  nivel_tecnico: z.enum(['iniciante', 'intermediario', 'avancado', 'profissional', 'referencia']).optional(),
  arquetipo_estrategico: z.array(z.string()).optional(),
  network: z.number().min(0).max(4).optional(),
})
export type ClassifierOutput = z.infer<typeof ClassifierOutputSchema>

const SYSTEM = `${DIOGO_VOICE}

Você é o Classifier Agent do NOMMAD AI. Sua função é enquadrar o artista em categorias objetivas da carreira de música eletrônica, definindo fase, nível e arquétipo estratégico.

# REGRAS OBRIGATÓRIAS:

## 1. Fase de carreira (uma):
- **estudio**: Nunca tocou ao vivo
- **residente_local**: Gigs fixas na mesma cidade, < 100 pessoas
- **regional**: Toca em 2+ estados, > 200 pessoas
- **nacional**: Festivais médios, cachê fixo
- **mainstream**: Playlists oficiais, booking agency
- **legacy**: Carreira consolidada, foco em brand

## 2. Nível técnico-artístico (um):
- **iniciante**: Básico de DAW, sem masterização
- **intermediario**: Produção coerente, mix falho
- **avancado**: Música pronta para label, mas sem identidade forte
- **profissional**: Assinatura sonora, master decente
- **referencia**: Inovação reconhecida por pares

## 3. Arquétipo estratégico (pode ter mais de um, priorize o principal):
- Produtor de estúdio (não DJ)
- DJ que não produz
- DJ-produtor focado em lançamentos
- Performer (live act)
- Remixador / Ghost producer
- Educador / Influencer técnico
- Label owner / Curador
- Label owner / Curador

## 4. Nível de Network:
- 0: Nenhum contato
- 1: Conhecidos locais
- 2: Contatos com promotores/labels regionais
- 3: Agenda com nomes nacionais
- 4: Internacional

## Estrutura de Saída (/schema):
{
  "nivel": "iniciante|intermediario|avancado",
  "confronto": 1-5,
  "justificativa_curta": "...",
  "fase_carreira": "estudio|residente_local|regional|nacional|mainstream|legacy",
  "nivel_tecnico": "iniciante|intermediario|avancado|profissional|referencia",
  "arquetipo_estrategico": ["produtor_estudio", "dj_produtcor"],
  "network": 0-4
}

## Exemplo:
{
  "nivel": "intermediario",
  "confronto": 3,
  "justificativa_curta": "Produção consistente mas sem direção clara.",
  "fase_carreira": "residente_local",
  "nivel_tecnico": "avancado",
  "arquetipo_estrategico": ["dj_produtcor", "performer"],
  "network": 2
}

ESTILO: Seco, categórico, como um diagnóstico médico da carreira. Sem texto extra além do JSON.

Retorne APENAS o JSON válido no schema definido.`

export async function runClassifier(input: any) {
  const sessionId = input.sessionId;
  const classifierInput = input.visionText ? { visionText: input.visionText } : input;

  return runJsonAgent({
    agent: 'classifier',
    system: SYSTEM,
    user: `Contexto para Classificação:\n${JSON.stringify(classifierInput, null, 2)}`,
    schema: ClassifierOutputSchema,
    temperature: 0.2,
    sessionId,
  })
}

export async function runCheckinClassifier(input: {
  current_nivel: string
  current_confronto: number
  update_texto: string
  mission_result: 'completed' | 'partial' | 'failed'
}) {
  const CHECKIN_SYSTEM = `${DIOGO_VOICE}

# Check-in Re-Classifier Rules:
Tarefa: Recalibrar o Nível e o Confronto do usuário baseando-se no comportamento demonstrado no check-in.

## Regras de Calibração:
- Sucesso absoluto + ambição: +1 confronto (até 5).
- Desculpas/Procrastinação: +1 confronto (exigência).
- Esgotamento/Crise: -1 ou -2 confronto (acolhimento).
- Evolução de maturidade: Mude o nível se o artista parou de agir como amador.

## Saída Obrigatória:
{
  "nivel": "intermediario",
  "confronto": 3,
  "justificativa_curta": "...",
  "fase_carreira": "residente_local",
  "nivel_tecnico": "intermediario",
  "arquetipo_estrategico": ["produtor_estudio"],
  "network": 1
}`

  return runJsonAgent({
    agent: 'classifier',
    system: CHECKIN_SYSTEM,
    user: JSON.stringify(input),
    schema: ClassifierOutputSchema,
    temperature: 0.1,
  })
}
