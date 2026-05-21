'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { Profile } from '@/types'
import BakeryLogo from '../ui/BakeryLogo'
import {
  LayoutDashboard,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Package,
  ChefHat,
  Trash2,
  CreditCard,
  Users,
  Star,
  ClipboardList,
  Footprints,
  Target,
  Share2,
  Brain,
  FileText,
  Wrench,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  type LucideIcon,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types & Config
// ---------------------------------------------------------------------------

interface NavItem {
  href: string
  icon: LucideIcon
  label: string
}

interface NavCategory {
  title: string
  items: NavItem[]
}

const navCategories: NavCategory[] = [
  {
    title: 'OPERAÇÃO',
    items: [
      { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/alerts', icon: AlertTriangle, label: 'Alertas' },
      { href: '/admin/orders', icon: ShoppingCart, label: 'Pedidos' },
      { href: '/admin/revenue', icon: DollarSign, label: 'Faturamento' },
      { href: '/admin/stock', icon: Package, label: 'Estoque' },
      { href: '/admin/production', icon: ChefHat, label: 'Produção' },
      { href: '/admin/waste', icon: Trash2, label: 'Desperdício' },
      { href: '/admin/menu', icon: ClipboardList, label: 'Cardápio' },
      { href: '/admin/equipment', icon: Wrench, label: 'Equipamentos' },
    ],
  },
  {
    title: 'FINANCEIRO',
    items: [
      { href: '/admin/dre', icon: BarChart3, label: 'DRE & CMV' },
      { href: '/admin/expenses', icon: CreditCard, label: 'Gastos' },
      { href: '/admin/goals', icon: Target, label: 'Metas' },
      { href: '/admin/foot-traffic', icon: Footprints, label: 'Fluxo presencial' },
      { href: '/admin/reports', icon: FileText, label: 'Relatórios' },
    ],
  },
  {
    title: 'CRM & IA',
    items: [
      { href: '/admin/customers', icon: Users, label: 'CRM Clientes' },
      { href: '/admin/reviews', icon: Star, label: 'Avaliações' },
      { href: '/admin/social', icon: Share2, label: 'Redes sociais' },
      { href: '/admin/ai-assistant', icon: Brain, label: 'IA Gerencial' },
      { href: '/admin/settings', icon: Settings, label: 'Sistema' },
    ],
  },
]

const roleLabels: Record<string, string> = {
  owner: 'Proprietário',
  manager: 'Gerente',
  cashier: 'Caixa',
}

interface SidebarContentProps {
  profile: Profile | null
  pathname: string
  onLogout: () => void
  onNavClick?: () => void
}

// ---------------------------------------------------------------------------
// SidebarContent Component
// ---------------------------------------------------------------------------

function SidebarContent({ profile, pathname, onLogout, onNavClick }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 flex-shrink-0 border-b border-[#C9A84C]/10">
        <div className="flex-shrink-0">
          <BakeryLogo size={36} />
        </div>
        <div>
          <p className="font-bold text-[14px] leading-tight text-[#FAF6EF] tracking-wide" style={{ fontFamily: 'var(--font-serif)' }}>
            Nova Pão Kent
          </p>
          <p className="text-[9px] text-[#C9A84C] font-extrabold tracking-widest mt-0.5">
            PAINEL GERENCIAL
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {navCategories.map((category) => (
          <div key={category.title}>
            <p className="px-3 mb-2.5 text-[9px] font-extrabold uppercase tracking-widest text-[#9E7A2E]/90">
              {category.title}
            </p>
            <div className="space-y-1">
              {category.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavClick}
                    className={`flex items-center gap-3 px-3.5 py-2 text-[13px] rounded-xl transition-all duration-200 group outline-none relative border ${
                      isActive
                        ? 'text-[#FAF6EF] font-semibold bg-[#C9A84C]/8 border-[#C9A84C]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.02] border-transparent'
                    }`}
                  >
                    <Icon 
                      size={16} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={isActive ? 'text-[#C9A84C]' : 'text-neutral-500 group-hover:text-neutral-300 transition-colors'} 
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User info + Bottom Actions */}
      <div className="px-4 py-4 flex-shrink-0 border-t border-[#C9A84C]/10 bg-[#1A0F08]/10 backdrop-blur-md">
        <Link
          href="/"
          target="_blank"
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-2 text-xs mb-3 transition-colors text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg group"
        >
          <Globe size={14} className="text-neutral-500 group-hover:text-neutral-300 transition-colors" />
          <span>Ver site público</span>
        </Link>
        
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs shadow-md border border-white/10"
              style={{ background: 'linear-gradient(135deg, #9E7A2E 0%, #C9A84C 100%)', color: '#1A0F0A' }}
            >
              {profile?.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col truncate min-w-0">
              <span className="text-xs font-semibold text-[#FAF6EF] truncate">
                {profile?.full_name?.split(' ')[0] || 'Admin'}
              </span>
              <span className="text-[10px] text-neutral-500 truncate">
                {roleLabels[profile?.role || ''] || 'Acesso'}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer bg-transparent border border-transparent hover:border-red-500/20 outline-none"
            title="Sair do sistema"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Sidebar Component
// ---------------------------------------------------------------------------

interface AdminSidebarProps {
  profile: Profile | null
}

export default function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }, [supabase, router])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="lg:hidden fixed top-[12px] left-4 z-50 flex items-center justify-center w-10 h-10 rounded-xl border border-[#C9A84C]/25 bg-[#2C1A0E]/80 backdrop-blur-md text-[#FAF6EF] hover:bg-[#3d2719]/80 transition-all shadow-md cursor-pointer"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Desktop Sidebar */}
      <aside
        id="admin-sidebar"
        className="hidden lg:flex flex-col h-screen overflow-hidden w-[260px] sidebar-glass flex-shrink-0 relative z-20"
      >
        <SidebarContent
          profile={profile}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden bg-[#1A0F08]/70 backdrop-blur-sm"
              onClick={closeMobile}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              key="sidebar-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed top-0 left-0 h-screen z-50 flex flex-col lg:hidden overflow-hidden w-[260px] sidebar-glass shadow-2xl"
            >
              <SidebarContent
                profile={profile}
                pathname={pathname}
                onLogout={handleLogout}
                onNavClick={closeMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
