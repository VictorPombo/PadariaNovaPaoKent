// Seção de Contato da Padaria Nova Paokent
'use client'

import { Phone, MapPin } from 'lucide-react'
import BakeryLogo from '../ui/BakeryLogo'

const InstagramIcon = ({ size = 24, ...props }: { size?: number; style?: any }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const MAPS_URL = 'https://maps.google.com/?q=Rua+Prof+Artur+Ramos+223+Jardim+Paulistano+São+Paulo'
const WHATSAPP_URL = 'https://wa.me/5511976535789'
const INSTAGRAM_URL = 'https://www.instagram.com/novapaokent'

export default function ContactSection() {
  return (
    <footer
      id="contato"
      style={{
        background: '#1A0F08',
        padding: '96px 24px 40px',
        borderTop: '1px solid rgba(201,168,76,0.1)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Grid de contato */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '48px',
            marginBottom: '64px',
          }}
        >
          {/* Logo e sobre */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <BakeryLogo size={60} />
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FAF6EF',
                    margin: 0,
                    lineHeight: '1.2',
                  }}
                >
                  Nova Paokent
                </p>
                <p style={{ color: '#C9A84C', fontSize: '11px', margin: 0, letterSpacing: '0.1em' }}>
                  PADARIA ARTESANAL DESDE 1993
                </p>
              </div>
            </div>
            <p style={{ color: 'rgba(250,246,239,0.5)', fontSize: '14px', lineHeight: '1.8', maxWidth: '300px' }}>
              30 anos servindo tradição, sabor e experiência no coração do Jardim Paulistano.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3
              style={{
                color: '#C9A84C',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Contato
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'rgba(250,246,239,0.7)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#25D366' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(250,246,239,0.7)' }}
              >
                <Phone size={18} style={{ flexShrink: 0 }} />
                (11) 97653-5789
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  color: 'rgba(250,246,239,0.7)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s',
                  lineHeight: '1.5',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#C9A84C' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(250,246,239,0.7)' }}
              >
                <MapPin size={18} style={{ flexShrink: 0 }} />
                <span>
                  R. Prof. Artur Ramos, 223<br />Jardim Paulistano, São Paulo
                </span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'rgba(250,246,239,0.7)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#E4405F' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(250,246,239,0.7)' }}
              >
                <InstagramIcon size={18} style={{ flexShrink: 0 }} />
                @novapaokent · 1.920 seguidores
              </a>
            </div>
          </div>

          {/* Horários */}
          <div>
            <h3
              style={{
                color: '#C9A84C',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Horário de Funcionamento
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { day: 'Todos os dias', hours: '6h às 22h' },
              ].map((schedule) => (
                <div
                  key={schedule.day}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <span style={{ color: 'rgba(250,246,239,0.6)', fontSize: '14px' }}>
                    {schedule.day}
                  </span>
                  <span style={{ color: '#C9A84C', fontSize: '14px', fontWeight: '600' }}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: '#22C55E', fontSize: '12px', fontWeight: '600' }}>
                Aberto agora
              </span>
            </div>
          </div>
        </div>

        {/* Mapa embed */}
        <div
          style={{
            width: '100%',
            height: '240px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '40px',
            border: '1px solid rgba(201,168,76,0.15)',
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.8!2d-46.692!3d-23.571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDM0JzE5LjYiUyA0NsKwNDEnMzEuMiJX!5e0!3m2!1spt!2sbr!4v1620000000000!5m2!1spt!2sbr"
            width="100%"
            height="240"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Padaria Nova Paokent"
          />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <p style={{ color: 'rgba(250,246,239,0.3)', fontSize: '13px' }}>
            © {new Date().getFullYear()} Padaria Nova Paokent. Todos os direitos reservados.
          </p>
          <p style={{ color: 'rgba(250,246,239,0.2)', fontSize: '11px' }}>
            Desde 1993 • Jardim Paulistano, São Paulo
          </p>
        </div>
      </div>
    </footer>
  )
}
