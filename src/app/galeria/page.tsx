import { getImagesByCategory } from '@/lib/imageManager'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Galeria | Padaria Nova Pão Kent',
  description: 'Confira as fotos de nossos produtos e eventos da Padaria Nova Pão Kent.',
}

export default function GaleriaPage() {
  const produtos = getImagesByCategory('produtos')
  const eventos = getImagesByCategory('eventos')
  
  // Vamos mesclar para mostrar tudo de forma atraente
  const todasImagens = [...produtos, ...eventos]
  // shuffle (seed estático não é simples no server-side component, então deixamos na ordem ou intercalamos)
  const galeria = todasImagens.sort(() => Math.random() - 0.5)

  return (
    <main style={{ minHeight: '100vh', background: '#1A0F08', color: '#FAF6EF', padding: '120px 24px 80px' }} className="paper-texture">
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Link 
          href="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#C9A84C', 
            textDecoration: 'none',
            marginBottom: '40px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Voltar para o site
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Momentos e Sabores
          </span>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '700', margin: '16px 0' }}>
            Nossa <span style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C06E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Galeria</span>
          </h1>
          <p style={{ color: 'rgba(250,246,239,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '16px' }}>
            Explore nossos produtos frescos, ambiente e serviços de eventos especiais, com fotos reais de quem faz o que ama.
          </p>
        </div>

        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '24px' 
          }}
        >
          {galeria.map((img, idx) => (
            <div 
              key={img.id + idx}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                aspectRatio: '4/3',
              }}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${img.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '24px 16px 16px',
                  background: 'linear-gradient(to bottom, transparent, rgba(26,15,8,0.9))',
                  pointerEvents: 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {img.tags.map(tag => (
                    <span 
                      key={tag}
                      style={{
                        background: 'rgba(201,168,76,0.2)',
                        color: '#E2C06E',
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
