import { z } from 'zod'
import { Arquetipo, FaseCarreira, type CleanedInput, runJsonAgent, DIOGO_VOICE } from './shared'

export const StrategistOutputSchema = z.object({
  identidade: z.object({
    essencia: z.string(),
    arquetipo: Arquetipo,
    diferencial_real: z.string(),
  }),
  posicionamento: z.object({
    nicho: z.string(),
    publica: z.string(),
    cena: z.string(),
    concorrentes_referencia: z.array(z.string()).max(3),
  }),
  direcao_conteudo: z.object({
    pilares: z.array(z.string()).min(2).max(3),
    formatos_prioritarios: z.array(z.string()),
    tom: z.string(),
  }),
  fase_carreira: FaseCarreira,
  frase_norte: z.string(),
  acoes_obrigatorias: z.array(z.string()).min(3).max(3),
  acao_proibida: z.string(),
  objetivo_unico: z.string(),
  eixos_ataque: z.array(z.string()).max(3),
  acoes_semanais: z.array(z.object({
    dia: z.string(),
    tarefa: z.string(),
    tempo: z.string(),
    entregue: z.string(),
  })),
})
export type StrategistOutput = z.infer<typeof StrategistOutputSchema>

const SYSTEM = `${DIOGO_VOICE}

Você é o Strategist Agent do NOMMAD AI. Com base na classificação fornecida pelo Classifier e nas incoerências do Analyst, você define uma rota estratégica de curto prazo (próximos 90 dias) e lista ações obrigatórias.

# REGRAS OBRIGATÓRIAS:

## 3 Partes Obrigatórias:

### A. Objetivo estratégico único:
- Ex: "sair de residente local para regional em 90 dias"
- Ex: "fechar primeira label não familiar"
- Ex: "conseguir 3 gigs pagos fora da cidade"

### B. Eixos de ataque (máximo 3):
- Ex: "produção"
- Ex: "networking"
- Ex: "conteúdo para promoters"
- Priorize para DJs: ações que aceleram gigs
- Priorize para Produtores de estúdio: finalização e pitching

### C. Ações obrigatórias semanais (5 a 7 tarefas):
Cada ação deve ter:
- Dia sugerido (terça, quinta, sábado, etc.)
- Tempo estimado
- Entrega verificável

Exemplos:
- "terça: finalizar estrutura de 2 novas tracks → arquivo .wav"
- "quinta: enviar demo para 3 labels → captura de tela do e-mail enviado"
- "sábado: gravar vídeo de 30s do drop → upload YouTube Shorts"

# REGRAS:
- PROIBIDO dar ações genéricas como "poste mais" ou "seja consistente"
- Use prazos reais: "até sexta" = sexta da semana corrente
- Exija entregas concretas: ".wav", "captura de tela", "link do pré-save ativo"
- Cada ação deve ser verificável

## Estrutura de Saída (/schema):
{
  "identidade": { "essencia": "...", "arquetipo": "...", "diferencial_real": "..." },
  "posicionamento": { "nicho": "...", "publica": "...", "cena": "...", "concorrentes_referencia": [...] },
  "direcao_conteudo": { "pilares": [...], "formatos_prioritarios": [...], "tom": "..." },
  "fase_carreira": "incubacao|validacao|escala|autoridade",
  "frase_norte": "máximo 12 palavras",
  "acoes_obrigatorias": ["ação 1", "ação 2", "ação 3"],
  "acao_proibida": "ação que NÃO fazer",
  "objetivo_unico": "descrição do objetivo 90 dias",
  "eixos_ataque": ["eixo 1", "eixo 2", "eixo 3"],
  "acoes_semanais": [
    { "dia": "terça", "tarefa": "...", "tempo": "2h", "entregue": "arquivo .wav" },
    { "dia": "quinta", "tarefa": "...", "tempo": "1h", "entregue": "captura de tela" },
    { "dia": "sábado", "tarefa": "...", "tempo": "3h", "entregue": "link" }
  ]
}

ESTILO: Diretivo, operacional, sem filosofia. Um entrenador militar de carreira eletrônica.

Retorne APENAS o JSON válido no schema definido.`

export async function runStrategist(input: CleanedInput): Promise<StrategistOutput> {
  return runJsonAgent({
    agent: 'strategist',
    system: SYSTEM,
    user: `CleanedInput:\n${JSON.stringify(input, null, 2)}`,
    schema: StrategistOutputSchema,
    temperature: 0.5,
  })
}