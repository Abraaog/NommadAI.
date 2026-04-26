"use server";

import { z } from 'zod';
import { runJsonAgent } from '../agents/shared';
import { memoryService } from '../brain/memory-service';
import { requireSession } from '../supabase/server';
import { db } from '../db/client';
import { generatedHooks, scripts, kanbanCards } from '../db/schema';
import { eq } from 'drizzle-orm';

const HookSchema = z.object({
  hooks: z.array(z.object({
    title: z.string(),
    body: z.string(),
    category: z.string(),
  })),
});

const ScriptSchema = z.object({
  hook: z.string(),
  introduction: z.string(),
  development: z.string(),
  conclusion: z.string(),
});

/**
 * Gera novos hooks baseados no pilar e na memória do artista.
 */
export async function generateHooksAction(pilar: string) {
  const session = await requireSession();
  const userId = session.user.id;

  // 1. Buscar contexto da memória
  const context = await memoryService.searchContext({
    userId,
    query: `Conteúdo sobre ${pilar}, estilo do artista, referências e objetivos.`,
    limit: 5,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contextText = (context as any[]).map((m) => m.content).join('\n');

  // 2. Gerar hooks com AI
  const system = `Você é o Diretor Criativo e Estrategista do NOMMAD AI.
Sua tarefa é gerar 3 "hooks" (ganchos) de alta conversão para vídeos curtos.

## Sua Missão:
Não gere conteúdo genérico. Use as memórias do artista para:
1. Resolver frustrações específicas citadas no contexto.
2. Alinhar com os objetivos de carreira e referências musicais dele.
3. Manter a autenticidade do DNA artístico encontrado na memória.

## Regras de Tom:
- Linguagem direta, informal e "pé no chão" (estilo Diogo O'Band).
- Fuja de clichês. Se o artista é "low profile", não sugira danças. Se ele é técnico, foque em "nerdices" de estúdio.
- Pilar solicitado: ${pilar}.

## Exemplo de Saída:
{
  "hooks": [
    {
      "title": "Frase de impacto baseada na dor/objetivo",
      "body": "Ideia de vídeo que resolve ou explora um ponto específico da memória.",
      "category": "Categoria"
    }
  ]
}

Importante: Retorne APENAS o JSON. Seja hiper-personalizado.`;

  const user = `Contexto do Artista (Memórias):\n${contextText || 'Nenhuma memória encontrada.'}\n\nPor favor, gere 3 hooks estratégicos para o pilar: ${pilar}.`;

  const result = await runJsonAgent({
    agent: 'brain',
    system,
    user,
    schema: HookSchema,
  });

  // 3. Salvar no banco
  const savedHooks = [];
  for (const h of result.hooks) {
    const [inserted] = await db.insert(generatedHooks).values({
      userId,
      texto: h.body,
      categoria: h.category || pilar,
    }).returning();
    
    savedHooks.push({ 
      id: inserted.id,
      title: h.title,
      body: h.body,
      category: h.category || pilar
    });
  }

  return savedHooks;
}

/**
 * Expande um hook em um roteiro completo.
 */
export async function expandHookAction(hookId: string, title?: string) {
  const session = await requireSession();
  const userId = session.user.id;

  // Buscar o hook original
  const [hook] = await db.select().from(generatedHooks).where(eq(generatedHooks.id, hookId));
  if (!hook) throw new Error('Hook not found');

  const system = `Você é um roteirista especializado em vídeos curtos de alta retenção para música eletrônica.
Sua tarefa é expandir um "hook" em um roteiro completo de 30-60 segundos.

## Estrutura do Roteiro:
- hook: O texto original refinado para fala.
- introduction: Contexto rápido (máx 5 seg).
- development: Valor central, tutorial ou bastidores.
- conclusion: Chamada para ação clara.

## Exemplo de Saída:
{
  "hook": "Texto refinado...",
  "introduction": "Fala aí, hoje eu vou mostrar...",
  "development": "O primeiro passo é abrir o serum...",
  "conclusion": "Segue aí para mais dicas."
}

Mantenha o tom autêntico e técnico. Retorne APENAS o JSON.`;

  const user = `Título do Vídeo: ${title || 'Sem título'}\nCorpo do Hook: ${hook.texto}`;

  const result = await runJsonAgent({
    agent: 'brain',
    system,
    user,
    schema: ScriptSchema,
  });

  // Salvar o roteiro
  const [savedScript] = await db.insert(scripts).values({
    userId,
    hookId: hook.id,
    gancho: result.hook,
    introducao: result.introduction,
    desenvolvimento: result.development,
    encerramento: result.conclusion,
  }).returning();

  return savedScript;
}

/**
 * Salva um roteiro no Kanban Editorial.
 */
export async function saveToKanbanAction(scriptId: string) {
  const session = await requireSession();
  const userId = session.user.id;

  // Buscar o roteiro
  const [script] = await db.select().from(scripts).where(eq(scripts.id, scriptId));
  if (!script) throw new Error('Script not found');

  // Criar card no Kanban
  const [card] = await db.insert(kanbanCards).values({
    userId,
    titulo: script.gancho || 'Novo Roteiro',
    tipo: 'conteudo',
    coluna: 'ideias',
    insights: `[Introdução]\n${script.introducao}\n\n[Desenvolvimento]\n${script.desenvolvimento}\n\n[Conclusão]\n${script.encerramento}`,
  }).returning();

  return card;
}

/**
 * Descarta um hook.
 */
export async function discardHookAction(hookId: string) {
  const session = await requireSession();
  const userId = session.user.id;

  await db.delete(generatedHooks).where(eq(generatedHooks.id, hookId));
  return { success: true };
}
