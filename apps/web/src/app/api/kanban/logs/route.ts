import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/supabase/server'
import { PREVIEW_MODE } from '@/lib/env'
import { getDb } from '@/lib/db/client'
import { kanbanCardLogs } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession()
    if (PREVIEW_MODE) return NextResponse.json({ logs: [] })

    const { searchParams } = new URL(req.url)
    const cardId = searchParams.get('cardId')

    if (!cardId) {
      return NextResponse.json({ error: 'Missing cardId' }, { status: 400 })
    }

    const db = getDb()
    const logs = await db
      .select()
      .from(kanbanCardLogs)
      .where(eq(kanbanCardLogs.cardId, cardId))
      .orderBy(desc(kanbanCardLogs.createdAt))

    return NextResponse.json({ logs })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
