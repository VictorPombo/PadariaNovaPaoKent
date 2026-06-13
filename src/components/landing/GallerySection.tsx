'use client'

import { useState } from 'react'
import Image from 'next/image'

import manifest from '../../../../public/images/reais/manifest.json'

const galleryImages = Object.values(manifest.categorias)
  .flat()
  .filter(img => img.usada_em === null && img.categoria !== 'logo-cliente' && img.categoria !== 'descartar')
  .map(img => ({
    src: `/images/reais/${img.arquivo}`,
    alt: img.descricao,
    category: img.categoria
  }))

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section id="galeria" style={{ background: '#2C1A0E', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Nossa Padaria em Fotos
          </span>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '700', color: '#FAF6EF', marginTop: '12px' }}>
            Galeria
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              style={{ 
                position: 'relative', 
                paddingBottom: '100%', 
                cursor: 'pointer', 
                overflow: 'hidden', 
                borderRadius: '8px' 
              }}
              onClick={() => setSelectedImage(img.src)}
            >
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill 
                style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                sizes="(max-width: 768px) 50vw, 33vw"
                quality={80}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', height: '80vh' }}>
            <Image 
              src={selectedImage} 
              alt="Ampliada" 
              fill 
              style={{ objectFit: 'contain' }} 
              quality={100}
            />
            <button 
              style={{
                position: 'absolute', top: '-40px', right: 0,
                background: 'transparent', border: 'none',
                color: '#fff', fontSize: '24px', cursor: 'pointer'
              }}
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
