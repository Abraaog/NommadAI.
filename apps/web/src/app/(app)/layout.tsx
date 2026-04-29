import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { GamificationWrapper } from '@/components/gamification-wrapper'
import { requireUser } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  
  // Buscar perfil no banco para persistência
  let profile = null;
  try {
    const { createSupabaseServer } = await import('@/lib/supabase/server');
    const supabase = await createSupabaseServer();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    profile = data;
  } catch (err) {
    console.error('[layout] Erro ao buscar perfil:', err);
  }

  const displayName = profile?.name || (user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Artista')
  const handle = profile?.artist_name || (user.user_metadata?.user_name ?? user.email?.split('@')[0] ?? '')
  const currentAvatarUrl = profile?.avatar_url || null;

  return (
    <GamificationWrapper>
      <div className="flex min-h-screen bg-[#050507] mesh-bg">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen
          pt-14 pb-16
          lg:pt-0 lg:pb-0
          lg:ml-[calc(var(--sidebar-width)+1rem)] lg:p-4">
          <TopBar 
            displayName={displayName} 
            handle={handle} 
            avatarSeed={user.id} 
            avatarUrl={currentAvatarUrl} 
          />
          <main className="flex-1 overflow-y-auto no-scrollbar
            lg:pt-[calc(var(--topbar-height)+1rem)]">
            <div className="anim-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </GamificationWrapper>
  )
}
