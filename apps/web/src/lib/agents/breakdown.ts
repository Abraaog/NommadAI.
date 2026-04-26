import { runJsonAgent, DIOGO_VOICE, BreakdownSchema, type Breakdown } from './shared'

export async function runBreakdown(
  mission: { titulo: string; descricao: string; criterio: string },
  context: { identity: string; phase: string }
): Promise<Breakdown> {
  const system = `
${DIOGO_VOICE}

## Sua Tarefa:
Você é o estrategista do NOMMAD AI. Sua missão é pegar uma Missão de Alto Nível e quebrá-la em 3 a 5 tarefas específicas, acionáveis e de curto prazo para o quadro Kanban do artista.

Cada tarefa deve ser clara, executável e contribuir diretamente para o sucesso da missão principal.

## Contexto do Artista:
${context.identity}
Fase Atual: ${context.phase}

## Missão para Decompor:
Título: ${mission.titulo}
Descrição: ${mission.descricao}
Critério de Sucesso: ${mission.criterio}

## Regras de Saída:
- Retorne um objeto JSON com um array 'tasks'.
- Cada task deve ter:
  - 'titulo': Curto, direto e imperativo (ex: "Gravar vocal do refrão", "Criar 3 legendas para Reels").
  - 'tipo': 'conteudo', 'musica' ou 'branding'.
  - 'tag': Uma tag curta (ex: "Social Media", "Produção", "Estratégia").
- Mantenha o tom do Diogo O'Band: foco em execução e clareza.
`

  return runJsonAgent({
    agent: 'breakdown' as any,
    system,
    user: `Decomponha a missão "${mission.titulo}" em tarefas práticas para o meu Kanban.`,
    schema: BreakdownSchema,
    temperature: 0.7
  })
}
