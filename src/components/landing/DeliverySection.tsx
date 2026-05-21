'use client'

import { Sparkles, Bike, Check, Phone, Clock, MapPin, Calendar } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/5511976535789?text=Olá!%20Quero%20fazer%20um%20pedido%20via%20delivery!'

const OWN_DELIVERY_ITEMS = [
  'Sem taxa de serviço',
  'Pagamento direto',
  'Atendimento personalizado',
  'Mais rápido e econômico',
]

export default function DeliverySection() {
  return (
    <section
      id="delivery"
      style={{
        background: '#1A0F08',
        padding: '96px 24px',
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
            Delivery
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
            Na sua casa em minutos.
          </h2>
          <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Entregamos com rapidez, qualidade e o carinho de sempre.
          </p>
        </div>

        {/* Comparativo delivery */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '48px',
          }}
        >
          {/* Delivery Próprio */}
          <div
            style={{
              background: '#2C1A0E',
              borderRadius: '20px',
              padding: '36px 28px',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid #C9A84C',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                color: '#2C1A0E',
                fontSize: '10px',
                fontWeight: '800',
                padding: '6px 12px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={10} /> RECOMENDADO
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Bike size={40} color="#C9A84C" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '24px',
                fontWeight: '700',
                color: '#FAF6EF',
                marginBottom: '8px',
              }}
            >
              Delivery Próprio
            </h3>
            <p style={{ color: '#C9A84C', fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>
              Direto pelo WhatsApp
            </p>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
              {OWN_DELIVERY_ITEMS.map((item) => (
                <li
                  key={item}
                  style={{
                    color: 'rgba(250,246,239,0.7)',
                    fontSize: '14px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Check size={16} color="#C9A84C" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#25D366',
                color: 'white',
                fontWeight: '700',
                fontSize: '15px',
                padding: '14px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 8px 24px rgba(37,211,102,0.4)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Pedir pelo WhatsApp</span>
            </a>

            <p
              style={{
                textAlign: 'center',
                marginTop: '12px',
                color: '#C9A84C',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              Peça direto e economize nas taxas
            </p>
          </div>
        </div>

        {/* Tempo de entrega e área */}
        <div
          style={{
            background: '#2C1A0E',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {[
            { icon: <Clock size={28} color="#C9A84C" />, label: 'Tempo médio', value: '30–45 min' },
            { icon: <MapPin size={28} color="#C9A84C" />, label: 'Área de entrega', value: 'Jardim Paulistano e região' },
            { icon: <Calendar size={28} color="#C9A84C" />, label: 'Horário delivery', value: '7h às 21h' },
            { icon: <Phone size={28} color="#C9A84C" />, label: 'Pedidos WhatsApp', value: '(11) 97653-5789' },
          ].map((info, idx) => (
            <div key={idx} style={{ textAlign: 'center', flex: '1', minWidth: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '8px' }}>{info.icon}</div>
              <p style={{ color: 'rgba(250,246,239,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                {info.label}
              </p>
              <p style={{ color: '#FAF6EF', fontSize: '15px', fontWeight: '600' }}>
                {info.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
