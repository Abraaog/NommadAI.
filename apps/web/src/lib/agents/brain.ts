import { z } from 'zod'
import { runJsonAgent, ArtistIdentitySchema, Nivel, Confronto } from './shared'
import { type AnalystOutput } from './analyst'
import { type StrategistOutput } from './strategist'
import { type ClassifierOutput } from './classifier'
import type { BrainConsolidated as BrainType } from '../brain/types'
export type BrainConsolidated = BrainType

export const BrainConsolidatedSchema = z.object({
  identidade: ArtistIdentitySchema,
  analise: z.object({
    problema_central: z.string(),
    padrao_comportamental: z.string(),
    incoerencia: z.string(),
  }),
  direcao: z.object({
    frase_norte: z.string(),
    fase_carreira: z.string(),
    pilares: z.array(z.string()),
  }),
  nivel: Nivel,
  confronto: Confronto,
})

const SYSTEM = `Você é o Brain Central do NOMMAD. Sua função é consolidar análises em uma visão única e potente.

## Estrutura de Saída (OBRIGATÓRIA):
1. "identidade": {
     "essencia": "string",
     "teses_centrais": ["string"],
     "teses_secundarias": ["string"],
     "assuntos": ["string"],
     "forca_marca": number (0-100),
     "dna": { "personalidade", "arquetipo", "diferencial" },
     "posicionamento": { "nicho", "publico", "cena" }
   }
2. "analise": { "problema_central", "padrao_comportamental", "incoerencia" }
3. "direcao": { "frase_norte", "fase_carreira", "pilares" (array) }
4. "nivel": (iniciante, intermediario, avancado)
5. "confronto": (1 a 5)

## Regras:
- Não omita NENHUM campo. Todos os campos de "identidade" devem estar presentes.
- Sintetize a identidade final do artista.
- Mantenha o tom de Diogo O'Band: clareza brutal.

## Exemplo de Saída:
{
  "identidade": {
    "essencia": "Techno cru com estética industrial.",
    "teses_centrais": ["O hardware é mais humano que o software", "O erro é parte da composição"],
    "teses_secundarias": ["Menos é mais", "A distorção é uma textura"],
    "assuntos": ["Sintetizadores modulares", "Cultura de Berlim"],
    "forca_marca": 45,
    "dna": {
      "personalidade": "Técnico, rebelde e focado.",
      "arquetipo": "rebelde",
      "diferencial": "Hardware live act sem computador."
    },
    "posicionamento": {
      "nicho": "Techno Industrial",
      "publico": "Aficcionados por hardware e som analógico",
      "cena": "Underground Paulista"
    }
  },
  "analise": {
    "problema_central": "Medo da rejeição disfarçado de perfeccionismo.",
    "padrao_comportamental": "Não lança tracks por medo de críticas.",
    "incoerencia": "Diz ser underground mas busca validação comercial."
  },
  "direcao": {
    "frase_norte": "Domine o hardware e lance seu som sem medo.",
    "fase_carreira": "validacao",
    "pilares": ["Live Set", "Sound Design", "Cultura Industrial"]
  },
  "nivel": "intermediario",
  "confronto": 4
}

Retorne APENAS o JSON válido.`

export async function runBrainConsolidator(inputs: {
  analysis: AnalystOutput
  strategy: StrategistOutput
  classification: ClassifierOutput
}): Promise<BrainConsolidated> {
  return runJsonAgent({
    agent: 'brain',
    system: SYSTEM,
    user: `Inputs para Consolidação:\n${JSON.stringify(inputs, null, 2)}`,
    schema: BrainConsolidatedSchema,
    temperature: 0.3,
  })
}
