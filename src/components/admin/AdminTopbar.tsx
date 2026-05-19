'use client'

import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

interface AdminTopbarProps {
  user: User
  profile: Profile | null
}

export default function AdminTopbar({ user, profile }: AdminTopbarProps) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  const hour = now.getHours()
  const shift = hour >= 6 && hour < 14 ? '🌅 Turno 1' : '🌙 Turno 2'

  return (
    <header
      className="flex items-center justify-between px-4 lg:px-6 py-3 flex-shrink-0"
      style={{
        background: '#1A1A1A',
        borderBottom: '1px solid #2A2A2A',
        height: '60px',
      }}
    >
      {/* Esquerda: Data e turno */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <p className="text-sm font-medium capitalize" style={{ color: '#E8E8E8' }}>
            {dateStr}
          </p>
          <p className="text-xs" style={{ color: '#888888' }}>
            {shift} • {timeStr}
          </p>
        </div>
      </div>

      {/* Centro: Search / Quick action */}
      <div className="flex-1 max-w-xs mx-4 hidden md:block">
        <Link
          href="/admin/ai-assistant"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid #2A2A2A',
            color: '#555555',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'rgba(201,168,76,0.3)'
            el.style.color = '#888888'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.borderColor = '#2A2A2A'
            el.style.color = '#555555'
          }}
        >
          <span>🧠</span>
          <span>Perguntar à IA... (ex: &quot;quanto vendemos hoje?&quot;)</span>
        </Link>
      </div>

      {/* Direita: Alertas + User */}
      <div className="flex items-center gap-3">
        {/* Botão de alertas */}
        <Link
          href="/admin/alerts"
          className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
          style={{ background: 'rgba(239,68,68,0.1)', textDecoration: 'none' }}
          title="Ver alertas"
        >
          <span className="text-lg">🚨</span>
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold"
            style={{ background: '#EF4444', color: 'white' }}
          >
            !
          </span>
        </Link>

        {/* User avatar */}
        <div
          className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 transition-colors"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)', color: '#2C1A0E' }}
          >
            {profile?.full_name?.[0] || user.email?.[0] || '?'}
          </div>
          <span className="hidden sm:block text-xs font-medium" style={{ color: '#AAAAAA' }}>
            {profile?.full_name?.split(' ')[0] || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  )
}
