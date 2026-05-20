'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLocalhost, setIsLocalhost] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('3000'))
    ) {
      setIsLocalhost(true)
    }
  }, [])

  async function handleQuickLogin(role: 'owner' | 'manager' | 'cashier') {
    let targetEmail = ''
    let targetPassword = ''

    if (role === 'owner') {
      targetEmail = 'proprietario@novapaokent.com.br'
      targetPassword = 'PaokentOwner2026!'
    } else if (role === 'manager') {
      targetEmail = 'gerente@novapaokent.com.br'
      targetPassword = 'PaokentManager2026!'
    } else {
      targetEmail = 'caixa@novapaokent.com.br'
      targetPassword = 'PaokentCashier2026!'
    }

    setEmail(targetEmail)
    setPassword(targetPassword)
    setLoading(true)
    setError(null)

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: targetPassword,
    })

    if (loginError) {
      setError('Erro ao entrar automaticamente. Por favor execute as migrations SQL no Supabase.')
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#E8E8E8',
    outline: 'none',
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: 'var(--font-inter)',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const,
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A0F 50%, #0F0F0F 100%)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(107,63,42,0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
        <div
          style={{
            borderRadius: '20px',
            padding: '36px',
            background: 'rgba(26, 26, 26, 0.95)',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 16px',
              }}
            >
              🍞
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '24px',
                fontWeight: '700',
                color: '#FAF6EF',
                marginBottom: '4px',
              }}
            >
              Nova Paokent
            </h1>
            <p style={{ color: '#888888', fontSize: '14px' }}>
              Painel de Gestão Inteligente
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label
                htmlFor="email"
                style={{ display: 'block', color: '#AAAAAA', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#C9A84C'
                  e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{ display: 'block', color: '#AAAAAA', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#C9A84C'
                  e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                  fontSize: '13px',
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading
                  ? 'rgba(201, 168, 76, 0.5)'
                  : 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                color: '#2C1A0E',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '700',
                fontFamily: 'var(--font-inter)',
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.2s',
                marginTop: '4px',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '2px solid currentColor',
                      borderTopColor: 'transparent',
                      display: 'inline-block',
                      animation: 'spin 0.6s linear infinite',
                    }}
                  />
                  Entrando...
                </span>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: '#444444', fontSize: '12px', marginBottom: '12px' }}>
              Padaria Nova Paokent © {new Date().getFullYear()}
            </p>
            {isLocalhost ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <p style={{ color: '#C9A84C', fontSize: '10px', fontWeight: '600', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>
                  ⚡ ENTRADA RÁPIDA (LOCALHOST):
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleQuickLogin('owner')}
                    disabled={loading}
                    type="button"
                    style={{
                      background: 'rgba(201, 168, 76, 0.08)',
                      border: '1px solid rgba(201, 168, 76, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF6EF',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 168, 76, 0.2)'
                      e.currentTarget.style.borderColor = '#C9A84C'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 168, 76, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.25)'
                    }}
                  >
                    👑 Proprietário
                  </button>
                  <button
                    onClick={() => handleQuickLogin('manager')}
                    disabled={loading}
                    type="button"
                    style={{
                      background: 'rgba(201, 168, 76, 0.08)',
                      border: '1px solid rgba(201, 168, 76, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF6EF',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 168, 76, 0.2)'
                      e.currentTarget.style.borderColor = '#C9A84C'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 168, 76, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.25)'
                    }}
                  >
                    🎯 Gerente
                  </button>
                  <button
                    onClick={() => handleQuickLogin('cashier')}
                    disabled={loading}
                    type="button"
                    style={{
                      background: 'rgba(201, 168, 76, 0.08)',
                      border: '1px solid rgba(201, 168, 76, 0.25)',
                      borderRadius: '8px',
                      color: '#FAF6EF',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 168, 76, 0.2)'
                      e.currentTarget.style.borderColor = '#C9A84C'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 168, 76, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.25)'
                    }}
                  >
                    💳 Caixa
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', color: '#333333', fontSize: '11px' }}>
                <span>👑 Proprietário</span>
                <span>•</span>
                <span>🎯 Gerente</span>
                <span>•</span>
                <span>💳 Caixa</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
