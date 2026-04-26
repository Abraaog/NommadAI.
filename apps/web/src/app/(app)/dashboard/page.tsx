import { ModuleGrid } from '@/components/dashboard/module-grid'
import { Sparkles } from 'lucide-react'
import { requireUser } from '@/lib/supabase/server'
import { db } from '@/lib/db/client'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

import { redirect } from 'next/navigation'

export default async function DashboardIndexPage() {
  const user = await requireUser()
  
  const [profile] = await db.select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1)

  if (!profile || profile.stage === 'pendente') {
    redirect('/onboarding')
  }

  const stage = profile.stage || 'iniciante'
  const name = profile.name || user.user_metadata?.full_name || 'Artista'

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      <section className="space-y-2">
        <div className="flex items-center gap-2 text-yellow-500">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Centro de Operações • {stage.toUpperCase()}</span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
          Bem-vindo, <span className="text-yellow-500">{name}</span>
        </h1>
        <p className="text-neutral-500 max-w-2xl text-sm lg:text-base leading-relaxed">
          Sua central de controle para carreira artística. Gerencie sua marca, negociações, 
          lançamentos e estratégia em um só lugar com inteligência artificial.
        </p>
      </section>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">Seus Módulos</h2>
          <div className="h-px flex-1 bg-white/5 mx-6" />
        </div>
        <ModuleGrid stage={stage as any} />
      </div>

      {/* Placeholder para Atividade Recente ou Notificações do Cérebro */}
      <section className="glass-card p-8 border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-neutral-600">
          <Sparkles size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold">Cérebro NOMMAD está analisando sua visão...</h3>
          <p className="text-neutral-500 text-sm mt-1">Seu plano de ação para o nível <span className="text-yellow-500 font-bold uppercase">{stage}</span> está sendo gerado.</p>
        </div>
      </section>
    </div>
  )
}

