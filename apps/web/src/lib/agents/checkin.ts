import { z } from 'zod'
import { MissionSchema, runTextAgent, DIOGO_VOICE } from './shared'

const INPUT = z.object({
  missao_anterior: MissionSchema,
  analise_anterior: z.object({
    problema_central: z.string(),
    padrao_comportamental: z.string(),
  }),
  update_do_artista: z.string(),
  classification_previa: z.object({ nivel: z.string(), confronto: z.number() }),
  historico_recente_resumido: z.string().optional(),
})
export type CheckinInput = z.infer<typeof INPUT>

export type CheckinOutput = {
  text: string
  new_mission: z.infer<typeof MissionSchema> | null
  status: 'full' | 'partial' | 'none'
  meta?: {
    taxa: string
    comparacao: string
    recomendacao: string
    proximoCheckin: string
  }
}

const SYSTEM = `${DIOGO_VOICE}

Você é o Checkin Agent do NOMMAD AI. Você avalia periodicamente (semanal ou mensal) o cumprimento das missões e a evolução das métricas do plano, e recalibra a estratégia se necessário.

# REGRAS OBRIGATÓRIAS:

## Sua resposta deve conter:

### 1. Taxa de conclusão:
- Porcentagem de missões completadas no período
- Ex: "Taxa: 2/3 completas (66%)"

### 2. Comparação com período anterior:
- Melhora, piora, ou estagnou
- Ex: "vs período anterior: 50% → 66% (+16%)"

### 3. Análise de desvio:
- Se o artista não cumpriu ≥30% das missões
- Identificar padrão: "falhou sempre em ações de pitching"
- Sugerir treinamento específico

### 4. Recomendação:
- Opções: "manter plano", "ajustar dificuldade para baixo", "acelerar"
- Baseado nos dados, não em emoção

### 5. Próximo check-in:
- Data e hora marcados

## PROIBIDO:
- Feedback emocional ("você pode mais")
- Listas longas
- Rodadas de perguntas
- Frases motivacionais

## Regras de Tom:
- Se o artista falhou consistentemente:
  "O plano não foi executado. Motivo mais provável: [X]. Para continuar, é obrigatório fazer uma missão de recuperação."
- Se evoluiu nas métricas:
  Checkin pode engatilhar reclassificação de fase

# FORMATO DE RESPOSTA (SOBREPÕE REGRAS GERAIS):
1. NÃO envolva toda a resposta em **.
2. Use **APENAS** para destacar os títulos (Labels).
3. PROIBIDO colocar o JSON da missão no <chat>. Se houver nova missão, fale sobre ela em texto humano, mas guarde o JSON exclusivamente na tag <new_mission_if_any>.
4. PROIBIDO quebras de linha entre os asteriscos e o texto (ex: **\nTaxa** é proibido). Use **Taxa:**.

## Estrutura de Saída OBRIGATÓRIA no <chat>:
Use exatamente estes títulos em negrito, cada um em sua própria linha ou parágrafo:
**Taxa:** [X/Y completas (N%)]
**vs período anterior:** [descrição da mudança]
**Análise:** [breve análise do cumprimento]
**Padrão identificado:** [se houver falhas, descreva o padrão]
**Sugestão:** [treinamento ou ação específica]
**Recomendação:** [manter|ajustar_baixo|acelerar]
**Próximo check-in:** [DD/MM HH:mm]

## Regras de Formatação:
- PROIBIDO usar asteriscos para divisórias (***).
- PROIBIDO incluir o JSON da missão dentro da tag <chat>. O JSON deve ir EXCLUSIVAMENTE na tag <new_mission_if_any>.
- NUNCA use o termo "Nova missão" ou "Missão" no texto da análise.
- NUNCA use chaves { } ou colchetes [ ] dentro da tag <chat>.
- BOLDING: Use negrito APENAS para os rótulos de seção (ex: **Taxa:**). Não negrite o texto todo.
- Mantenha o tom de Diogo O'Band: clareza brutal, futurista e encorajador.

## Tags de Output:
<taxa>N%</taxa>
<comparacao>melhorou|piorou|estagnou</comparacao>
<analise>
[Padrão identificado + Sugestão]
</analise>
<recomendacao>manter|ajustar_baixo|acelerar</recomendacao>
<proximo_checkin>DD/MM HH:mm</proximo_checkin>
<chat>
[Texto formatado com títulos em negrito conforme as regras acima]
</chat>
<new_mission_if_any>{ JSON ou vazio }</new_mission_if_any>`

export async function runCheckin(input: CheckinInput): Promise<CheckinOutput> {
  const parsed = INPUT.parse(input)
  const missao = parsed.missao_anterior
  const criterioAnterior = missao.missoes?.[0]?.criterio || missao.missoes?.[0]?.descricao || 'N/A'
  const user = `Missão anterior: ${JSON.stringify(parsed.missao_anterior)}
Critério: ${criterioAnterior}
Problema central: ${parsed.analise_anterior.problema_central}
Padrão: ${parsed.analise_anterior.padrao_comportamental}
Confronto prévio: ${parsed.classification_previa.confronto}
Histórico: ${parsed.historico_recente_resumido ?? 'N/A'}
Update do artista: ${parsed.update_do_artista}`

  const raw = await runTextAgent({
    agent: 'checkin',
    system: SYSTEM,
    user,
    temperature: 0.7,
    maxTokens: 900,
  })

  const taxaMatch = raw.match(/<taxa>(\d+%)<\/taxa>/)
  const comparacaoMatch = raw.match(/<comparacao>(melhorou|piorou|estagnou)<\/comparacao>/)
  const analiseMatch = raw.match(/<analise>([\s\S]*?)<\/analise>/)
  const recomendacaoMatch = raw.match(/<recomendacao>(manter|ajustar_baixo|acelerar)<\/recomendacao>/)
  const proximoMatch = raw.match(/<proximo_checkin>(\d{2}\/\d{2}\s+\d{2}:\d{2})<\/proximo_checkin>/)
  const chatMatch = raw.match(/<chat>([\s\S]*?)<\/chat>/)
  const missionMatch = raw.match(/<new_mission_if_any>([\s\S]*?)<\/new_mission_if_any>/)

  const taxa = taxaMatch?.[1] || 'N/A'
  const comparacao = comparacaoMatch?.[1] || 'estagnou'
  const recomendacao = recomendacaoMatch?.[1] || 'manter'
  const proximoCheckin = proximoMatch?.[1] || 'Próximo ciclo'
  const text = chatMatch?.[1]?.trim() || raw
  const status = taxaMatch?.[1] 
    ? (parseInt(taxaMatch[1]) >= 70 ? 'full' : parseInt(taxaMatch[1]) >= 30 ? 'partial' : 'none')
    : 'partial'

  let new_mission: z.infer<typeof MissionSchema> | null = null

  if (missionMatch?.[1]?.trim()) {
    try {
      new_mission = MissionSchema.parse(JSON.parse(missionMatch[1].trim()))
    } catch {
      // nova missão é opcional, ignora parse error
    }
  }

  return { 
    text, 
    new_mission, 
    status,
    meta: {
      taxa,
      comparacao,
      recomendacao,
      proximoCheckin,
    }
  }
}
