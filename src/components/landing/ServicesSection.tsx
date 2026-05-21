'use client'

import { ArrowRight } from 'lucide-react'

const services = [
  {
    title: 'Padaria',
    image: '/padaria-breads.png',
    description:
      'Nossos pães artesanais são assados diariamente para garantir frescor e sabor. Escolha entre uma variedade de opções, incluindo clássicos, como pão francês, baguetes, ciabatas e etc.',
  },
  {
    title: 'Festas',
    image: '/festas-sandwiches.png',
    description:
      'Surpreenda seus convidados com nossos sanduíches de qualidade para festas. De mini sanduíches a sanduíches de metro, temos opções deliciosas para todas as ocasiões.',
  },
  {
    title: 'Salgados e Doces',
    image: '/doces-sobremesas.png',
    description:
      'De bolos a doces caseiros, nossa seleção de sobremesas artesanais irá satisfazer seus desejos mais doces. Experimente uma variedade de sabores e deixe-se levar pelo prazer dos doces.',
  },
]

const WHATSAPP_URL = 'https://wa.me/5511976535789?text=Olá!%20Quero%20saber%20mais%20sobre%20'

export default function ServicesSection() {
  return (
    <section
      style={{
        background: '#1A0F08',
        padding: '96px 24px',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span
            style={{
              color: '#C9A84C',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Nossos Serviços
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: '700',
              color: '#FAF6EF',
              marginTop: '12px',
              marginBottom: '16px',
            }}
          >
            O que preparamos para você
          </h2>
          <p
            style={{
              color: 'rgba(250,246,239,0.5)',
              fontSize: '16px',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            Da padaria artesanal aos eventos especiais, temos tudo que você precisa.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {services.map((service) => (
            <div
              key={service.title}
              style={{
                background: 'rgba(44,26,14,0.6)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(201,168,76,0.4)'
                el.style.transform = 'translateY(-6px)'
                el.style.boxShadow = '0 24px 48px rgba(0,0,0,0.4), 0 0 24px rgba(201,168,76,0.08)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(201,168,76,0.15)'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: '100%',
                  height: '240px',
                  backgroundImage: `url(${service.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    background: 'linear-gradient(to bottom, transparent, rgba(44,26,14,0.9))',
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#FAF6EF',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    color: 'rgba(250,246,239,0.6)',
                    fontSize: '14px',
                    lineHeight: '1.7',
                    flex: 1,
                    marginBottom: '24px',
                  }}
                >
                  {service.description}
                </p>

                <a
                  href={`${WHATSAPP_URL}${encodeURIComponent(service.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                    color: '#1A0F08',
                    fontWeight: '700',
                    fontSize: '13px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    alignSelf: 'flex-start',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Saiba Mais <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
