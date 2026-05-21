'use client'

import { useRef, useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Star, ShoppingCart, Plus, Flame } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const WHATSAPP_PHONE = '5511976535789'

function parsePrice(p: string): number {
  if (p === 'Consulte') return 0
  const m = p.match(/R\$\s*([\d.,]+)/)
  if (!m) return 0
  return parseFloat(m[1].replace('.','').replace(',','.'))
}

const baseSpecialSandwiches = [
  {
    name: 'Arthur Ramos',
    ingredients: 'Presunto Parma, queijo estepe, rúcula, mostarda dijon',
    price: 'R$ 47,90',
    priceLarge: 'R$ 56,90',
  },
  {
    name: 'Faria Lima',
    ingredients: 'Salame, queijo estepe, molho tártaro, alface, tomate',
    price: 'R$ 39,50',
    priceLarge: 'R$ 46,50',
  },
  {
    name: 'Cidade Jardim',
    ingredients: 'Rosbife, queijo prato, catupiry, alface, tomate',
    price: 'R$ 39,50',
    priceLarge: 'R$ 46,50',
  },
  {
    name: 'Iguatemi',
    ingredients: 'Mortadela com pistache, queijo prato, molho rosé',
    price: 'Consulte',
    priceLarge: 'Consulte',
  },
]

export default function SpecialSandwiches() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { cart, cartOpen, addToCart: addGlobalCart } = useCart()
  const [highlight, setHighlight] = useState<{ sandwich_name: string; fake_counter: number } | null>(null)

  useEffect(() => {
    async function fetchHighlight() {
      const supabase = createClient()
      const { data } = await supabase
        .from('weekly_highlight')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data) setHighlight(data)
    }
    fetchHighlight()
  }, [])

  const addToCart = (name: string, priceStr: string) => {
    const price = parsePrice(priceStr)
    if (price === 0) return
    addGlobalCart({ id: name, name, price })
  }

  const handleWhatsAppFeatured = (name: string) => {
    const msg = `Quero o ${name}, o mais pedido da semana!`
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const sortedSandwiches = [...baseSpecialSandwiches].map(s => ({
    ...s,
    featured: highlight?.sandwich_name === s.name
  })).sort((a, b) => {
    if (a.featured) return -1
    if (b.featured) return 1
    return 0
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.sandwich-card')
            cards.forEach((card, i) => {
              setTimeout(() => {
                ;(card as HTMLElement).style.opacity = '1'
                ;(card as HTMLElement).style.transform = 'translateY(0)'
              }, i * 100)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [sortedSandwiches]) // re-run observer when sorting changes

  return (
    <section
      id="especiais"
      ref={sectionRef}
      style={{
        background: '#2C1A0E',
        padding: '96px 24px',
      }}
    >
      <style>{`
        @media (min-width: 1024px) {
          .sandwiches-container-cart-open {
            padding-right: 380px !important;
          }
        }
      `}</style>
      <div 
        className={cartOpen ? 'sandwiches-container-cart-open' : ''} 
        style={{ maxWidth: '1280px', margin: '0 auto', transition: 'padding 0.3s ease' }}
      >
        {/* Header da seção */}
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
            Identidade Local
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
            Sanduíches que têm o nome
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E2C06E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              do seu bairro.
            </span>
          </h2>
          <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '16px', maxWidth: '560px', margin: '0 auto' }}>
            Cada sanduíche homenageia uma rua do Jardim Paulistano. Porque aqui,
            a tradição tem endereço.
          </p>
        </div>

        {/* Grid de sanduíches */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {sortedSandwiches.map((sandwich, index) => (
            <div
              key={sandwich.name}
              className="sandwich-card"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'all 0.5s ease',
                background: sandwich.featured
                  ? 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(26,16,8,1))'
                  : 'rgba(255,255,255,0.04)',
                border: sandwich.featured
                  ? '1px solid rgba(201,168,76,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Imagem do sanduíche */}
              <div
                style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  background: 'rgba(255,255,255,0.05)',
                  backgroundImage: 'url(/sandwich-premium.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {sandwich.featured && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                      color: '#2C1A0E',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      letterSpacing: '0.08em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Flame size={12} fill="#2C1A0E" stroke="none" /> MAIS PEDIDO
                  </span>
                )}
              </div>

              {/* Número do sanduíche e Contador Fake se destaque */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#C9A84C',
                    fontWeight: '600',
                    letterSpacing: '0.1em',
                  }}
                >
                  Nº {String(index + 1).padStart(2, '0')}
                </span>
                {sandwich.featured && highlight && (
                  <span style={{ fontSize: '10px', color: '#EA580C', fontWeight: 'bold' }}>
                    🔥 {highlight.fake_counter} pedidos essa semana
                  </span>
                )}
              </div>

              {/* Nome */}
              <h3
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#FAF6EF',
                  marginTop: '4px',
                  marginBottom: '8px',
                }}
              >
                {sandwich.name}
              </h3>

              {/* Ingredientes */}
              <p
                style={{
                  color: 'rgba(250,246,239,0.5)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  minHeight: '44px',
                }}
              >
                {sandwich.ingredients}
              </p>

              {/* Preços */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <p style={{ color: '#888888', fontSize: '11px', marginBottom: '2px' }}>
                    Pão francês
                  </p>
                  <p
                    style={{
                      color: '#C9A84C',
                      fontSize: '22px',
                      fontWeight: '700',
                      fontFamily: 'var(--font-playfair)',
                    }}
                  >
                    {sandwich.price}
                  </p>
                </div>
                {sandwich.priceLarge !== sandwich.price && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#888888', fontSize: '11px', marginBottom: '2px' }}>
                      Baguete/ciabatta
                    </p>
                    <p style={{ color: 'rgba(201,168,76,0.7)', fontSize: '18px', fontWeight: '600' }}>
                      {sandwich.priceLarge}
                    </p>
                  </div>
                )}
              </div>

              {/* Botão Adicionar / Pedir */}
              {sandwich.featured ? (
                <button
                  onClick={() => handleWhatsAppFeatured(sandwich.name)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '13px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    boxShadow: '0 4px 15px rgba(37,211,102,0.3)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <Flame size={14} /> Quero esse destaque!
                </button>
              ) : (
                <button
                  onClick={() => addToCart(sandwich.name + ' (Pão Francês)', sandwich.price)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: cart.find(c => c.name.startsWith(sandwich.name))
                      ? 'rgba(16,185,129,0.15)'
                      : 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                    color: cart.find(c => c.name.startsWith(sandwich.name)) ? '#10B981' : '#2C1A0E',
                    fontWeight: '700',
                    fontSize: '13px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: cart.find(c => c.name.startsWith(sandwich.name))
                      ? '1px solid rgba(16,185,129,0.3)'
                      : 'none',
                    cursor: sandwich.price === 'Consulte' ? 'not-allowed' : 'pointer',
                    opacity: sandwich.price === 'Consulte' ? 0.5 : 1,
                    transition: 'all 0.2s',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                  disabled={sandwich.price === 'Consulte'}
                >
                  {cart.find(c => c.name.startsWith(sandwich.name)) ? (
                    <><ShoppingCart size={14} /> No Carrinho</>
                  ) : (
                    <><Plus size={14} /> Adicionar ao Pedido</>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}
