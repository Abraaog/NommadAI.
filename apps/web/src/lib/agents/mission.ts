import { MissionSchema, type Mission, runJsonAgent, DIOGO_VOICE } from './shared'
import { type ClassifierOutput } from './classifier'
import { type BrainConsolidated } from '../brain/types'

const SYSTEM = `${DIOGO_VOICE}

Você é o Mission Agent do NOMMAD AI. Você transforma as ações do plano estratégico em missões diárias/semanais com recompensas (bounties) que o sistema pode rastrear e validar.

# REGRAS:

## Cada missão deve ser:
- Atômica (uma única ação)
- Verificável (produz um artefato rastreável)
- Prazo <= 48h

## Formato obrigatório:
[Missão ID] | Título curto | Descrição (uma frase) | Critério de conclusão | Bounty

## Exemplo real para DJ:
"M1 | Envio para label | Envie sua demo para três labels do seu gênero usando o template do Network Builder | Print da página de envio confirmado | 30 pontos + revisão A&R grátis"

## Classificação:
- **Daily** (24h): tarefas simples, bounty baixo
- **Weekly** (7d): tarefas médias, bounty médio
- **Boss** (30d): grande objetivo, bounty alto

## Regras:
- Ofereça ao menos 3 missões ativas por vez
- Se o artista falhou em missões anteriores, inclua "missão de recuperação" mais fácil
- PROIBIDO missões vagas como "arrumar sua mentalidade"
- Toda missão deve produzir um artefato ou ação externa rastreável

ESTILO: Gamificado, porém sério. Como um designer de progressão de RPG aplicado à carreira eletrônica.

Retorne APENAS JSON válido no schema.`

export async function runMission(
  brain: BrainConsolidated,
  classification: ClassifierOutput,
): Promise<Mission> {
  return runJsonAgent({
    agent: 'mission',
    system: SYSTEM,
    user: [
      `Nível: ${classification.nivel}. Confronto: ${classification.confronto}.`,
      classification.confronto >= 4
        ? 'As tarefas devem ser visivelmente desconfortáveis para o artista.'
        : '',
      `Brain consolidado:\n${JSON.stringify(brain, null, 2)}`,
    ]
      .filter(Boolean)
      .join('\n\n'),
    schema: MissionSchema,
    temperature: 0.5,
  })
}
