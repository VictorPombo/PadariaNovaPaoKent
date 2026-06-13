'use client'

import { useState } from 'react'
import Image from 'next/image'

const galleryImages = [
  {
    "src": "/images/reais/paes-03.jpg",
    "alt": "Foto real de paes (fonteB-24.jpg)",
    "category": "paes"
  },
  {
    "src": "/images/reais/paes-04.jpg",
    "alt": "Foto real de paes (fonteB-16.jpg)",
    "category": "paes"
  },
  {
    "src": "/images/reais/paes-05.jpg",
    "alt": "Foto real de paes (fonteB-05.jpg)",
    "category": "paes"
  },
  {
    "src": "/images/reais/paes-06.jpg",
    "alt": "Foto real de paes (fonteB-12.jpg)",
    "category": "paes"
  },
  {
    "src": "/images/reais/sanduiches-01.jpg",
    "alt": "Foto real de sanduiches (fonteB-23.jpg)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-02.jpg",
    "alt": "Foto real de sanduiches (fonteB-09.jpg)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-03.jpg",
    "alt": "Foto real de sanduiches (fonteB-08.jpg)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-04.jpg",
    "alt": "Foto real de sanduiches (fonteB-19.jpg)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-05.jpg",
    "alt": "Foto real de sanduiches (fonteB-27.jpg)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-06.jpg",
    "alt": "Foto real de sanduiches (fonteB-17.jpg)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-07.jpg",
    "alt": "Foto real de sanduiches (fonteB-29.jpg)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-08.jpg",
    "alt": "Foto real de sanduiches (fonteB-11.jpg)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-09.jpg",
    "alt": "Foto real de sanduiches (fonteB-10.jpg)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-11.png",
    "alt": "Foto real de sanduiches (fonteC-p03-08.png)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-12.png",
    "alt": "Foto real de sanduiches (fonteC-p03-06.png)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-13.png",
    "alt": "Foto real de sanduiches (fonteC-p03-07.png)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-14.png",
    "alt": "Foto real de sanduiches (fonteC-p03-05.png)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-15.png",
    "alt": "Foto real de sanduiches (fonteC-p03-04.png)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/sanduiches-16.png",
    "alt": "Foto real de sanduiches (fonteC-p03-03.png)",
    "category": "sanduiches"
  },
  {
    "src": "/images/reais/salgados-03.jpg",
    "alt": "Foto real de salgados (fonteB-14.jpg)",
    "category": "salgados"
  },
  {
    "src": "/images/reais/salgados-04.jpg",
    "alt": "Foto real de salgados (fonteB-04.jpg)",
    "category": "salgados"
  },
  {
    "src": "/images/reais/salgados-06.png",
    "alt": "Foto real de salgados (fonteC-p13-11.png)",
    "category": "salgados"
  },
  {
    "src": "/images/reais/salgados-07.png",
    "alt": "Foto real de salgados (fonteC-p13-12.png)",
    "category": "salgados"
  },
  {
    "src": "/images/reais/salgados-08.png",
    "alt": "Foto real de salgados (fonteC-p13-13.png)",
    "category": "salgados"
  },
  {
    "src": "/images/reais/doces-bolos-02.jpg",
    "alt": "Foto real de doces-bolos (fonteB-26.jpg)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-03.jpg",
    "alt": "Foto real de doces-bolos (fonteB-03.jpg)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-04.jpg",
    "alt": "Foto real de doces-bolos (fonteB-02.jpg)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-05.jpg",
    "alt": "Foto real de doces-bolos (fonteB-28.jpg)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-06.jpg",
    "alt": "Foto real de doces-bolos (fonteB-15.jpg)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-07.jpg",
    "alt": "Foto real de doces-bolos (fonteB-01.jpg)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-08.jpg",
    "alt": "Foto real de doces-bolos (fonteB-06.jpg)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-09.jpg",
    "alt": "Foto real de doces-bolos (fonteB-07.jpg)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-10.jpg",
    "alt": "Foto real de doces-bolos (fonteB-13.jpg)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-12.png",
    "alt": "Foto real de doces-bolos (fonteC-p16-17.png)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-13.png",
    "alt": "Foto real de doces-bolos (fonteC-p16-16.png)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-14.png",
    "alt": "Foto real de doces-bolos (fonteC-p16-18.png)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-15.png",
    "alt": "Foto real de doces-bolos (fonteC-p16-19.png)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/doces-bolos-16.png",
    "alt": "Foto real de doces-bolos (fonteC-p16-20.png)",
    "category": "doces-bolos"
  },
  {
    "src": "/images/reais/ambiente-fachada-02.jpg",
    "alt": "Foto real de ambiente-fachada (fonteA-servico-01.jpg)",
    "category": "ambiente-fachada"
  }
];

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
