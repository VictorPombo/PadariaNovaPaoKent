'use client'

import { useState } from 'react'

const WHATSAPP_URL = 'https://wa.me/5511976535789?text=Olá!%20Quero%20pedir%20'
const IFOOD_URL = 'https://www.ifood.com.br'

const categories = [
  { id: 'all', label: 'Todos', icon: '🍽️' },
  { id: 'mat', label: 'Matinais', icon: '☕' },
  { id: 'pao', label: 'Pães', icon: '🍞' },
  { id: 'trad', label: 'Lanches', icon: '🥪' },
  { id: 'esp', label: 'Especiais', icon: '🥖' },
  { id: 'burg', label: 'Hambúrguer', icon: '🍔' },
  { id: 'sal', label: 'Saladas', icon: '🥗' },
  { id: 'salg', label: 'Salgados', icon: '🥟' },
  { id: 'sob', label: 'Sobremesas', icon: '🍰' },
]

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

const tagLabels: Record<string, { label: string; color: string }> = {
  mais_vendido: { label: '🔥 Mais Vendido', color: '#EA580C' },
  especial: { label: '⭐ Especial', color: '#C9A84C' },
  ifood_top: { label: '🍕 Top iFood', color: '#EA1D2C' },
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

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

  return (
    <section
      id="cardapio"
      style={{
        background: '#FAF6EF',
        padding: '96px 24px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
            Cardápio Completo
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
            Tudo que você precisa,
            <br />em um só lugar.
          </h2>
        </div>

        {/* Busca */}
        <div style={{ maxWidth: '500px', margin: '0 auto 32px', position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍  Buscar no cardápio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '12px',
              border: '2px solid rgba(44,26,14,0.1)',
              background: 'white',
              fontSize: '15px',
              fontFamily: 'var(--font-inter)',
              color: '#2C1A0E',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#C9A84C' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(44,26,14,0.1)' }}
          />
        </div>

        {/* Filtros por categoria */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '40px',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '13px',
                fontWeight: '600',
                fontFamily: 'var(--font-inter)',
                transition: 'all 0.2s',
                background:
                  activeCategory === cat.id
                    ? 'linear-gradient(135deg, #9E7A2E, #C9A84C)'
                    : 'rgba(44,26,14,0.07)',
                color: activeCategory === cat.id ? '#2C1A0E' : '#6B3F2A',
                boxShadow:
                  activeCategory === cat.id
                    ? '0 4px 12px rgba(201,168,76,0.3)'
                    : 'none',
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
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
                background: 'white',
                border: '1px solid rgba(44,26,14,0.08)',
                borderRadius: '14px',
                padding: '20px',
                transition: 'all 0.25s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = '0 12px 40px rgba(44,26,14,0.12)'
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = 'none'
                el.style.transform = 'translateY(0)'
              }}
            >
              {/* Tags */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                  marginBottom: item.tags.length > 0 ? '10px' : '0',
                }}
              >
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: `${tagLabels[tag]?.color}20`,
                      color: tagLabels[tag]?.color || '#C9A84C',
                      border: `1px solid ${tagLabels[tag]?.color}40`,
                    }}
                  >
                    {tagLabels[tag]?.label || tag}
                  </span>
                ))}
              </div>

              {/* Nome e favorito */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '17px',
                    fontWeight: '700',
                    color: '#2C1A0E',
                    lineHeight: '1.3',
                    flex: 1,
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
                    fontSize: '18px',
                    padding: '2px',
                    flexShrink: 0,
                  }}
                  aria-label={favorites.has(item.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  {favorites.has(item.id) ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Preço */}
              <p
                style={{
                  color: '#C9A84C',
                  fontSize: '20px',
                  fontWeight: '700',
                  fontFamily: 'var(--font-playfair)',
                  marginTop: '8px',
                  marginBottom: '16px',
                }}
              >
                {item.price}
              </p>

              {/* Botões */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`${WHATSAPP_URL}${encodeURIComponent(item.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    background: '#25D366',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '12px',
                    padding: '9px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                >
                  📲 WhatsApp
                </a>
                <a
                  href={IFOOD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    background: '#EA1D2C',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '12px',
                    padding: '9px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                >
                  🍕 iFood
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
            <p>Nenhum item encontrado para &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* Nota: sem lactose */}
        <div
          style={{
            marginTop: '32px',
            padding: '16px 20px',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#6B3F2A', fontSize: '14px' }}>
            💛 <strong>Intolerância à lactose?</strong> Bebidas com leite sem lactose: acréscimo de R$ 2,60
          </p>
        </div>
      </div>
    </section>
  )
}
