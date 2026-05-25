'use client'

import { Package, MessageCircle, Clock, Info, Cake, Sandwich } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/5511976535789?text=Olá!%20Gostaria%20de%20fazer%20uma%20encomenda!'
const WHATSAPP_CONFEITARIA_URL = 'https://wa.me/5511976535789?text=Olá!%20Gostaria%20de%20verificar%20a%20disponibilidade%20de%20itens%20de%20confeitaria%20para%20encomenda.'

interface OrderCategory {
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>
  items: string[]
  note?: string
  isWhatsAppOnly?: boolean
}

const orderCategories: OrderCategory[] = [
  {
    title: 'Mini Lanches',
    description: 'Perfeitos para festas, reuniões e eventos.',
    icon: Sandwich,
    items: [
      'Mini sanduíches variados',
      'Mini croissants recheados',
      'Mini pães de metro',
    ],
    note: 'A partir de 1kg (~20 unidades). Acima de 4kg, tempo mínimo de 3h para preparo.',
  },
  {
    title: 'Pão de Metrô',
    description: 'O clássico pão de metrô para sua festa ou evento.',
    icon: Package,
    items: [
      'Pão de metrô tradicional',
      'Recheios variados',
      'Tamanhos personalizados',
    ],
  },
  {
    title: 'Confeitaria',
    description: 'Tortas, bolos e doces sob consulta.',
    icon: Cake,
    items: [
      'Tortas',
      'Bolos',
      'Mini tortas',
      'Mini muffins',
    ],
    note: 'Verifique disponibilidade diretamente com a loja.',
    isWhatsAppOnly: true,
  },
]

export default function OrdersSection() {
  return (
    <section
      id="encomendas"
      style={{
        background: '#2C1A0E',
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
            Encomendas
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: '700',
              color: '#FAF6EF',
              marginTop: '12px',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}
          >
            Faça sua{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E2C06E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              encomenda.
            </span>
          </h2>
          <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '16px', maxWidth: '560px', margin: '0 auto' }}>
            Mini lanches, pão de metrô, confeitaria e muito mais. Ideal para festas, reuniões e eventos especiais.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {orderCategories.map((category) => {
            const IconComponent = category.icon
            const targetUrl = category.isWhatsAppOnly ? WHATSAPP_CONFEITARIA_URL : WHATSAPP_URL

            return (
              <div
                key={category.title}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: category.isWhatsAppOnly
                    ? '1px solid rgba(37,211,102,0.25)'
                    : '1px solid rgba(201,168,76,0.15)',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(-6px)'
                  el.style.boxShadow = '0 24px 48px rgba(0,0,0,0.4), 0 0 24px rgba(201,168,76,0.08)'
                  el.style.borderColor = category.isWhatsAppOnly ? 'rgba(37,211,102,0.5)' : 'rgba(201,168,76,0.4)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                  el.style.borderColor = category.isWhatsAppOnly ? 'rgba(37,211,102,0.25)' : 'rgba(201,168,76,0.15)'
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: category.isWhatsAppOnly
                      ? 'rgba(37,211,102,0.1)'
                      : 'rgba(201,168,76,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <IconComponent
                    size={28}
                    color={category.isWhatsAppOnly ? '#25D366' : '#C9A84C'}
                    style={{ display: 'block' }}
                  />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#FAF6EF',
                    marginBottom: '8px',
                  }}
                >
                  {category.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: 'rgba(250,246,239,0.5)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                  }}
                >
                  {category.description}
                </p>

                {/* Items */}
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px', flex: 1 }}>
                  {category.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        color: 'rgba(250,246,239,0.7)',
                        fontSize: '14px',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: '#C9A84C', fontSize: '8px' }}>●</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Note */}
                {category.note && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '12px 14px',
                      background: category.isWhatsAppOnly
                        ? 'rgba(37,211,102,0.06)'
                        : 'rgba(201,168,76,0.06)',
                      border: `1px solid ${category.isWhatsAppOnly ? 'rgba(37,211,102,0.15)' : 'rgba(201,168,76,0.12)'}`,
                      borderRadius: '10px',
                      marginBottom: '20px',
                    }}
                  >
                    {category.isWhatsAppOnly ? (
                      <MessageCircle size={14} color="#25D366" style={{ flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <Info size={14} color="#C9A84C" style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <p
                      style={{
                        color: category.isWhatsAppOnly ? '#25D366' : '#C9A84C',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        margin: 0,
                        fontWeight: '500',
                      }}
                    >
                      {category.note}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <a
                  href="/encomendas"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: category.isWhatsAppOnly
                      ? '#25D366'
                      : 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                    color: category.isWhatsAppOnly ? 'white' : '#2C1A0E',
                    fontWeight: '700',
                    fontSize: '14px',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = category.isWhatsAppOnly
                      ? '0 8px 24px rgba(37,211,102,0.4)'
                      : '0 8px 24px rgba(201,168,76,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {category.isWhatsAppOnly ? (
                    <>
                      <MessageCircle size={16} />
                      Ver Opções de Doces
                    </>
                  ) : (
                    <>
                      <MessageCircle size={16} />
                      Ver Menu Completo
                    </>
                  )}
                </a>
              </div>
            )
          })}
        </div>

        {/* Info bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#C9A84C" />
            <span style={{ color: 'rgba(250,246,239,0.7)', fontSize: '14px' }}>
              <strong style={{ color: '#C9A84C' }}>Acima de 4kg:</strong> tempo mínimo de 3h
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="#C9A84C" />
            <span style={{ color: 'rgba(250,246,239,0.7)', fontSize: '14px' }}>
              <strong style={{ color: '#C9A84C' }}>Mini lanches:</strong> a partir de 1kg (~20 un.)
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageCircle size={18} color="#25D366" />
            <span style={{ color: 'rgba(250,246,239,0.7)', fontSize: '14px' }}>
              <strong style={{ color: '#25D366' }}>Confeitaria:</strong> consulte disponibilidade
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
