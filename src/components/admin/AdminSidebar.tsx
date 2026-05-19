'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types'

const navItems = [
  { href: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/admin/alerts', icon: '🚨', label: 'Alertas' },
  { href: '/admin/orders', icon: '🛒', label: 'Pedidos' },
  { href: '/admin/revenue', icon: '💰', label: 'Faturamento' },
  { href: '/admin/dre', icon: '📊', label: 'DRE & CMV' },
  { href: '/admin/stock', icon: '📦', label: 'Estoque' },
  { href: '/admin/production', icon: '🍞', label: 'Produção' },
  { href: '/admin/waste', icon: '🗑️', label: 'Desperdício' },
  { href: '/admin/expenses', icon: '💳', label: 'Gastos' },
  { href: '/admin/customers', icon: '👥', label: 'CRM Clientes' },
  { href: '/admin/reviews', icon: '⭐', label: 'Avaliações' },
  { href: '/admin/menu', icon: '📋', label: 'Cardápio' },
  { href: '/admin/foot-traffic', icon: '🧑', label: 'Fluxo Presencial' },
  { href: '/admin/goals', icon: '🎯', label: 'Metas' },
  { href: '/admin/social', icon: '📱', label: 'Redes Sociais' },
  { href: '/admin/ai-assistant', icon: '🧠', label: 'IA Gerencial' },
  { href: '/admin/reports', icon: '📊', label: 'Relatórios' },
  { href: '/admin/equipment', icon: '🔧', label: 'Equipamentos' },
  { href: '/admin/settings', icon: '⚙️', label: 'Sistema' },
]

interface AdminSidebarProps {
  profile: Profile | null
}

export default function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const roleLabels: Record<string, string> = {
    owner: '👑 Proprietário',
    manager: '🎯 Gerente',
    cashier: '💳 Caixa',
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        id="admin-sidebar"
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 overflow-y-auto"
        style={{
          width: '260px',
          background: '#1A1A1A',
          borderRight: '1px solid #2A2A2A',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5"
          style={{ borderBottom: '1px solid #2A2A2A' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)' }}
          >
            🍞
          </div>
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: '#FAF6EF', fontFamily: 'var(--font-playfair)' }}>
              Nova Paokent
            </p>
            <p className="text-xs" style={{ color: '#C9A84C' }}>Gestão Inteligente</p>
          </div>
        </div>

        {/* User info */}
        {profile && (
          <div
            className="px-5 py-3 mx-3 my-3 rounded-xl"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}
          >
            <p className="text-sm font-medium truncate" style={{ color: '#E8E8E8' }}>
              {profile.full_name}
            </p>
            <p className="text-xs" style={{ color: '#C9A84C' }}>
              {roleLabels[profile.role] || profile.role}
            </p>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 pb-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
                style={{
                  background: isActive ? 'rgba(201,168,76,0.15)' : 'transparent',
                  color: isActive ? '#C9A84C' : '#888888',
                  fontWeight: isActive ? '600' : '400',
                  textDecoration: 'none',
                  borderLeft: isActive ? '2px solid #C9A84C' : '2px solid transparent',
                }}
              >
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout + Site link */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid #2A2A2A' }}>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors"
            style={{ color: '#555555', textDecoration: 'none' }}
          >
            <span>🌐</span>
            <span>Ver site público</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-colors"
            style={{ color: '#555555', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%' }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#EF4444' }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#555555' }}
          >
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
