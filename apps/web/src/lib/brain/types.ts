import { type Nivel, type Confronto, type ArtistIdentity } from '../agents/shared'

export type BrainInput = {
  sessionId: string
  cleaned: any
  analysis: any
  classification: any
  strategy: any
  memory?: any
  kind: 'onboarding' | 'checkin' | 'regen'
}

export type BrainConsolidated = {
  // Version A (agents/brain.ts)
  identidade: ArtistIdentity
  analise: {
    problema_central: string
    padrao_comportamental: string
    incoerencia: string
  }
  direcao: {
    frase_norte: string
    fase_carreira: string
    pilares: string[]
  }
  nivel: Nivel
  confronto: Confronto

  // Version B (brain/consolidator.ts) - mapping properties for compatibility
  nivel_final?: Nivel
  confronto_final?: Confronto
  resumo_diagnostico?: string
  prioridade_estrategica?: string
  identidade_delta?: any
  comportamento_delta?: any
  flags?: {
    degraded: boolean
    needs_more_input: boolean
    needs_human_attention: boolean
  }
}
