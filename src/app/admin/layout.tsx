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
      className="flex h-screen overflow-hidden"
      style={{ background: '#0F0F0F', color: '#E8E8E8', fontFamily: 'var(--font-inter)' }}
    >
      {/* Sidebar */}
      <AdminSidebar profile={profile} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-[260px]">
        {/* Topbar */}
        <AdminTopbar user={user} profile={profile} />

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto p-4 lg:p-6"
          style={{ background: '#0F0F0F' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
