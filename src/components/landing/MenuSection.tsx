'use client'

import { useState } from 'react'
import {
  Utensils,
  Coffee,
  Cookie,
  Flame,
  Star,
  Leaf,
  Cake,
  Search,
  Heart,
  BookOpen,
  X,
  Award,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send
} from 'lucide-react'

const WHATSAPP_PHONE = '5511976535789'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

function parsePrice(priceStr: string): number {
  if (priceStr === 'Consulte') return 0
  const match = priceStr.match(/R\$\s*([\d.,]+)/)
  if (!match) return 0
  return parseFloat(match[1].replace('.', '').replace(',', '.'))
}

function formatWhatsAppMessage(cart: CartItem[], address: string): string {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  let msg = '*NOVO PEDIDO - PADARIA NOVA PAOKENT*\n'
  msg += '------------------------------------\n\n'
  cart.forEach((item, idx) => {
    msg += `Item ${idx + 1}: ${item.name}\n`
    msg += `Quantidade: ${item.quantity}x\n`
    msg += `Valor: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`
  })
  msg += '------------------------------------\n'
  msg += `*TOTAL A PAGAR: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`
  if (address.trim()) {
    msg += `*ENDERECO PARA ENTREGA:*\n${address.trim()}\n\n`
  }
  msg += 'Aguardando confirmacao. Muito obrigado!'
  return msg
}

const categories = [
  { id: 'all', label: 'Todos', iconId: 'all' },
  { id: 'mat', label: 'Matinais', iconId: 'mat' },
  { id: 'pao', label: 'Pães', iconId: 'pao' },
  { id: 'trad', label: 'Lanches', iconId: 'trad' },
  { id: 'esp', label: 'Especiais', iconId: 'esp' },
  { id: 'burg', label: 'Hambúrguer', iconId: 'burg' },
  { id: 'sal', label: 'Saladas', iconId: 'sal' },
  { id: 'salg', label: 'Salgados', iconId: 'salg' },
  { id: 'sob', label: 'Sobremesas', iconId: 'sob' },
]

const categoryIcons: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  all: Utensils,
  mat: Coffee,
  pao: Cookie, // Pães
  trad: Flame, // Lanches
  esp: Star, // Especiais
  burg: Flame, // Hambúrguer
  sal: Leaf, // Saladas
  salg: Cookie, // Salgados
  sob: Cake, // Sobremesas
}

const menuItems = [
  // Matinais
  { id: 'm1', cat: 'mat', name: 'Café Expresso', price: 'R$ 8,50', tags: ['mais_vendido'] },
  { id: 'm2', cat: 'mat', name: 'Expresso Duplo', price: 'R$ 16,00', tags: [] },
  { id: 'm3', cat: 'mat', name: 'Média Expresso', price: 'R$ 10,90', tags: ['mais_vendido'] },
  { id: 'm4', cat: 'mat', name: 'Chocolate Pequeno', price: 'R$ 8,00', tags: [] },
  { id: 'm5', cat: 'mat', name: 'Chocolate Médio', price: 'R$ 11,90', tags: [] },
  { id: 'm6', cat: 'mat', name: 'Chocolate Gelado', price: 'R$ 15,90', tags: [] },
  { id: 'm7', cat: 'mat', name: 'Cappuccino Pequeno', price: 'R$ 9,40', tags: [] },
  { id: 'm8', cat: 'mat', name: 'Cappuccino Médio', price: 'R$ 16,90', tags: [] },
  { id: 'm9', cat: 'mat', name: 'Copo de Leite', price: 'R$ 7,00', tags: [] },
  { id: 'm10', cat: 'mat', name: 'Chá Quente', price: 'R$ 7,00', tags: [] },
  // Pães
  { id: 'p1', cat: 'pao', name: 'Pão c/ Manteiga', price: 'R$ 7,20', tags: ['mais_vendido'] },
  { id: 'p2', cat: 'pao', name: 'Baguete c/ Manteiga', price: 'R$ 12,90', tags: [] },
  { id: 'p3', cat: 'pao', name: 'Baguete c/ Requeijão', price: 'R$ 14,20', tags: [] },
  { id: 'p4', cat: 'pao', name: 'Pão Francês c/ Requeijão', price: 'R$ 9,90', tags: ['mais_vendido'] },
  { id: 'p5', cat: 'pao', name: 'Bisnaga c/ Manteiga', price: 'R$ 9,90', tags: [] },
  { id: 'p6', cat: 'pao', name: 'Integral c/ Manteiga', price: 'R$ 8,50', tags: [] },
  { id: 'p7', cat: 'pao', name: 'Integral c/ Requeijão', price: 'R$ 10,50', tags: [] },
  { id: 'p8', cat: 'pao', name: 'Pão de Queijo c/ Manteiga', price: 'R$ 9,90', tags: ['mais_vendido'] },
  { id: 'p9', cat: 'pao', name: 'Pão Francês c/ Nutella', price: 'R$ 15,80', tags: [] },
  { id: 'p10', cat: 'pao', name: 'Ovos Mexidos', price: 'R$ 15,90', tags: [] },
  // Lanches tradicionais
  { id: 't1', cat: 'trad', name: 'Bauru', price: 'R$ 22,80 / 39,80', tags: ['mais_vendido'] },
  { id: 't2', cat: 'trad', name: 'Misto Quente ou Frio', price: 'R$ 21,50 / 38,50', tags: [] },
  { id: 't3', cat: 'trad', name: 'Mortadela Ceratti', price: 'R$ 23,50 / 40,50', tags: ['mais_vendido'] },
  { id: 't4', cat: 'trad', name: 'Presunto Parma', price: 'R$ 38,90 / 54,90', tags: [] },
  { id: 't5', cat: 'trad', name: 'Queijo Emental', price: 'R$ 39,00 / 54,50', tags: [] },
  { id: 't6', cat: 'trad', name: 'Pão c/ Ovos e Queijo', price: 'R$ 22,50 / 39,50', tags: [] },
  // Especiais
  { id: 'e1', cat: 'esp', name: 'Arthur Ramos', price: 'R$ 47,90 / 56,90', tags: ['mais_vendido', 'especial'] },
  { id: 'e2', cat: 'esp', name: 'Faria Lima', price: 'R$ 39,50 / 46,50', tags: ['especial'] },
  { id: 'e3', cat: 'esp', name: 'Cidade Jardim', price: 'R$ 39,50 / 46,50', tags: ['especial'] },
  { id: 'e4', cat: 'esp', name: 'Iguatemi', price: 'Consulte', tags: ['especial'] },
  { id: 'e5', cat: 'esp', name: 'Tucumã', price: 'R$ 39,50 / 46,50', tags: ['especial'] },
  { id: 'e6', cat: 'esp', name: 'Amauri', price: 'R$ 39,50 / 46,50', tags: ['especial'] },
  { id: 'e7', cat: 'esp', name: 'Tabapuã', price: 'R$ 39,50 / 46,50', tags: ['especial'] },
  { id: 'e8', cat: 'esp', name: 'Joaquim Floriano', price: 'R$ 39,50 / 46,50', tags: ['especial'] },
  // Especiais hambúrguer
  { id: 'b1', cat: 'burg', name: 'X-Salada', price: 'R$ 32,90', tags: [] },
  { id: 'b2', cat: 'burg', name: 'X-Burguer', price: 'R$ 28,90', tags: ['mais_vendido'] },
  { id: 'b3', cat: 'burg', name: 'X-Egg', price: 'R$ 37,90', tags: [] },
  { id: 'b4', cat: 'burg', name: 'Beirute Jerônimo da Veiga', price: 'R$ 45,90', tags: [] },
  { id: 'b5', cat: 'burg', name: 'Beirute Seridó', price: 'R$ 45,90', tags: [] },
  // Saladas e omeletes
  { id: 's1', cat: 'sal', name: 'Salada Mista', price: 'R$ 22,90', tags: [] },
  { id: 's2', cat: 'sal', name: 'Omelete Misto', price: 'R$ 28,90', tags: ['mais_vendido'] },
  { id: 's3', cat: 'sal', name: 'Tapioca Presunto e Queijo', price: 'R$ 27,90', tags: [] },
  { id: 's4', cat: 'sal', name: 'Torta Frango c/ Salada', price: 'R$ 37,90', tags: ['mais_vendido'] },
  { id: 's5', cat: 'sal', name: 'Tapioca c/ Ovos', price: 'R$ 28,50', tags: [] },
  // Salgados
  { id: 'g1', cat: 'salg', name: 'Coxa Creme', price: 'R$ 14,50', tags: ['ifood_top'] },
  { id: 'g2', cat: 'salg', name: 'Salgados Diversos', price: 'R$ 12,00', tags: ['mais_vendido'] },
  { id: 'g3', cat: 'salg', name: 'Tortinhas', price: 'R$ 14,50', tags: [] },
  { id: 'g4', cat: 'salg', name: 'Empada Frango/Palmito', price: 'R$ 10,90', tags: [] },
  // Sobremesas
  { id: 'o1', cat: 'sob', name: 'Pedaço de Bolo', price: 'R$ 12,50', tags: [] },
  { id: 'o2', cat: 'sob', name: 'Salada de Frutas', price: 'R$ 20,90', tags: [] },
  { id: 'o3', cat: 'sob', name: 'Mamão em Pedaços', price: 'R$ 16,90', tags: [] },
]

const tagLabels: Record<string, { label: string; color: string; icon: any }> = {
  mais_vendido: { label: 'Mais Vendido', color: '#EA580C', icon: Flame },
  especial: { label: 'Especial', color: '#C9A84C', icon: Star },
  ifood_top: { label: 'Top iFood', color: '#EA1D2C', icon: Award },
}

export default function MenuSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address'>('cart')
  const [address, setAddress] = useState('')

  const filtered = menuItems.filter((item) => {
    const matchCat = activeCategory === 'all' || item.cat === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const addToCart = (item: typeof menuItems[0]) => {
    const price = parsePrice(item.price)
    if (price === 0) return
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { id: item.id, name: item.name, price, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c))
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id))
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    setCheckoutStep('address')
  }

  const sendWhatsApp = () => {
    if (cart.length === 0) return
    if (!address.trim()) {
      alert('Por favor, informe o endereço de entrega.')
      return
    }
    const msg = formatWhatsAppMessage(cart, address)
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank')
    setCartOpen(false)
    setCart([])
    setAddress('')
    setCheckoutStep('cart')
  }

  // COLLAPSED / CLOSED STATE (DARK BANNER)
  if (!isOpen) {
    return (
      <section
        id="cardapio"
        style={{
          background: '#1A0F08',
          padding: '96px 24px',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <span
              style={{
                color: '#C9A84C',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Cardápio Completo
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
              Nossas Especialidades
            </h2>
            <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
              Explore nossa seleção de cafés especiais, pães artesanais recém-saídos do forno, lanches tradicionais, hambúrgueres e sobremesas.
            </p>
          </div>

          {/* Interactive Card */}
          <button
            onClick={() => {
              setIsOpen(true)
              setTimeout(() => {
                document.getElementById('cardapio-aberto')?.scrollIntoView({ behavior: 'smooth' })
              }, 150)
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(26,15,8,0.7) 100%)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '24px',
              padding: '64px 32px',
              width: '100%',
              maxWidth: '850px',
              margin: '0 auto',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.transform = 'translateY(-6px)'
              el.style.borderColor = '#C9A84C'
              el.style.boxShadow = '0 30px 60px rgba(201,168,76,0.18)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.transform = 'translateY(0)'
              el.style.borderColor = 'rgba(201,168,76,0.3)'
              el.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2C1A0E',
                boxShadow: '0 8px 24px rgba(201,168,76,0.3)',
              }}
            >
              <BookOpen size={32} />
            </div>
            
            <h3
              style={{
                color: '#FAF6EF',
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'var(--font-playfair)',
                margin: 0,
              }}
            >
              Abrir Cardápio Interativo
            </h3>
            
            <p style={{ color: 'rgba(250,246,239,0.5)', fontSize: '14px', margin: 0, maxWidth: '460px', lineHeight: '1.6' }}>
              Filtre por matinais, lanches, pães, salgados ou sobremesas. Busque itens e veja preços em tempo real.
            </p>

            <span
              style={{
                background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                color: '#2C1A0E',
                fontWeight: '800',
                fontSize: '14px',
                padding: '14px 36px',
                borderRadius: '999px',
                marginTop: '12px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 15px rgba(201,168,76,0.4)',
                transition: 'all 0.2s',
              }}
            >
              Visualizar Cardápio
            </span>
          </button>
        </div>
      </section>
    )
  }

  // EXPANDED / OPEN STATE (PREMIUM DARK DESIGN)
  return (
    <section
      id="cardapio"
      style={{
        background: '#1A0F08',
        padding: '96px 24px',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        scrollMarginTop: '80px',
      }}
    >
      <style>{`
        @media (min-width: 1024px) {
          .menu-container-cart-open {
            padding-right: 380px !important;
          }
        }
      `}</style>
      <div id="cardapio-aberto" className={cartOpen ? 'menu-container-cart-open' : ''} style={{ maxWidth: '1280px', margin: '0 auto', transition: 'padding 0.3s ease' }}>
        {/* Header com botão fechar no topo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => {
              setIsOpen(false)
              setTimeout(() => {
                document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '999px',
              padding: '8px 20px',
              color: 'rgba(250,246,239,0.8)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(234,29,44,0.15)'
              e.currentTarget.style.borderColor = 'rgba(234,29,44,0.4)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.color = 'rgba(250,246,239,0.8)'
            }}
          >
            <X size={14} /> FECHAR CARDÁPIO
          </button>
        </div>

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
            Cardápio Completo
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
            Tudo que você precisa,
            <br />em um só lugar.
          </h2>
        </div>

        {/* Busca */}
        <div style={{ maxWidth: '500px', margin: '0 auto 32px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar no cardápio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px 14px 44px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.04)',
              fontSize: '15px',
              fontFamily: 'var(--font-inter)',
              color: '#FAF6EF',
              outline: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
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
          <Search
            size={18}
            color="rgba(250,246,239,0.4)"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Filtros por categoria */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '40px',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((cat) => {
            const IconComponent = categoryIcons[cat.iconId] || Utensils
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontSize: '13px',
                  fontWeight: '600',
                  fontFamily: 'var(--font-inter)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive
                    ? 'linear-gradient(135deg, #9E7A2E, #C9A84C)'
                    : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#1A0F08' : 'rgba(250,246,239,0.7)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.08)',
                  boxShadow: isActive
                    ? '0 4px 15px rgba(201,168,76,0.3)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }
                }}
              >
                <IconComponent size={15} style={{ display: 'block' }} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Grid de itens */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)'
                el.style.transform = 'translateY(-4px)'
                el.style.borderColor = 'rgba(201,168,76,0.3)'
                el.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
                el.style.borderColor = 'rgba(255,255,255,0.06)'
                el.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              <div>
                {/* Tags */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                    marginBottom: item.tags.length > 0 ? '12px' : '0',
                  }}
                >
                  {item.tags.map((tag) => {
                    const tagInfo = tagLabels[tag]
                    if (!tagInfo) return null
                    const IconComponent = tagInfo.icon
                    return (
                      <span
                        key={tag}
                        style={{
                          fontSize: '9px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: `${tagInfo.color}18`,
                          color: tagInfo.color || '#C9A84C',
                          border: `1px solid ${tagInfo.color}35`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <IconComponent size={10} style={{ display: 'block' }} />
                        {tagInfo.label}
                      </span>
                    )
                  })}
                </div>

                {/* Nome e favorito */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#FAF6EF',
                      lineHeight: '1.3',
                      flex: 1,
                      margin: 0,
                    }}
                  >
                    {item.name}
                  </h3>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '2px',
                      flexShrink: 0,
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    aria-label={favorites.has(item.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <Heart size={16} fill={favorites.has(item.id) ? '#EA1D2C' : 'none'} color={favorites.has(item.id) ? '#EA1D2C' : 'rgba(250,246,239,0.4)'} />
                  </button>
                </div>
              </div>

              <div>
                {/* Preço */}
                <p
                  style={{
                    color: '#C9A84C',
                    fontSize: '22px',
                    fontWeight: '700',
                    fontFamily: 'var(--font-playfair)',
                    marginTop: '12px',
                    marginBottom: '16px',
                  }}
                >
                  {item.price}
                </p>

                {/* Botão Adicionar */}
                <button
                  onClick={() => addToCart(item)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: cart.find(c => c.id === item.id)
                      ? 'rgba(16,185,129,0.15)'
                      : 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
                    color: cart.find(c => c.id === item.id) ? '#10B981' : '#2C1A0E',
                    fontWeight: '700',
                    fontSize: '12px',
                    padding: '11px',
                    borderRadius: '10px',
                    border: cart.find(c => c.id === item.id)
                      ? '1px solid rgba(16,185,129,0.3)'
                      : 'none',
                    cursor: item.price === 'Consulte' ? 'not-allowed' : 'pointer',
                    opacity: item.price === 'Consulte' ? 0.5 : 1,
                    transition: 'all 0.2s',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                  disabled={item.price === 'Consulte'}
                >
                  {cart.find(c => c.id === item.id) ? (
                    <><ShoppingCart size={14} /> No Carrinho ({cart.find(c => c.id === item.id)!.quantity}x)</>
                  ) : (
                    <><Plus size={14} /> Adicionar</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(250,246,239,0.4)' }}>
            <Search size={40} style={{ marginBottom: '16px' }} />
            <p>Nenhum item encontrado para &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* Nota: sem lactose */}
        <div
          style={{
            marginTop: '40px',
            padding: '16px 20px',
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#C9A84C', fontSize: '14px', margin: 0 }}>
            <strong>Intolerância à lactose?</strong> Bebidas com leite sem lactose: acréscimo de R$ 2,60
          </p>
        </div>

        {/* Botão fechar no rodapé */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <button
            onClick={() => {
              setIsOpen(false)
              setTimeout(() => {
                document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '999px',
              padding: '10px 24px',
              color: 'rgba(250,246,239,0.8)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(234,29,44,0.15)'
              e.currentTarget.style.borderColor = 'rgba(234,29,44,0.4)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.color = 'rgba(250,246,239,0.8)'
            }}
          >
            <X size={14} /> FECHAR CARDÁPIO
          </button>
        </div>

        {/* Floating Cart Panel */}
        {cart.length > 0 && (
          <>
            {/* Cart Toggle Button (fixed) */}
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
                              onClick={() => updateQuantity(item.id, -1)}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#FAF6EF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ color: '#FAF6EF', fontSize: '15px', fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.1)', color: '#C9A84C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
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
                        onClick={sendWhatsApp}
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
