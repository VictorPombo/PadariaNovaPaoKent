'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import { Plus, Brain } from 'lucide-react'

interface AdminTopbarProps {
  user: User
  profile: Profile | null
}

export default function AdminTopbar({ user, profile }: AdminTopbarProps) {
  const [greeting, setGreeting] = useState('Olá')
  const [currentDateStr, setCurrentDateStr] = useState('')
  const [turno, setTurno] = useState('Turno 1')

  useEffect(() => {
    // Generate localized greeting
    const hr = new Date().getHours()
    if (hr < 12) setGreeting('Bom dia')
    else if (hr < 18) setGreeting('Boa tarde')
    else setGreeting('Boa noite')

    // Localized date
    setCurrentDateStr(
      new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    )
    
    setTurno(hr >= 6 && hr < 14 ? 'Turno 1' : 'Turno 2')
  }, [])

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || 'Usuário'

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 h-[64px] flex-shrink-0 bg-black/10 backdrop-blur-md border-b border-[#C9A84C]/5 z-30">
      {/* Esquerda: Saudação e Data */}
      <div className="pl-12 lg:pl-0 flex flex-col justify-center h-full"> {/* padding left on mobile so it doesn't overlap the menu button */}
        <h1 className="text-[15px] font-bold text-[#FAF6EF] tracking-wide leading-tight">
          {greeting}, <span className="text-[#C9A84C]">{firstName}</span>
        </h1>
        <p className="text-[10px] text-neutral-500 font-medium capitalize leading-tight mt-0.5">
          {currentDateStr} • {turno}
        </p>
      </div>

      {/* Direita: Botões */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/ai-assistant"
          className="btn-premium-ghost px-4 py-1.5 text-xs transition-all"
        >
          <Brain size={14} className="text-[#C9A84C]" />
          <span>Perguntar à IA</span>
        </Link>
        <Link
          href="/admin/orders"
          className="btn-premium-gold px-4 py-1.5 text-xs transition-all"
        >
          <Plus size={14} />
          <span>Novo Pedido</span>
        </Link>
      </div>
    </header>
  )
}
