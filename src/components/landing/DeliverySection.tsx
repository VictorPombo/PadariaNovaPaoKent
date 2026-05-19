'use client'

const WHATSAPP_URL = 'https://wa.me/5511976535789?text=Olá!%20Quero%20fazer%20um%20pedido%20via%20delivery!'
const IFOOD_URL = 'https://www.ifood.com.br'

export default function DeliverySection() {
  return (
    <section
      id="delivery"
      style={{
        background: '#FAF6EF',
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
              color: '#2C1A0E',
              marginTop: '12px',
              marginBottom: '16px',
            }}
          >
            Na sua casa em minutos.
          </h2>
          <p style={{ color: '#6B3F2A', fontSize: '16px', maxWidth: '500px', margin: '0 auto', opacity: 0.7 }}>
            Entregamos com rapidez, qualidade e o carinho de sempre.
          </p>
        </div>

        {/* Comparativo delivery */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
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
                padding: '4px 10px',
                borderRadius: '999px',
              }}
            >
              ✨ RECOMENDADO
            </div>

            <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>🛵</span>
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
              {[
                '✅ Sem taxa de serviço',
                '✅ Pagamento direto',
                '✅ Atendimento personalizado',
                '✅ Mais rápido e econômico',
              ].map((item) => (
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
                  {item}
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
              📲 Pedir pelo WhatsApp
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
              💡 Peça direto e economize nas taxas
            </p>
          </div>

          {/* iFood */}
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '36px 28px',
              border: '2px solid rgba(44,26,14,0.1)',
            }}
          >
            <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>🍕</span>
            <h3
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '24px',
                fontWeight: '700',
                color: '#2C1A0E',
                marginBottom: '8px',
              }}
            >
              iFood
            </h3>
            <p style={{ color: '#EA1D2C', fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>
              Disponível no app
            </p>

            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
              {[
                '✅ Rastreamento do pedido',
                '✅ Pagamento pelo app',
                'ℹ️ Taxa de serviço do iFood',
                'ℹ️ Comissão sobre o pedido',
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    color: '#6B3F2A',
                    fontSize: '14px',
                    marginBottom: '10px',
                    opacity: item.startsWith('ℹ️') ? 0.6 : 1,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={IFOOD_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#EA1D2C',
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
                el.style.boxShadow = '0 8px 24px rgba(234,29,44,0.3)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              🍕 Pedir no iFood
            </a>
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
            { icon: '⏱️', label: 'Tempo médio', value: '30–45 min' },
            { icon: '📍', label: 'Área de entrega', value: 'Jardim Paulistano e região' },
            { icon: '🕐', label: 'Horário delivery', value: '7h às 21h' },
            { icon: '📞', label: 'Pedidos WhatsApp', value: '(11) 97653-5789' },
          ].map((info) => (
            <div key={info.label} style={{ textAlign: 'center', flex: '1', minWidth: '140px' }}>
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '6px' }}>{info.icon}</span>
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
