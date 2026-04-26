import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase/server';
import { runClassifier } from '@/lib/agents/classifier';
import { db } from '@/lib/db/client';
import { profiles, sessions, missions } from '@/lib/db/schema';
import { memoryService } from '@/lib/brain/memory-service';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { visionText } = await req.json();

    if (!visionText) {
      return NextResponse.json({ error: 'Vision text is required' }, { status: 400 });
    }

    // 1. Create Session first (for telemetry/tracking)
    const [newSession] = await db.insert(sessions).values({
      userId: user.id,
      kind: 'onboarding',
      inputText: visionText,
    } as any).returning();

    // 2. Run Classifier with the new session ID
    const classification = await runClassifier({ 
      visionText,
      sessionId: newSession.id 
    });

    // 3. Update Profile (Upsert)
    await db.insert(profiles)
      .values({
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        stage: classification.nivel,
        confrontoLevel: classification.confronto,
        faseCarreira: classification.fase_carreira,
        nivelTecnico: classification.nivel_tecnico,
        arquetipoEstrategico: classification.arquetipo_estrategico,
        network: classification.network,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          stage: classification.nivel,
          confrontoLevel: classification.confronto,
          faseCarreira: classification.fase_carreira,
          nivelTecnico: classification.nivel_tecnico,
          arquetipoEstrategico: classification.arquetipo_estrategico,
          network: classification.network,
          updatedAt: new Date(),
        }
      });

    // 3. Create Initial Memory (The Core Context)
    await memoryService.saveMemory({
      userId: user.id,
      content: visionText,
      metadata: { source: 'onboarding', stage: classification.nivel }
    });

    // 4. Create Initial Mission
    await db.insert(missions).values({
      userId: user.id,
      titulo: `Lançamento: 3 Tracks (HD -> Mercado)`,
      descricao: `Você tem 3 tracks masters. Vamos criar o universo visual para elas e sair do cemitério do Instagram.`,
      status: 'active',
      confrontoNivel: classification.confronto,
    });

    // 5. Log Activity (Already created at step 1)

    return NextResponse.json({ 
      success: true, 
      classification,
      redirect: '/dashboard' 
    });

  } catch (error) {
    console.error('[ONBOARDING_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
