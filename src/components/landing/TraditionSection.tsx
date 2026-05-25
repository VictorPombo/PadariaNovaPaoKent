'use client'

import { useEffect, useRef, useState } from 'react'
import { Trophy, Users, ClipboardList, Star } from 'lucide-react'

const timelineEvents = [
  { year: '1993', title: 'A história começa', desc: 'A partir do dia 1 de agosto de 1993, a família abre as portas da Padaria Nova Pão Kent no Jardim Paulistano.' },
  { year: '2000', title: 'Expansão do cardápio', desc: 'Novos produtos artesanais e a criação dos lanches com nome de rua.' },
  { year: '2010', title: '17 anos de tradição', desc: 'Reconhecida como referência em qualidade e atendimento no bairro.' },
  { year: '2020', title: 'Delivery próprio', desc: 'Entrega rápida para o Jardim Paulistano e regiões próximas.' },
  { year: '2025', title: 'Mais de 30 anos!', desc: 'Mais de três décadas servindo o melhor café, pão e lanche de São Paulo.' },
]

const stats = [
  { value: 30, suffix: '+', label: 'Anos de Tradição', icon: Trophy },
  { value: 50, suffix: 'k+', label: 'Clientes Atendidos', icon: Users },
  { value: 100, suffix: '+', label: 'Itens no Cardápio', icon: ClipboardList },
  { value: 5, suffix: '★', label: 'Avaliação Google', icon: Star },
]

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const start = Date.now()
          const step = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export default function TraditionSection() {
  return (
    <section
      id="tradicao"
      style={{
        background: '#1A0F08',
        padding: '96px 24px',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <span
            style={{
              color: '#C9A84C',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Nossa História
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
            Mais que uma padaria.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Uma tradição.
            </span>
          </h2>
          <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Mais de 30 anos de história, receitas tradicionais e o carinho de uma família
            que ama o que faz.
          </p>
        </div>

        {/* Layout: foto + timeline */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px',
            alignItems: 'center',
            marginBottom: '80px',
          }}
        >
          {/* Foto da padaria */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                paddingBottom: '120%',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundImage: 'url(/bakery-facade.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 40px 80px rgba(44,26,14,0.2)',
              }}
            />
            {/* Badge overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(201,168,76,0.4)',
              }}
            >
              <span style={{ fontSize: '11px', color: '#2C1A0E', fontWeight: '700', textAlign: 'center', lineHeight: '1.2' }}>
                Desde<br />1993
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Linha vertical */}
            <div
              style={{
                position: 'absolute',
                left: '20px',
                top: 0,
                bottom: 0,
                width: '2px',
                background: 'linear-gradient(180deg, #C9A84C, transparent)',
              }}
            />

            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                style={{
                  display: 'flex',
                  gap: '24px',
                  marginBottom: index < timelineEvents.length - 1 ? '32px' : '0',
                  paddingLeft: '8px',
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: index === timelineEvents.length - 1
                      ? 'linear-gradient(135deg, #9E7A2E, #C9A84C)'
                      : 'rgba(201,168,76,0.3)',
                    border: '2px solid #C9A84C',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                />

                <div>
                  <span
                    style={{
                      color: '#C9A84C',
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {event.year}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#FAF6EF',
                      marginTop: '2px',
                      marginBottom: '4px',
                    }}
                  >
                    {event.title}
                  </h3>
                  <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '14px', lineHeight: '1.6' }}>
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats animados */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#2C1A0E',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: '#C9A84C',
                }}
              >
                <stat.icon size={36} strokeWidth={1.5} />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '40px',
                  fontWeight: '700',
                  color: '#C9A84C',
                  margin: '0 0 4px',
                  lineHeight: '1',
                }}
              >
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </p>
              <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '14px', margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
