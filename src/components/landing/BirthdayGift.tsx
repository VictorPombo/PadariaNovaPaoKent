'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Gift, CheckCircle } from 'lucide-react'

export default function BirthdayGift() {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !whatsapp || !day || !month) return

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('birthdays').insert([
      {
        full_name: name,
        whatsapp: whatsapp.replace(/\D/g, ''),
        birth_day: parseInt(day, 10),
        birth_month: parseInt(month, 10)
      }
    ])

    setLoading(false)
    if (!error) {
      setSuccess(true)
      setName('')
      setWhatsapp('')
      setDay('')
      setMonth('')
      setTimeout(() => setSuccess(false), 5000)
    } else {
      alert('Houve um erro ao cadastrar. Tente novamente.')
    }
  }

  return (
    <section style={{ padding: '64px 24px', background: '#1A0F08' }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(26,15,8,0.9))',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '24px',
        padding: '48px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorativo */}
        <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: '#C9A84C', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, background: '#C9A84C', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', color: '#C9A84C', marginBottom: '24px' }}>
          <Gift size={32} />
        </div>

        <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', fontWeight: '700', color: '#FAF6EF', marginBottom: '16px' }}>
          Presente de Aniversário 🎂
        </h2>
        <p style={{ color: 'rgba(250,246,239,0.7)', fontSize: '16px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Cadastre seu aniversário e ganhe uma surpresa especial da Nova Paokent no seu dia!
        </p>

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.5s ease-out' }}>
            <CheckCircle size={48} color="#10B981" />
            <p style={{ color: '#10B981', fontWeight: '600', fontSize: '18px' }}>Cadastro realizado com sucesso!</p>
            <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '14px' }}>Fique de olho no seu WhatsApp perto do seu aniversário.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAF6EF', fontSize: '15px', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            
            <input
              type="tel"
              placeholder="WhatsApp (com DDD)"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAF6EF', fontSize: '15px', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />

            <div style={{ display: 'flex', gap: '16px' }}>
              <input
                type="number"
                placeholder="Dia (DD)"
                min="1"
                max="31"
                value={day}
                onChange={e => setDay(e.target.value)}
                required
                style={{ width: '50%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAF6EF', fontSize: '15px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <input
                type="number"
                placeholder="Mês (MM)"
                min="1"
                max="12"
                value={month}
                onChange={e => setMonth(e.target.value)}
                required
                style={{ width: '50%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAF6EF', fontSize: '15px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                color: '#1A0F08',
                fontWeight: '800',
                fontSize: '15px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '8px',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => { if(!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { if(!loading) e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {loading ? 'Cadastrando...' : 'Garantir meu presente'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
