import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/supabase/server'
import { PREVIEW_MODE } from '@/lib/env'
import { getDb } from '@/lib/db/client'
import { missions } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession()
    if (PREVIEW_MODE) return NextResponse.json({ missions: [] })

    const db = getDb()
    const activeMissions = await db
      .select()
      .from(missions)
      .where(and(eq(missions.userId, session.user.id), eq(missions.status, 'active')))
      .orderBy(desc(missions.createdAt))

    return NextResponse.json({ missions: activeMissions })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
