import { NextRequest, NextResponse } from 'next/server'

// PREVIEW MODE: Supabase não configurado — todas as requisições passam livremente.
// Quando o backend estiver pronto, restaure a lógica de auth aqui.
export function proxy(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
