'use client'

import { useEffect, useRef } from 'react'
import { Award, Bike, ChefHat, ArrowDown } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/5511976535789?text=Olá!%20Quero%20fazer%20um%20pedido!'

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animação de entrada com stagger
    const elements = [
      { el: titleRef.current, delay: 200 },
      { el: subtitleRef.current, delay: 400 },
      { el: ctaRef.current, delay: 600 },
      { el: badgesRef.current, delay: 800 },
    ]

    elements.forEach(({ el, delay }) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      setTimeout(() => {
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, delay)
    })
  }, [])

  return (
    <section
      id="inicio"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/hero-bread.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Overlay cinematográfico */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(44,26,14,0.7) 0%, rgba(44,26,14,0.55) 40%, rgba(44,26,14,0.85) 100%)',
        }}
      />

      {/* Conteúdo */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto',
          padding: '120px 24px 80px',
          textAlign: 'center',
        }}
      >
        {/* Selo "Desde 1994" */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '999px',
            padding: '6px 16px',
            marginBottom: '24px',
          }}
        >
          <span style={{ color: '#C9A84C', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em' }}>
            ✦ DESDE 1994 ✦ JARDIM PAULISTANO, SÃO PAULO
          </span>
        </div>

        {/* Título principal */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '700',
            color: '#FAF6EF',
            lineHeight: '1.15',
            marginBottom: '20px',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}
        >
          30 anos servindo
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #E2C06E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            tradição, sabor
          </span>
          <br />e experiência.
        </h1>

        {/* Subtítulo */}
        <p
          ref={subtitleRef}
          style={{
            color: 'rgba(250,246,239,0.8)',
            fontSize: 'clamp(16px, 2vw, 20px)',
            marginBottom: '40px',
            lineHeight: '1.6',
          }}
        >
          Padaria, cafeteria e restaurante em um só lugar.
          <br />
          <strong style={{ color: '#C9A84C' }}>Jardim Paulistano, São Paulo.</strong>
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '48px',
          }}
        >
          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="hero-whatsapp-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#25D366',
              color: 'white',
              fontWeight: '700',
              fontSize: '16px',
              padding: '14px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 12px 32px rgba(37,211,102,0.4)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 4px 20px rgba(37,211,102,0.3)'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            (11) 97653-5789
          </a>


          {/* Ver Cardápio */}
          <a
            href="#cardapio"
            id="hero-menu-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(250,246,239,0.1)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#FAF6EF',
              fontWeight: '600',
              fontSize: '16px',
              padding: '14px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(201,168,76,0.15)'
              el.style.borderColor = '#C9A84C'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(250,246,239,0.1)'
              el.style.borderColor = 'rgba(201,168,76,0.4)'
            }}
          >
            Ver Cardápio <ArrowDown size={16} />
          </a>
        </div>

        {/* Badges e social proof */}
        <div
          ref={badgesRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Google Rating */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              padding: '8px 14px',
            }}
          >
            <span style={{ color: '#FFB800', fontSize: '16px' }}>★★★★★</span>
            <span style={{ color: '#FAF6EF', fontSize: '13px', fontWeight: '600' }}>
              5.0 Google
            </span>
          </div>

          {/* Desde 1994 badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '10px',
              padding: '8px 14px',
            }}
          >
            <Award size={16} color="#C9A84C" style={{ display: 'block' }} />
            <span style={{ color: '#C9A84C', fontSize: '13px', fontWeight: '600' }}>
              Desde 1994
            </span>
          </div>

          {/* Entrega Rápida */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              padding: '8px 14px',
            }}
          >
            <Bike size={16} color="#FAF6EF" style={{ display: 'block' }} />
            <span style={{ color: '#FAF6EF', fontSize: '13px', fontWeight: '600' }}>
              Entrega Rápida
            </span>
          </div>

          {/* Produção Própria */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              padding: '8px 14px',
            }}
          >
            <ChefHat size={16} color="#FAF6EF" style={{ display: 'block' }} />
            <span style={{ color: '#FAF6EF', fontSize: '13px', fontWeight: '600' }}>
              Produção Própria
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          animation: 'bounce 2s infinite',
        }}
      >
        <span style={{ color: 'rgba(250,246,239,0.4)', fontSize: '12px', letterSpacing: '0.1em' }}>
          EXPLORAR
        </span>
        <ArrowDown size={20} color="rgba(250,246,239,0.4)" style={{ display: 'block' }} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  )
}
