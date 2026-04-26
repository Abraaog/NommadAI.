import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase/server';
import { db } from '@/lib/db/client';
import { identity, profiles, memories, sessions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { runIdentityAgent } from '@/lib/agents/identity';

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Try to get existing identity
    const existingIdentities = await db.select().from(identity).where(eq(identity.userId, user.id)).limit(1);
    const existingIdentity = existingIdentities[0];

    // 2. If it exists and is recent (e.g., less than 24h), return it
    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';

    if (existingIdentity && !forceRefresh) {
      return NextResponse.json(existingIdentity);
    }

    // 3. Generate new identity if not exists or forced
    // Fetch context
    const profileResults = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
    const profileData = profileResults[0];

    const userMemories = await db.select().from(memories)
      .where(eq(memories.userId, user.id))
      .orderBy(desc(memories.createdAt))
      .limit(10);

    const recentSessions = await db.select().from(sessions)
      .where(eq(sessions.userId, user.id))
      .orderBy(desc(sessions.createdAt))
      .limit(5);

    const identityData = await runIdentityAgent({
      profile: profileData,
      memories: userMemories.map(m => m.content),
      recent_sessions: recentSessions
    });

    // 4. Upsert into database
    const newIdentity = {
      userId: user.id,
      essencia: identityData.posicionamento_sintese,
      tesesCentrais: [identityData.grande_tese],
      tesesSecundarias: [identityData.inimigo_cultural],
      dna: identityData.dna,
      updatedAt: new Date()
    };

    await db.insert(identity)
      .values(newIdentity as any)
      .onConflictDoUpdate({
        target: identity.userId,
        set: newIdentity as any
      });

    return NextResponse.json(newIdentity);

  } catch (error) {
    console.error('[IDENTITY_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
