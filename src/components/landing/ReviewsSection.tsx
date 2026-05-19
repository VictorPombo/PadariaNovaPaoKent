'use client'

const reviews = [
  {
    name: 'Júlio César',
    rating: 5,
    comment: 'Muito gostoso. O café é saboroso e o pão não chapa.',
    source: 'Google',
    avatar: '☕',
  },
  {
    name: 'Vera Santos',
    rating: 5,
    comment: 'Sou cliente há mais de 40 anos. Qualidade sempre impecável!',
    source: 'Google',
    avatar: '👵',
  },
  {
    name: 'Arthur Rebelo',
    rating: 5,
    comment: 'A melhor broa de milho de todas!',
    source: 'Google',
    avatar: '🍞',
  },
  {
    name: 'Marina Costa',
    rating: 5,
    comment: 'Ambiente acolhedor, atendimento excelente. Venho toda semana!',
    source: 'Google',
    avatar: '🌸',
  },
  {
    name: 'Roberto Alves',
    rating: 5,
    comment: 'O lanche Arthur Ramos é incrível. Vale cada centavo!',
    source: 'Google',
    avatar: '🥖',
  },
  {
    name: 'Fernanda Lima',
    rating: 5,
    comment: 'Cafeteria premium no coração do Jardim Paulistano. Recomendo!',
    source: 'Google',
    avatar: '⭐',
  },
]

export default function ReviewsSection() {
  return (
    <section
      style={{
        background: '#2C1A0E',
        padding: '96px 24px',
        overflow: 'hidden',
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
            Avaliações
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
            O que nossos clientes
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E2C06E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              dizem sobre nós.
            </span>
          </h2>

          {/* Rating geral */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '12px',
              padding: '12px 24px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '40px',
                fontWeight: '700',
                color: '#C9A84C',
                lineHeight: '1',
              }}
            >
              5.0
            </span>
            <div>
              <div style={{ color: '#FFB800', fontSize: '20px', lineHeight: '1' }}>★★★★★</div>
              <p style={{ color: 'rgba(250,246,239,0.5)', fontSize: '12px', marginTop: '4px' }}>
                Avaliação Google
              </p>
            </div>
          </div>
        </div>

        {/* Grid de avaliações */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background = 'rgba(201,168,76,0.08)'
                el.style.borderColor = 'rgba(201,168,76,0.3)'
                el.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.background = 'rgba(255,255,255,0.04)'
                el.style.borderColor = 'rgba(201,168,76,0.12)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                  }}
                >
                  {review.avatar}
                </div>
                <div>
                  <p style={{ color: '#FAF6EF', fontWeight: '600', fontSize: '15px' }}>{review.name}</p>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} style={{ color: '#FFB800', fontSize: '12px' }}>★</span>
                    ))}
                  </div>
                </div>
                <span
                  style={{
                    marginLeft: 'auto',
                    background: 'rgba(66,133,244,0.15)',
                    color: '#4285F4',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {review.source}
                </span>
              </div>
              <p
                style={{
                  color: 'rgba(250,246,239,0.6)',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
