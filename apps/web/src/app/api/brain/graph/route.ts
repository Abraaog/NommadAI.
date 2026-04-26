import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase/server';
import { memoryService } from '@/lib/brain/memory-service';
import { runJsonAgent } from '@/lib/agents/shared';
import { z } from 'zod';

const GraphSchema = z.object({
  nodes: z.array(z.object({
    id: z.string(),
    name: z.string(),
    group: z.number(),
    val: z.number()
  })),
  links: z.array(z.object({
    source: z.string(),
    target: z.string()
  }))
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    
    // 1. Buscar memórias para extrair teses e referências
    const memories = await memoryService.searchContext({
      userId: user.id,
      query: "sonoridade estilo referencias tracks objetivos carreira",
      limit: 10
    });

    const contextText = (memories as any[]).map(m => m.content).join('\n---\n');

    const fallbackData = {
      nodes: [
        { id: 'essencia', name: 'Sua Essência', group: 1, val: 25 },
        { id: 'tese1', name: 'Groove & Timbre', group: 2, val: 12 },
        { id: 'tese2', name: 'Presença Digital', group: 2, val: 12 },
        { id: 'track1', name: 'Tracks no HD', group: 3, val: 8 },
        { id: 'ref1', name: 'Solid Grooves', group: 4, val: 6 },
      ],
      links: [
        { source: 'tese1', target: 'essencia' },
        { source: 'tese2', target: 'essencia' },
        { source: 'track1', target: 'tese1' },
        { source: 'ref1', target: 'tese1' },
      ]
    };

    if (!contextText) {
      return NextResponse.json(fallbackData);
    }

    // 2. Usar IA para estruturar o grafo com base no contexto REAL
    try {
      const graphData = await runJsonAgent({
        agent: 'brain',
        system: `Você é o Arquiteto do NOMMAD. Gere um JSON para o mapa mental do artista.
        
        ESTRUTURA OBRIGATÓRIA (Siga exatamente):
        {
          "nodes": [
            {"id": "essencia", "name": "...", "group": 1, "val": 25},
            {"id": "tese1", "name": "...", "group": 2, "val": 12},
            ...
          ],
          "links": [
            {"source": "tese1", "target": "essencia"},
            ...
          ]
        }

        REGRAS CRÍTICAS:
        1. O campo "nodes" deve ser um ARRAY de objetos.
        2. O campo "links" deve ser um ARRAY de objetos.
        3. "essencia" deve ser o ID do nó central (Group 1).
        4. Crie no máximo 12 nós no total.
        5. "source" e "target" nos links DEVEM ser IDs existentes no array "nodes".
        6. Não adicione texto fora do JSON.`,
        user: `Contexto do Artista:\n${contextText}`,
        schema: GraphSchema,
        retries: 2
      });

      return NextResponse.json(graphData);
    } catch (agentError) {
      console.warn('[BRAIN_GRAPH_AGENT_FAILED] Usando fallback:', agentError);
      return NextResponse.json(fallbackData);
    }

  } catch (error) {
    console.error('[BRAIN_GRAPH_ERROR]', error);
    // Mesmo em erro fatal de sistema, retornamos algo válido para o front não quebrar
    return NextResponse.json({
      nodes: [{ id: 'essencia', name: 'Sua Essência', group: 1, val: 25 }],
      links: []
    });
  }
}
