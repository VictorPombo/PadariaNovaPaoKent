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
    <header className="flex items-center justify-between gap-3 px-3 sm:px-6 py-3 sm:py-0 sm:h-[64px] flex-shrink-0 bg-[#1A0F08]/95 backdrop-blur-md border-b border-[#C9A84C]/10 z-30 w-full min-w-0">
      {/* Esquerda: Saudação e Data */}
      <div className="pl-12 lg:pl-0 flex flex-col justify-center min-w-0">
        <h1 className="text-[14px] sm:text-[15px] font-bold text-[#FAF6EF] tracking-wide leading-tight truncate">
          {greeting}, <span className="text-[#C9A84C]">{firstName}</span>
        </h1>
        <p className="text-[10px] text-neutral-500 font-medium capitalize leading-tight mt-0.5 truncate">
          {currentDateStr} • {turno}
        </p>
      </div>

      {/* Direita: Botões */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Link
          href="/admin/ai-assistant"
          className="btn-premium-ghost px-3 sm:px-4 py-1.5 text-xs transition-all"
        >
          <Brain size={14} className="text-[#C9A84C]" />
          <span className="hidden sm:inline">Perguntar à IA</span>
        </Link>
        <Link
          href="/admin/orders"
          className="btn-premium-gold px-3 sm:px-4 py-1.5 text-xs transition-all"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Novo Pedido</span>
        </Link>
      </div>
    </header>
  )
}
