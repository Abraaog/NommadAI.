
import { db } from '../db/client'
import { memories } from '../db/schema'
import { eq, sql } from 'drizzle-orm'

/**
 * Serviço de Memória do NOMMAD AI
 * Responsável por gerenciar o armazenamento e recuperação de contexto vetorial.
 */
export class MemoryService {
  /**
   * Gera o embedding para um texto usando a API da OpenAI (ou similar).
   * TODO: Integrar com o Worker Python (sentence-transformers) para embeddings locais.
   */
  private async getEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'placeholder') {
      // Em modo local, retornamos um vetor zerado apenas para preencher o banco,
      // mas a busca usará ILIKE conforme implementado no searchContext.
      return new Array(384).fill(0);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-3-small',
        }),
      });

      const json = await response.json();
      return json.data[0].embedding;
    } catch (error) {
      console.error('[MemoryService] Erro ao gerar embedding:', error);
      return new Array(384).fill(0);
    }
  }

  /**
   * Salva uma nova memória no banco de dados.
   */
  async saveMemory(params: {
    userId: string;
    content: string;
    sessionId?: string;
    metadata?: any;
  }) {
    console.log(`[MemoryService] Salvando memória para usuário ${params.userId}...`);
    
    const embedding = await this.getEmbedding(params.content);

    const [newMemory] = await db.insert(memories).values({
      userId: params.userId,
      sessionId: params.sessionId,
      content: params.content,
      embedding: embedding,
      metadata: params.metadata,
    }).returning();

    return newMemory;
  }

  /**
   * Busca memórias similares para um contexto de conversa.
   */
  async searchContext(params: {
    userId: string;
    query: string;
    limit?: number;
  }) {
    const { userId, query, limit = 5 } = params;
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Se não tiver API Key, faz uma busca por texto simples (Local & Simples)
    if (!apiKey || apiKey === 'placeholder') {
      console.log(`[MemoryService] Buscando contexto local para: "${query}"`);
      
      // Busca simples por palavras-chave ou as mais recentes
      const words = query.split(' ').filter(w => w.length > 3);
      let results;

      if (words.length > 0) {
        // Busca memórias que contenham alguma das palavras
        const conditions = words.map(w => sql`content ILIKE ${'%' + w + '%'}`);
        const combinedCondition = sql.join(conditions, sql` OR `);
        
        results = await db.execute(sql`
          SELECT id, content, metadata, 0 as distance
          FROM memories
          WHERE user_id = ${userId} AND (${combinedCondition})
          ORDER BY created_at DESC
          LIMIT ${limit}
        `);
      } else {
        // Se a query for muito curta, pega as últimas memórias
        results = await db.execute(sql`
          SELECT id, content, metadata, 0 as distance
          FROM memories
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
          LIMIT ${limit}
        `);
      }
      
      return results;
    }
    
    const embedding = await this.getEmbedding(query);
    const vectorStr = `[${embedding.join(',')}]`;

    // Busca usando similaridade de cosseno via pgvector
    const results = await db.execute(sql`
      SELECT id, content, metadata, (embedding <=> ${vectorStr}::vector) as distance
      FROM memories
      WHERE user_id = ${userId}
      ORDER BY distance ASC
      LIMIT ${limit}
    `);

    return results;
  }

  /**
   * Remove todas as memórias de um usuário (reset).
   */
  async clearMemories(userId: string) {
    await db.delete(memories).where(eq(memories.userId, userId));
  }
}

export const memoryService = new MemoryService();
