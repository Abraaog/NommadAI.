import { z } from 'zod';
import { runJsonAgent } from '../shared';

export const NetworkAssetSchema = z.object({
  contatos: z.array(z.object({
    nome: z.string(),
    tipo: z.enum(['contratante', 'artista', 'parceiro', 'imprensa', 'outro']),
    nivel_relacao: z.enum(['lead', 'conhecido', 'proximo', 'aliado']),
    contexto: z.string(),
    potencial: z.string(),
  })),
});

export type NetworkAsset = z.infer<typeof NetworkAssetSchema>;

export async function extractNetworkAssets(
  conversa: string,
  sessionId?: string
): Promise<NetworkAsset> {
  const system = `
Você é o NETWORK BUILDER AGENT do NOMMAD OS.
Sua função é transformar conversas de negociação em ativos de rede (CRM).

## O que extrair:
- Nome das pessoas mencionadas.
- Tipo de contato (Contratante, Artista, Parceiro, etc.).
- Nível de relação atual baseado no tom da conversa.
- Contexto da oportunidade.
- Potencial futuro dessa relação.

Retorne APENAS um JSON válido.
`;

  const user = `
EVIDÊNCIA (CONVERSA/PROVA):
${conversa}

Extraia todos os contatos e ativos de rede identificados nesta interação.
`;

  return runJsonAgent({
    agent: 'boss_network',
    system,
    user,
    schema: NetworkAssetSchema,
    sessionId,
  });
}
