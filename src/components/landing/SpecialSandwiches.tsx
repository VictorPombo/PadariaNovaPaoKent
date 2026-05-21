'use client'

import { useRef, useEffect, useState } from 'react'
import { Star, ShoppingCart, Plus, Minus, Trash2, Send, X } from 'lucide-react'

const WHATSAPP_PHONE = '5511976535789'

interface CartItem { id: string; name: string; price: number; quantity: number }

function parsePrice(p: string): number {
  if (p === 'Consulte') return 0
  const m = p.match(/R\$\s*([\d.,]+)/)
  if (!m) return 0
  return parseFloat(m[1].replace('.','').replace(',','.'))
}

function fmtMsg(cart: CartItem[], address: string): string {
  const total = cart.reduce((s,i) => s + i.price * i.quantity, 0)
  let msg = '*NOVO PEDIDO - PADARIA NOVA PAOKENT*\n------------------------------------\n\n'
  cart.forEach((item, i) => { 
    msg += `Item ${i+1}: ${item.name}\nQuantidade: ${item.quantity}x\nValor: R$ ${(item.price*item.quantity).toFixed(2).replace('.',',')}\n\n` 
  })
  msg += '------------------------------------\n'
  msg += `*TOTAL A PAGAR: R$ ${total.toFixed(2).replace('.',',')}*\n\n`
  if (address.trim()) {
    msg += `*ENDERECO PARA ENTREGA:*\n${address.trim()}\n\n`
  }
  msg += 'Aguardando confirmacao. Muito obrigado!'
  return msg
}

const specialSandwiches = [
  {
    name: 'Arthur Ramos',
    ingredients: 'Presunto Parma, queijo estepe, rúcula, mostarda dijon',
    price: 'R$ 47,90',
    priceLarge: 'R$ 56,90',
    featured: true,
  },
  {
    name: 'Faria Lima',
    ingredients: 'Salame, queijo estepe, molho tártaro, alface, tomate',
    price: 'R$ 39,50',
    priceLarge: 'R$ 46,50',
    featured: false,
  },
  {
    name: 'Cidade Jardim',
    ingredients: 'Rosbife, queijo prato, catupiry, alface, tomate',
    price: 'R$ 39,50',
    priceLarge: 'R$ 46,50',
    featured: false,
  },
  {
    name: 'Iguatemi',
    ingredients: 'Mortadela com pistache, queijo prato, molho rosé',
    price: 'Consulte',
    priceLarge: 'Consulte',
    featured: false,
  },
]

export default function SpecialSandwiches() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address'>('cart')
  const [address, setAddress] = useState('')

  const addToCart = (name: string, priceStr: string) => {
    const price = parsePrice(priceStr)
    if (price === 0) return
    setCart((prev) => {
      const existing = prev.find(c => c.name === name)
      if (existing) return prev.map(c => c.name === name ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { id: name, name, price, quantity: 1 }]
    })
    setCartOpen(true)
  }
  const updateQty = (id: string, d: number) => setCart(p => p.map(c => c.id === id ? { ...c, quantity: Math.max(1, c.quantity + d) } : c))
  const removeItem = (id: string) => setCart(p => p.filter(c => c.id !== id))
  const cartTotal = cart.reduce((s,i) => s + i.price * i.quantity, 0)
  const cartCount = cart.reduce((s,i) => s + i.quantity, 0)
  
  const handleCheckout = () => {
    if (cart.length === 0) return
    setCheckoutStep('address')
  }

  const sendWpp = () => { 
    if (cart.length === 0) return
    if (!address.trim()) {
      alert('Por favor, informe o endereço de entrega.')
      return
    }
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(fmtMsg(cart, address))}`, '_blank') 
    setCartOpen(false)
    setCart([])
    setAddress('')
    setCheckoutStep('cart')
  }

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
  }, [])

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
          {specialSandwiches.map((sandwich, index) => (
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
                    <Star size={10} fill="#2C1A0E" stroke="none" /> MAIS PEDIDO
                  </span>
                )}
              </div>

              {/* Número do sanduíche */}
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

              {/* Botão Adicionar */}
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
            </div>
          ))}
        </div>

        {/* Floating Cart Sidebar */}
        {cart.length > 0 && (
          <>
            {!cartOpen && (
              <button
                onClick={() => setCartOpen(true)}
                style={{
                  position: 'fixed',
                  bottom: '160px',
                  right: '24px',
                  zIndex: 99,
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                  color: '#2C1A0E',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 30px rgba(201,168,76,0.4)',
                  transition: 'all 0.3s',
                }}
              >
                <ShoppingCart size={26} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#EF4444',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '800',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #1A0F08',
                  }}
                >
                  {cartCount}
                </span>
              </button>
            )}

            {/* Cart Sidebar Panel */}
            {cartOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '360px',
                  maxWidth: '100%',
                  zIndex: 9999,
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(26,15,8,0.98)',
                  backdropFilter: 'blur(20px)',
                  borderLeft: '1px solid rgba(201,168,76,0.25)',
                  boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
                }}
              >
                {/* Cart Header */}
                <div
                  style={{
                    padding: '24px',
                    borderBottom: '1px solid rgba(201,168,76,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ShoppingCart size={20} style={{ color: '#C9A84C' }} />
                    <span style={{ color: '#FAF6EF', fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-playfair)' }}>Seu Pedido</span>
                    <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '600', background: 'rgba(201,168,76,0.12)', padding: '4px 10px', borderRadius: '999px' }}>{cartCount} itens</span>
                  </div>
                  <button
                    onClick={() => { setCartOpen(false); setCheckoutStep('cart'); }}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'rgba(250,246,239,0.8)', padding: '8px', borderRadius: '50%' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {checkoutStep === 'cart' ? (
                  <>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 0',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: '#FAF6EF', fontSize: '15px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                            <p style={{ color: '#C9A84C', fontSize: '14px', fontWeight: '700', margin: '4px 0 0' }}>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#FAF6EF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ color: '#FAF6EF', fontSize: '15px', fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.1)', color: '#C9A84C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.08)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        padding: '24px',
                        borderTop: '1px solid rgba(201,168,76,0.15)',
                        background: 'rgba(201,168,76,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ color: 'rgba(250,246,239,0.6)', fontSize: '15px', fontWeight: '600' }}>Total do Pedido</span>
                        <span style={{ color: '#C9A84C', fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-playfair)' }}>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          background: '#25D366',
                          color: 'white',
                          fontWeight: '800',
                          fontSize: '16px',
                          padding: '18px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          boxShadow: '0 8px 25px rgba(37,211,102,0.3)',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
                      >
                        Avançar para Entrega
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
                    <h3 style={{ color: '#FAF6EF', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Endereço de Entrega</h3>
                    <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '14px', marginBottom: '20px' }}>
                      Por favor, informe seu endereço completo (Rua, Número, Bairro, Complemento).
                    </p>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ex: Rua das Flores, 123, Apto 45 - Bairro Jardim"
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '16px',
                        color: '#FAF6EF',
                        fontSize: '15px',
                        fontFamily: 'var(--font-inter)',
                        outline: 'none',
                        resize: 'none',
                        marginBottom: 'auto',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#C9A84C'
                        e.target.style.boxShadow = '0 0 10px rgba(201,168,76,0.2)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.15)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                    
                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button
                        onClick={sendWpp}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          background: '#25D366',
                          color: 'white',
                          fontWeight: '800',
                          fontSize: '16px',
                          padding: '18px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          boxShadow: '0 8px 25px rgba(37,211,102,0.3)',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
                      >
                        <Send size={18} /> Confirmar e Enviar
                      </button>
                      <button
                        onClick={() => setCheckoutStep('cart')}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          color: 'rgba(250,246,239,0.7)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          padding: '14px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#FAF6EF' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(250,246,239,0.7)' }}
                      >
                        Voltar para o Carrinho
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
