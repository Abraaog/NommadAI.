import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { GamificationWrapper } from '@/components/gamification-wrapper'
import { requireSession } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession().catch(() => null)
  
  const mockUser = {
    id: 'mock-id-123',
    email: 'artista@nommad.ai',
    user_metadata: { full_name: 'Artista NOMMAD', user_name: 'artista' }
  };
  
  const user = session?.user || mockUser;
  const displayName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Artista'
  const handle = user.user_metadata?.user_name ?? user.email?.split('@')[0] ?? ''

  return (
    <GamificationWrapper>
      <div className="flex min-h-screen bg-[#050507] mesh-bg">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen
          pt-14 pb-16
          lg:pt-0 lg:pb-0
          lg:ml-[calc(var(--sidebar-width)+1rem)] lg:p-4">
          <TopBar displayName={displayName} handle={handle} avatarSeed={user.id} />
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
