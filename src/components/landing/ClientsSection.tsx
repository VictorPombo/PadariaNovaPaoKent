'use client'

import Image from 'next/image'

const clients = [
  { name: 'Cliente 1', logo: '/images/reais/logo-cliente-01.png' },
  { name: 'Cliente 2', logo: '/images/reais/logo-cliente-02.png' },
  { name: 'Cliente 3', logo: '/images/reais/logo-cliente-03.png' },
  { name: 'Cliente 4', logo: '/images/reais/logo-cliente-04.png' },
  { name: 'Cliente 5', logo: '/images/reais/logo-cliente-05.png' },
  { name: 'Cliente 6', logo: '/images/reais/logo-cliente-06.png' },
  { name: 'Cliente 7', logo: '/images/reais/logo-cliente-07.png' },
  { name: 'Cliente 8', logo: '/images/reais/logo-cliente-08.png' },
  { name: 'Cliente 9', logo: '/images/reais/logo-cliente-09.png' },
]

const nameStyles: Record<string, React.CSSProperties> = {
  italic: {
    fontFamily: 'var(--font-playfair)',
    fontStyle: 'italic',
    fontSize: '22px',
    fontWeight: '700',
    color: '#FAF6EF',
  },
  bold: {
    fontFamily: 'var(--font-inter)',
    fontSize: '18px',
    fontWeight: '900',
    color: '#FAF6EF',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  },
  serif: {
    fontFamily: 'var(--font-playfair)',
    fontSize: '22px',
    fontWeight: '700',
    color: '#FAF6EF',
  },
  spaced: {
    fontFamily: 'var(--font-playfair)',
    fontSize: '20px',
    fontWeight: '700',
    color: '#FAF6EF',
    letterSpacing: '0.12em',
  },
}

export default function ClientsSection() {
  return (
    <section
      style={{
        background: '#2C1A0E',
        padding: '80px 24px',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              color: '#C9A84C',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Parceiros
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: '700',
              color: '#FAF6EF',
              marginTop: '12px',
              marginBottom: '16px',
            }}
          >
            Nossos Clientes
          </h2>
          <p
            style={{
              color: 'rgba(250,246,239,0.5)',
              fontSize: '16px',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            Atendemos com orgulho os melhores hotéis, bares e restaurantes de São Paulo.
          </p>
        </div>

        {/* Row 1 — 5 logos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '14px',
            marginBottom: '14px',
          }}
        >
          {clients.slice(0, 5).map((client) => (
            <div
              key={client.name}
              style={{
                background: 'rgba(250,246,239,0.04)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '16px',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                cursor: 'default',
                minHeight: '90px',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(201,168,76,0.35)'
                el.style.background = 'rgba(201,168,76,0.06)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(201,168,76,0.12)'
                el.style.background = 'rgba(250,246,239,0.04)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '60px' }}>
                <Image src={client.logo} alt={client.name} fill style={{ objectFit: 'contain' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 — 4 logos, centered */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px',
            maxWidth: '880px',
            margin: '0 auto',
          }}
        >
          {clients.slice(5, 9).map((client) => (
            <div
              key={client.name}
              style={{
                background: 'rgba(250,246,239,0.04)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '16px',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                cursor: 'default',
                minHeight: '90px',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(201,168,76,0.35)'
                el.style.background = 'rgba(201,168,76,0.06)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(201,168,76,0.12)'
                el.style.background = 'rgba(250,246,239,0.04)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '60px' }}>
                <Image src={client.logo} alt={client.name} fill style={{ objectFit: 'contain' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
