
import { z } from 'zod'
import { runJsonAgent, type AgentName } from './shared'
import { memoryService } from '../brain/memory-service'

const MemoryExtractionSchema = z.object({
  memories: z.array(z.object({
    content: z.string(),
    importance: z.number().min(1).max(5),
    tags: z.array(z.string()),
  })),
})

/**
 * Memory Agent
 * Extrai memórias atômicas de uma conversa ou sessão.
 */
export async function extractAndSaveMemories(userId: string, sessionId: string, conversationText: string) {
  const system = `
    Você é o Agente de Memória do NOMMAD AI.
    Sua tarefa é analisar o texto de uma sessão/conversa e extrair "memórias atômicas" relevantes para o futuro do artista.
    
    Regras:
    1. Foque em: Objetivos, Preferências, Frustrações, Decisões Tomadas, Referências Citadas.
    2. Ignore: Papo furado, saudações, ou informações repetitivas.
    3. Cada memória deve ser curta e direta.
    4. Atribua uma importância de 1 a 5.
  `;

  const user = `Texto da Sessão:\n\n${conversationText}`;

  try {
    const result = await runJsonAgent({
      agent: 'brain', // Usando o modelo mais potente gpt-oss-120b
      system,
      user,
      schema: MemoryExtractionSchema,
    });

    console.log(`[MemoryAgent] Extraídas ${result.memories.length} memórias.`);

    for (const mem of result.memories) {
      await memoryService.saveMemory({
        userId,
        sessionId,
        content: mem.content,
        metadata: {
          importance: mem.importance,
          tags: mem.tags,
          source: 'session_extraction',
        },
      });
    }

    return result.memories;
  } catch (error) {
    console.error('[MemoryAgent] Erro ao extrair memórias:', error);
    return [];
  }
}
