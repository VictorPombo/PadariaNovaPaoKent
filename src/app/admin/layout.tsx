import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div 
      className="flex h-[100dvh] w-full max-w-[100vw] overflow-hidden admin-panel text-white font-sans bg-neutral-950 relative"
    >
      {/* Ambient glow spots */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-amber-500/3 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/2 blur-[140px] pointer-events-none z-0" />

      {/* Sidebar */}
      <AdminSidebar profile={profile} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden relative z-10">
        {/* Topbar */}
        <AdminTopbar user={user} profile={profile} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full px-3 py-3 sm:px-6 sm:py-5 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}


