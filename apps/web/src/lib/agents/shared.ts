import { z } from 'zod'
import { Groq } from 'groq-sdk'
import { MODELS, type AgentName } from '../groq'
import { AI_ENABLED, AI_API_KEY, AI_API_URL } from '../env'

const ai = new Groq({
  apiKey: AI_API_KEY,
  baseURL: AI_API_URL || undefined
})

// ============================================================
// Enums e tipos compartilhados
// ============================================================

export const Nivel = z.preprocess(
  (val) => {
    if (typeof val !== 'string') return val;
    const normalized = val.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove acentos
    return normalized;
  },
  z.enum(['iniciante', 'intermediario', 'avancado'])
)
export type Nivel = z.infer<typeof Nivel>

export const Confronto = z.preprocess(
  (val) => {
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  },
  z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
  ])
)
export type Confronto = z.infer<typeof Confronto>

export const FaseCarreira = z.preprocess(
  (val) => {
    if (typeof val !== 'string') return val;
    return val.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  },
  z.enum(['incubacao', 'validacao', 'escala', 'autoridade', 'construcao_base'])
)
export type FaseCarreira = z.infer<typeof FaseCarreira>

export const Arquetipo = z.preprocess(
  (val) => {
    if (typeof val !== 'string') return val;
    return val.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_");
  },
  z.enum([
    'rebelde', 'criador', 'sabio', 'explorador', 'mago', 'heroi',
    'amante', 'cuidador', 'cara_comum', 'bobo', 'governante', 'inocente',
  ])
)
export type Arquetipo = z.infer<typeof Arquetipo>

export const KanbanColuna = z.enum([
  'ideias', 'em_desenvolvimento', 'agendado', 'publicado', 'arquivado',
])

export const CleanedInputSchema = z.object({
  sessionId: z.string(),
  historia: z.string(),
  objetivos: z.string(),
  frustracoes: z.string(),
  referencias: z.string(),
  comportamento: z.string(),
  recursos: z.string().optional(),
  prazos: z.string().optional(),
  inconsistencias: z.string().optional(),
  perguntas_pendentes: z.array(z.string()).optional(),
  dados_ausentes: z.array(z.string()).optional(),
})
export type CleanedInput = z.infer<typeof CleanedInputSchema>

export const ArtistIdentitySchema = z.object({
  essencia: z.string(),
  teses_centrais: z.array(z.string()),
  teses_secundarias: z.array(z.string()),
  assuntos: z.array(z.string()),
  forca_marca: z.number().int().min(0).max(100),
  dna: z.object({
    personalidade: z.string(),
    arquetipo: Arquetipo,
    diferencial: z.string(),
  }),
  posicionamento: z.object({
    nicho: z.string(),
    publico: z.string(),
    cena: z.string(),
  }),
})
export type ArtistIdentity = z.infer<typeof ArtistIdentitySchema>

export const MissionSchema = z.object({
  missoes: z.array(z.object({
    id: z.string(),
    titulo: z.string(),
    descricao: z.string(),
    criterio: z.string(),
    bounty: z.string(),
    tipo: z.enum(['daily', 'weekly', 'boss']),
    prazo_horas: z.number(),
  })),
  missao_recuperacao: z.string().optional(),
})
export type Mission = z.infer<typeof MissionSchema>

export const BreakdownSchema = z.object({
  tasks: z.array(z.object({
    titulo: z.string(),
    tipo: z.enum(['conteudo', 'musica', 'branding']),
    tag: z.string(),
  })),
})
export type Breakdown = z.infer<typeof BreakdownSchema>

// ============================================================
// Voz Diogo O'Band — Base compartilhada
// ============================================================

export const DIOGO_VOICE = `
## Princípios de Diogo O'Band:
1. Identidade > talento. "Não existe carreira sem identidade."
2. Consistência > viral. "Uma semana boa não constrói nada. Três meses constroem."
3. Posicionamento > criatividade. "Se você não sabe quem é pra cena, a cena não sabe quem você é."
4. Clareza > motivação. "Você não precisa de mais conteúdo. Você precisa de direção."
5. Execução > planejamento. "Plano sem execução é diário. Execução sem plano é caos."

## Tom e Regras:
- Humano, estratégico, confiante. Afirme, não suavize.
- Use "você" direto. Evite "a gente", "o artista", 3a pessoa.
- Frase curta > frase elaborada.
- PROIBIDO: Motivação genérica ("acredite em você", "céu é o limite"), Coaching ("mindset", "potencial"), Marketing falso ("storytelling autêntico", "branding forte").
- PROIBIDO: Chatgptismos ("espero ter ajudado", "como posso te ajudar").
- FORMATO: Toda a sua resposta DEVE estar em **negrito** (envolva o conteúdo em **).
- PROIBIDO: Usar asteriscos para divisórias (***), quebras de linha decorativas ou listas com asteriscos. Use quebras de linha simples.
`;

// ============================================================
// Frases proibidas
// ============================================================

const BANNED_PHRASES = [
  'acredite em você', 'acredite em voce', 'confie no processo', 'céu é o limite',
  'ceu e o limite', 'lembre-se de ser autêntico', 'sua arte é única', 'você é capaz',
  'seja você mesmo', 'abrace sua jornada', 'o universo conspira', 'unique selling proposition',
  'storytelling autêntico', 'storytelling autentico', 'branding forte', 'essência autêntica',
  'essencia autentica', 'mindset de vencedor', 'desbloquear potencial', 'sair da zona de conforto',
  'espero ter ajudado', 'não hesite em perguntar', 'é um prazer te ajudar'
]

export function hasBannedPhrase(text: string): boolean {
  const normalized = text.toLowerCase()
  return BANNED_PHRASES.some((p) => normalized.includes(p))
}

// ============================================================
// AgentError
// ============================================================

export class AgentError extends Error {
  constructor(
    public readonly agent: AgentName,
    public readonly reason: 'api' | 'parse' | 'validate' | 'banned',
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'AgentError'
  }
}

// ============================================================
// Runner genérico — JSON agents
// ============================================================

export type RunJsonOptions<T> = {
  agent: AgentName
  system: string
  user: string
  schema: z.ZodType<T>
  temperature?: number
  maxTokens?: number
  retries?: number
  sessionId?: string
}

function extractJson(text: string): string {
  // Remove possible bold markers that some models insist on adding around/inside JSON
  let cleaned = text.replace(/\*\*/g, '')
  
  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()
  
  const firstBrace = cleaned.search(/[\[{]/)
  if (firstBrace >= 0) return cleaned.slice(firstBrace).trim()
  
  return cleaned.trim()
}

export async function runJsonAgent<T>({
  agent,
  system,
  user,
  schema,
  temperature = 0.5,
  maxTokens = 2048,
  retries = 1,
  sessionId = crypto.randomUUID(),
}: RunJsonOptions<T>): Promise<T> {
  if (!AI_ENABLED) {
    throw new AgentError(agent, 'api', 'AI disabled via AI_ENABLED flag')
  }

  let lastError: unknown
  let lastRaw: string | undefined
  const startTime = Date.now()

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const errorMessage = lastError instanceof Error ? lastError.message : String(lastError)
      let feedback = attempt === 0 ? '' : `\n\n[ERRO DE VALIDAÇÃO ANTERIOR]: ${errorMessage}\nPor favor, corrija a estrutura JSON.`

      const model = MODELS[agent]
      if (!model) {
        console.error(`[runJsonAgent] Model not found for agent: ${agent}. Available models:`, Object.keys(MODELS))
        throw new Error(`Model not found for agent: ${agent}`)
      }

      const response = await ai.chat.completions.create({
        messages: [
          { role: 'system', content: `${system}\n\nRetorne APENAS um objeto JSON válido.` },
          { role: 'user', content: `${user}${feedback}` }
        ],
        model,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      })

      const raw = response.choices[0]?.message?.content || ''
      lastRaw = raw

      const jsonText = extractJson(raw)
      const parsed = JSON.parse(jsonText)
      const result = schema.parse(parsed)
      
      recordAgentRunWithResponse(agent, MODELS[agent], sessionId, { system, user }, result, response).catch(() => {})
      return result
    } catch (e) {
      lastError = e
      if (attempt === retries) break
    }
  }

  const reason =
    lastError instanceof SyntaxError
      ? 'parse'
      : lastError instanceof z.ZodError
      ? 'validate'
      : 'api'

  const errorMessage = lastError instanceof Error ? lastError.message : String(lastError)
  recordAgentRunWithResponse(agent, MODELS[agent], sessionId, { system, user }, null, { latency_ms: Date.now() - startTime }, errorMessage).catch(() => {})
  throw new AgentError(
    agent,
    reason,
    `Agent ${agent} failed after ${retries + 1} feedback attempts. Last error: ${errorMessage}. Raw output was: ${truncate(lastRaw)}`,
    lastError
  )
}

// ============================================================
// Runner genérico — text agents
// ============================================================

export type RunTextOptions = {
  agent: AgentName
  system: string
  user: string
  temperature?: number
  maxTokens?: number
  guardBanned?: boolean
  retries?: number
  sessionId?: string
}

export async function runTextAgent({
  agent,
  system,
  user,
  temperature = 0.8,
  maxTokens = 1024,
  guardBanned = true,
  retries = 1,
  sessionId = crypto.randomUUID(),
}: RunTextOptions): Promise<string> {
  if (!AI_ENABLED) {
    throw new AgentError(agent, 'api', 'AI disabled via AI_ENABLED flag')
  }

  let lastError: unknown
  const startTime = Date.now()

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const model = MODELS[agent]
      if (!model) {
        console.error(`[runTextAgent] Model not found for agent: ${agent}. Available models:`, Object.keys(MODELS))
        throw new Error(`Model not found for agent: ${agent}`)
      }

      const response = await ai.chat.completions.create({
        messages: [
          { role: 'system', content: system },
          { 
            role: 'user', 
            content: attempt === 0
              ? user
              : `${user}\n\n[retry] Sua resposta anterior usou linguagem proibida (motivação genérica/coaching). Reescreva sem frases como "acredite em você", "confie no processo", "jornada", etc.`
          }
        ],
        model,
        temperature,
        max_tokens: maxTokens,
      })

      const text = (response.choices[0]?.message?.content || '').trim()

      if (guardBanned && hasBannedPhrase(text)) {
        lastError = new Error('banned phrase')
        if (attempt < retries) continue
        recordAgentRunWithResponse(agent, MODELS[agent], sessionId, { system, user }, null, response, 'banned phrase').catch(() => {})
        throw new AgentError(agent, 'banned', `Agent ${agent} produced banned phrase`)
      }

      recordAgentRunWithResponse(agent, MODELS[agent], sessionId, { system, user }, text, response).catch(() => {})
      return text
    } catch (e) {
      lastError = e
      if (attempt === retries) break
    }
  }

  recordAgentRunWithResponse(agent, MODELS[agent], sessionId, { system, user }, null, { latency_ms: Date.now() - startTime }, String(lastError)).catch(() => {})
  throw new AgentError(agent, 'api', `Agent ${agent} text run failed`, lastError)
}

// ============================================================
// Util
// ============================================================

function truncate(s: string | undefined, max = 400): string {
  if (!s) return '<empty>'
  return s.length > max ? s.slice(0, max) + '…' : s
}

// ============================================================
// Telemetry — Record agent runs to Supabase
// ============================================================

import { getDb } from '../db/client'
import { agentRuns } from '../db/schema'
import { eq } from 'drizzle-orm'

export type AgentTelemetry = {
  sessionId: string
  agentName: string
  model: string
  input?: unknown
  output?: unknown
  latencyMs?: number
  tokensIn?: number
  tokensOut?: number
  estimatedCost?: string
  status?: 'ok' | 'degraded' | 'error'
  error?: string
}

let _telemetryEnabled = true

export function setTelemetryEnabled(enabled: boolean) {
  _telemetryEnabled = enabled
}

export async function recordAgentRun(telemetry: AgentTelemetry): Promise<void> {
  if (!_telemetryEnabled) return
  
  // Skip on client or during build
  try {
    if (typeof window !== 'undefined') return
    if (process.env.NEXT_PHASE === 'phase-production-build') return
  } catch {
    // ignore
  }
  
  try {
    // Dynamic import to avoid issues during build
    const { getDb } = await import('../db/client')
    const { agentRuns } = await import('../db/schema')
    const db = getDb()
    
    // Validate UUID format
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(telemetry.sessionId || '')
    if (!isUuid) {
      if (telemetry.sessionId) {
        console.warn(`[telemetry] Skipping recording: Invalid sessionId format: "${telemetry.sessionId}"`)
      }
      return
    }

    await db.insert(agentRuns).values({
      sessionId: telemetry.sessionId!,
      agentName: telemetry.agentName,
      model: telemetry.model,
      input: telemetry.input ?? null,
      output: telemetry.output ?? null,
      latencyMs: telemetry.latencyMs ?? null,
      tokensIn: telemetry.tokensIn ?? null,
      tokensOut: telemetry.tokensOut ?? null,
      estimatedCost: telemetry.estimatedCost ?? '0',
      status: telemetry.status ?? 'ok',
      error: telemetry.error ?? null,
    })
  } catch (e) {
    console.error('[telemetry] Failed to record agent run:', e)
  }
}

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'llama-3.1-8b-instant': { input: 0.0002, output: 0.0002 },
  'llama-3.3-70b-versatile': { input: 0.0009, output: 0.0009 },
  'llama-3.1-70b-versatile': { input: 0.0008, output: 0.0008 },
  'llama-3.2-1b-preview': { input: 0.00004, output: 0.00004 },
  'llama-3.2-3b-preview': { input: 0.00008, output: 0.00008 },
  'mixtral-8x7b-32k': { input: 0.00024, output: 0.00024 },
}

function calculateCost(model: string, promptTokens: number, completionTokens: number): string {
  const pricing = MODEL_PRICING[model] || { input: 0.001, output: 0.001 }
  const cost = (promptTokens / 1_000_000 * pricing.input) + (completionTokens / 1_000_000 * pricing.output)
  return cost.toFixed(6)
}

export async function recordAgentRunWithResponse(
  agentName: AgentName,
  model: string,
  sessionId: string,
  input: unknown,
  output: unknown,
  response: { usage?: { prompt_tokens?: number; completion_tokens?: number }; latency_ms?: number; estimated_cost?: string },
  error?: string
): Promise<void> {
  const calculatedCost = response.estimated_cost 
    || calculateCost(model, response.usage?.prompt_tokens || 0, response.usage?.completion_tokens || 0)
  
  await recordAgentRun({
    sessionId,
    agentName,
    model,
    input,
    output,
    latencyMs: response.latency_ms,
    tokensIn: response.usage?.prompt_tokens,
    tokensOut: response.usage?.completion_tokens,
    estimatedCost: calculatedCost,
    status: error ? 'error' : 'ok',
    error,
  })
}

export type { AgentName }
