'use client'

import { useState } from 'react'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  image: string
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'melhor-padaria-jardim-paulistano',
    title: 'Por que a Nova Paokent é referência em panificação no Jardim Paulistano',
    excerpt: 'Desde 1994, a Padaria Nova Paokent se dedica à produção artesanal de pães, bolos e lanches no coração do Jardim Paulistano. Conheça os ingredientes selecionados, o forno a lenha e a tradição familiar que fazem a diferença em cada mordida.',
    category: 'Tradição',
    readTime: '4 min',
    date: '15 Mai 2026',
    image: '/images/blog-padaria.png',
  },
  {
    id: '2',
    slug: 'cafe-da-manha-sao-paulo-jardins',
    title: 'Café da manhã completo nos Jardins: 7 razões para começar o dia na Nova Paokent',
    excerpt: 'Pão francês saindo do forno, café espresso com grãos torrados na hora, sucos naturais e uma seleção de frios premium. Descubra por que o café da manhã da Nova Paokent é considerado um dos melhores da região dos Jardins, em São Paulo.',
    category: 'Gastronomia',
    readTime: '5 min',
    date: '10 Mai 2026',
    image: '/images/blog-cafe.png',
  },
  {
    id: '3',
    slug: 'encomenda-salgados-festa-sp',
    title: 'Salgados e doces para festas: como encomendar na Nova Paokent',
    excerpt: 'Coxinha, bolinha de queijo, mini-quiche e muito mais. Saiba como fazer sua encomenda de salgados para eventos, festas infantis e confraternizações corporativas com a qualidade artesanal da Padaria Nova Paokent.',
    category: 'Encomendas',
    readTime: '3 min',
    date: '5 Mai 2026',
    image: '/images/blog-festas.png',
  },
  {
    id: '4',
    slug: 'delivery-padaria-jardim-paulistano',
    title: 'Delivery de padaria no Jardim Paulistano: pão quentinho na sua porta',
    excerpt: 'Peça pelo iFood ou pelo nosso delivery próprio com WhatsApp. Entrega rápida para o Jardim Paulistano, Jardim Europa, Itaim Bibi e regiões próximas. Confira o cardápio completo e receba fresquinho em casa.',
    category: 'Delivery',
    readTime: '3 min',
    date: '28 Abr 2026',
    image: '/images/blog-delivery.png',
  },
]

export default function BlogSection() {
  const [expandedPost, setExpandedPost] = useState<string | null>(null)

  return (
    <section
      id="blog"
      style={{
        background: '#1A0F08',
        padding: '80px 24px',
        borderTop: '1px solid rgba(201,168,76,0.08)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            Blog & Novidades
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: '700',
              color: '#FAF6EF',
              marginTop: '12px',
              marginBottom: '16px',
            }}
          >
            Sabores, Dicas e Tradição
          </h2>
          <p
            style={{
              color: 'rgba(250,246,239,0.5)',
              fontSize: '16px',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: '1.7',
            }}
          >
            Acompanhe as novidades da padaria, dicas de gastronomia e histórias que 
            fazem parte da nossa tradição de 30 anos no Jardim Paulistano.
          </p>
        </div>

        {/* Blog Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {blogPosts.map((post) => {
            const isExpanded = expandedPost === post.id
            return (
              <article
                key={post.id}
                onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                style={{
                  background: 'rgba(250,246,239,0.03)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                itemScope
                itemType="https://schema.org/BlogPosting"
              >
                {/* Image */}
                <div
                  style={{
                    height: '160px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60px',
                    background: 'linear-gradient(transparent, rgba(26,15,8,0.85))',
                  }} />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '16px',
                      background: 'rgba(26,15,8,0.7)',
                      backdropFilter: 'blur(8px)',
                      color: '#C9A84C',
                      fontSize: '9px',
                      fontWeight: '800',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '10px',
                    }}
                  >
                    <time
                      dateTime={post.date}
                      itemProp="datePublished"
                      style={{
                        fontSize: '10px',
                        color: 'rgba(250,246,239,0.35)',
                        fontWeight: '600',
                      }}
                    >
                      {post.date}
                    </time>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'rgba(201,168,76,0.5)',
                        fontWeight: '600',
                      }}
                    >
                      {post.readTime} de leitura
                    </span>
                  </div>

                  <h3
                    itemProp="headline"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#FAF6EF',
                      lineHeight: '1.4',
                      marginBottom: '10px',
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    itemProp="description"
                    style={{
                      fontSize: '13px',
                      color: 'rgba(250,246,239,0.45)',
                      lineHeight: '1.7',
                      display: '-webkit-box',
                      WebkitLineClamp: isExpanded ? 999 : 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {post.excerpt}
                  </p>

                  <div
                    style={{
                      marginTop: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#C9A84C',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {isExpanded ? 'Fechar' : 'Ler mais'}
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        color: '#C9A84C',
                        transition: 'transform 0.3s ease',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                        display: 'inline-block',
                      }}
                    >
                      →
                    </span>
                  </div>
                </div>

                {/* Hidden SEO content */}
                <meta itemProp="author" content="Padaria Nova Paokent" />
                <meta itemProp="publisher" content="Padaria Nova Paokent" />
              </article>
            )
          })}
        </div>

        {/* SEO-rich hidden structured data for search engines */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(250,246,239,0.3)',
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: '1.8',
            }}
          >
            A Padaria Nova Paokent é especializada em pães artesanais, café da manhã, 
            lanches especiais e encomendas para festas no Jardim Paulistano, São Paulo. 
            Servimos a região dos Jardins desde 1994 com ingredientes selecionados e 
            receitas tradicionais. Delivery disponível via iFood e WhatsApp.
          </p>
        </div>
      </div>
    </section>
  )
}
