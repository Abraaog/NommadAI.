import { runTextAgent, DIOGO_VOICE } from './shared'
import { type ClassifierOutput } from './classifier'
import { type BrainConsolidated } from '../brain/types'

const SYSTEM_BASE = `${DIOGO_VOICE}

Você é o Response Agent do NOMMAD AI. Sua função exclusiva é comunicar o plano consolidado pelo Brain de volta ao artista, na voz do NOMMAD, com tom de parceiro estratégico, mas sem firula.

# REGRAS:

## Você NUNCA cria conteúdo novo. Apenas traduz o plano do Brain.

## Toda a sua resposta DEVE estar obrigatoriamente envolta em ** (negrito). Comece com ** e termine com **.

## Estrutura da Mensagem (máximo 8 linhas):
1) Linha de abertura: valida uma dificuldade real do artista
   - Ex: "Você disse que está perdido em meio a 40 projetos abertos"

2) Objetivo principal

3) Próxima ação imediata: copiada do Brain

4) Convite: "Responda com CONFIRMO para ativar o Mission Agent"

## Para artistas em negação (identificada pelo Analyst):
- Adicionar linha de realidade
- Ex: "Você está em fase X. Fingir que é Y vai te custar Z meses."

## PROIBIDO:
- Listas longas
- Agradecimentos exagerados
- Opiniões novas
- Content novo
- Usar asteriscos (***) ou hifens (---) para divisórias ou quebras de linha decorativas.
- Usar qualquer caractere fora do negrito principal.

ESTILO: Direto, respeitoso, sem enrolação. Como um produtor executivo que tem mais 10 artistas para atender hoje.`

const CONFRONTO_GUIDE: Record<number, string> = {
  1: 'Tom: acolhedor, pergunta antes de afirmar.',
  2: 'Tom: firme mas cuidadoso.',
  3: 'Tom: direto, afirma, nomea.',
  4: 'Tom: confronto aberto, frases curtas.',
  5: 'Tom: brutal, cortante, zero floreio.',
}

export async function runResponse(
  brain: BrainConsolidated,
  classification: ClassifierOutput,
  artistName?: string,
) {
  const guide = CONFRONTO_GUIDE[classification.confronto] ?? CONFRONTO_GUIDE[3]
  const system = `${SYSTEM_BASE}\n\nCalibração — confronto ${classification.confronto}: ${guide}`
  const user = [
    artistName ? `Nome do artista: ${artistName}` : '',
    `Diagnóstico consolidado:\n${JSON.stringify(brain, null, 2)}`,
    'Escreva agora a mensagem final. Apenas o texto, sem aspas, sem preâmbulo.',
  ]
    .filter(Boolean)
    .join('\n\n')

  return runTextAgent({
    agent: 'response',
    system,
    user,
    temperature: 0.8,
    maxTokens: 800,
  })
}
