'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import BakeryLogo from '../ui/BakeryLogo'

const navItems = [
  { label: 'Início', href: '#inicio' },
  { label: 'Cardápio', href: '#cardapio' },
  { label: 'Café da Manhã', href: '#cardapio' },
  { label: 'Lanches', href: '#especiais' },
  { label: 'Delivery', href: '#delivery' },
  { label: 'Sobre', href: '#tradicao' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contato', href: '#contato' },
]

const WHATSAPP_URL = 'https://wa.me/5511976535789?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido%20na%20Padaria%20Nova%20Pão%20Kent!'

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      id="header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.4s ease',
        background: scrolled ? 'rgba(44, 26, 14, 0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201, 168, 76, 0.15)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: scrolled ? '68px' : '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'height 0.4s ease',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <BakeryLogo size={55} />
          <div>
            <p
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '18px',
                fontWeight: '700',
                color: '#FAF6EF',
                lineHeight: '1.1',
                margin: 0,
              }}
            >
              Nova Pão Kent
            </p>
            <p
              style={{ fontSize: '10px', color: '#C9A84C', margin: 0, letterSpacing: '0.1em' }}
            >
              DESDE 1994
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
          className="hidden-mobile"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                color: 'rgba(250, 246, 239, 0.8)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.2s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#C9A84C' }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(250, 246, 239, 0.8)' }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden-mobile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
              color: '#2C1A0E',
              fontWeight: '700',
              fontSize: '14px',
              padding: '10px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 8px 24px rgba(201,168,76,0.4)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = 'none'
            }}
          >
            Pedir Agora <ArrowRight size={16} />
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FAF6EF',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
              display: 'none',
            }}
            aria-label="Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: 'rgba(44, 26, 14, 0.98)',
            backdropFilter: 'blur(20px)',
            padding: '20px 24px',
            borderTop: '1px solid rgba(201,168,76,0.15)',
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                color: 'rgba(250,246,239,0.8)',
                textDecoration: 'none',
                fontSize: '16px',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
