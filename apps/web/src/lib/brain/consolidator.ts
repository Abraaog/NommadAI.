import { z } from 'zod'
import { groqClients, MODELS } from '../groq'
import { Nivel, Confronto } from '../agents/shared'
import { type BrainInput, type BrainConsolidated } from './types'

const BrainOutputSchema = z.object({
  nivel_final: Nivel,
  confronto_final: Confronto,
  resumo_diagnostico: z.string(),
  prioridade_estrategica: z.string(),
  identidade_delta: z.object({
    essencia: z.string().optional(),
    teses_centrais: z.array(z.string()).optional(),
    forca_marca: z.number().optional(),
    dna: z.record(z.string(), z.string()).optional(),
    posicionamento: z.record(z.string(), z.string()).optional(),
  }),
  comportamento_delta: z.record(z.string(), z.unknown()),
  flags: z.object({
    degraded: z.boolean(),
    needs_more_input: z.boolean(),
    needs_human_attention: z.boolean(),
  }),
  diagnostico_rapido: z.string(),
  objetivo_90_dias: z.string(),
  roteiro_semanal: z.array(z.object({
    semana: z.string(),
    foco_principal: z.string(),
    acoes_chave: z.array(z.string()),
  })),
  metricas_sucesso: z.object({
    demos_enviadas: z.number().optional(),
    gigs_fora_cidade: z.number().optional(),
    crescimento_plataforma: z.number().optional(),
  }),
  checklist_recursos: z.object({
    equipamento: z.array(z.string()),
    softwares: z.array(z.string()),
    contatos: z.array(z.string()),
    orcamento: z.string().optional(),
  }),
  proxima_acao: z.object({
    tarefa: z.string(),
    tempo_minutos: z.number(),
    entrega: z.string(),
  }),
})

const SYSTEM = `Você é o Brain Agent do NOMMAD AI – o consolidador final. Você recebe as saídas do Cleaner, Analyst, Classifier e Strategist e as funde em um único Plano Estratégico Pessoal, organizado e pronto para ser entregue ao artista.

# REGRAS OBRIGATÓRIAS:

## Saída: Documento Único com Estas Seções:

### 1. Diagnóstico Rápido (máximo 3 linhas):
- Resumo da fase
- Principal incoerência
- Classificação

### 2. Objetivo 90 dias (uma frase):
- Meta clara e mensurável

### 3. Roteiro Semanal:
Tabela com colunas:
- Semana (S1 a S12)
- Foco Principal
- 3 Ações-chave

### 4. Métricas de Sucesso:
3 indicadores mensuráveis:
- ex: "nº de demos enviadas"
- ex: "nº de gigs fora da cidade"
- ex: "crescimento de seguidores em plataforma X"

### 5. Checklist de Recursos Necessários:
- Equipamento
- Softwares
- Contatos
- Orçamento

### 6. Próxima Ação Imediata:
- A primeira tarefa do plano
- Deve levar menos de 15 minutos
- Com entrega verificável

## REGRAS:
- PROIBIDO incluir opiniões novas ou análises adicionais
- Use linguagem neutra e formatação limpa
- Priorize legibilidade para DJ cansado após um set
- Consolide apenas o que já foi gerado pelos outros agentes

ESTILO: Sintético, operacional, como um briefing de voo para piloto de cabine.

Retorne APENAS JSON no schema exato.`

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()
  const firstBrace = text.search(/[\[{]/)
  if (firstBrace > 0) return text.slice(firstBrace).trim()
  return text.trim()
}

export async function consolidateBrain(input: BrainInput): Promise<BrainConsolidated> {
  const user = `
Analyst:\n${JSON.stringify(input.analysis, null, 2)}

Classifier:\n${JSON.stringify(input.classification, null, 2)}

Strategist:\n${JSON.stringify(input.strategy, null, 2)}

Memória existente:\n${JSON.stringify(input.memory ?? {}, null, 2)}

Kind: ${input.kind}

Consolide e retorne JSON.`

  try {
    const res = await groqClients.brain.chat.completions.create({
      model: MODELS.brain,
      max_tokens: 2048,
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: user },
      ],
    })
    const raw = res.choices[0]?.message?.content ?? ''
    const parsed = BrainOutputSchema.parse(JSON.parse(extractJson(raw)))
    
    return {
      ...parsed,
      // Compatibility mapping
      nivel: parsed.nivel_final,
      confronto: parsed.confronto_final,
      identidade: {
        essencia: parsed.identidade_delta.essencia || '',
        teses_centrais: parsed.identidade_delta.teses_centrais || [],
        teses_secundarias: [],
        assuntos: [],
        forca_marca: parsed.identidade_delta.forca_marca || 0,
        dna: {
          personalidade: parsed.identidade_delta.dna?.personalidade || '',
          arquetipo: parsed.identidade_delta.dna?.arquetipo as any || 'criador',
          diferencial: parsed.identidade_delta.dna?.diferencial || '',
        },
        posicionamento: {
          nicho: parsed.identidade_delta.posicionamento?.nicho || '',
          publico: parsed.identidade_delta.posicionamento?.publico || '',
          cena: parsed.identidade_delta.posicionamento?.cena || '',
        },
      },
      analise: {
        problema_central: parsed.resumo_diagnostico,
        padrao_comportamental: (parsed.comportamento_delta as any)?.padrao_observado || '',
        incoerencia: parsed.prioridade_estrategica,
      },
      direcao: {
        frase_norte: parsed.prioridade_estrategica,
        fase_carreira: 'validacao',
        pilares: parsed.identidade_delta.teses_centrais || [],
      }
    }
  } catch {
    const fallback: BrainConsolidated = {
      nivel_final: input.classification.nivel,
      confronto_final: input.classification.confronto as any,
      resumo_diagnostico: input.analysis.problema_central,
      prioridade_estrategica: input.analysis.incoerencia,
      identidade_delta: {
        essencia: input.strategy.identidade.essencia,
        teses_centrais: input.strategy.direcao_conteudo.pilares,
        dna: {
          personalidade: input.strategy.identidade.essencia,
          arquetipo: input.strategy.identidade.arquetipo,
          diferencial: input.strategy.identidade.diferencial_real,
        },
        posicionamento: {
          nicho: input.strategy.posicionamento.nicho,
          publico: input.strategy.posicionamento.publico,
          cena: input.strategy.posicionamento.cena,
        },
      },
      comportamento_delta: {
        padrao_observado: input.analysis.padrao_comportamental,
      },
      flags: { degraded: true, needs_more_input: false, needs_human_attention: false },
      // Compatibility mapping
      nivel: input.classification.nivel,
      confronto: input.classification.confronto as any,
      identidade: {
        essencia: input.strategy.identidade.essencia,
        teses_centrais: input.strategy.direcao_conteudo.pilares,
        teses_secundarias: [],
        assuntos: [],
        forca_marca: 0,
        dna: {
          personalidade: input.strategy.identidade.essencia,
          arquetipo: input.strategy.identidade.arquetipo,
          diferencial: input.strategy.identidade.diferencial_real,
        },
        posicionamento: {
          nicho: input.strategy.posicionamento.nicho,
          publico: input.strategy.posicionamento.publico,
          cena: input.strategy.posicionamento.cena,
        },
      },
      analise: {
        problema_central: input.analysis.problema_central,
        padrao_comportamental: input.analysis.padrao_comportamental,
        incoerencia: input.analysis.incoerencia,
      },
      direcao: {
        frase_norte: input.strategy.frase_norte,
        fase_carreira: input.strategy.fase_carreira,
        pilares: input.strategy.direcao_conteudo.pilares,
      }
    }
    return fallback
  }
}
