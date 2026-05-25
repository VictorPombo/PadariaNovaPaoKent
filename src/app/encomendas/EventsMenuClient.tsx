'use client'

import { useState } from 'react'
import { miniSanduiches, paesDeMetro, salgados, doces, MenuCategory, MenuItem } from '@/data/eventsMenu'
import { ArrowLeft, MessageCircle } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/5511976535789?text='

function generateWhatsAppLink(category: string, item: string) {
  const msg = `Olá! Gostaria de encomendar um item do Menu de Eventos.\n\nCategoria: ${category}\nItem: ${item}`
  return `${WHATSAPP_URL}${encodeURIComponent(msg)}`
}

export default function EventsMenuClient() {
  const [activeTab, setActiveTab] = useState<string>('miniSanduiches')

  const tabs = [
    { id: 'miniSanduiches', label: 'Mini Sanduíches', data: miniSanduiches },
    { id: 'paesDeMetro', label: 'Pães de Metro', data: paesDeMetro },
    { id: 'salgados', label: 'Salgados', data: salgados },
    { id: 'doces', label: 'Bolos & Doces', data: doces },
  ]

  const activeData = tabs.find(t => t.id === activeTab)?.data

  return (
    <div style={{ minHeight: '100vh', background: '#1A0F08', color: '#FAF6EF', padding: '120px 24px 60px' }} className="paper-texture">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <a 
          href="/#encomendas" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#C9A84C', 
            textDecoration: 'none',
            marginBottom: '32px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Voltar para o site
        </a>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Menu de Eventos 2026
          </span>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '700', margin: '16px 0' }}>
            Cardápio de <span style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C06E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Encomendas</span>
          </h1>
          <p style={{ color: 'rgba(250,246,239,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '16px' }}>
            Escolha as melhores opções para sua festa ou reunião. Trabalhamos com ingredientes selecionados para garantir uma experiência inesquecível.
          </p>
        </div>

        {/* Tabs */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            paddingBottom: '16px', 
            marginBottom: '40px',
            scrollbarWidth: 'none', /* Firefox */
            borderBottom: '1px solid rgba(201,168,76,0.15)'
          }}
          className="hide-scrollbar"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(201,168,76,0.15)' : 'transparent',
                border: `1px solid ${activeTab === tab.id ? 'rgba(201,168,76,0.4)' : 'transparent'}`,
                color: activeTab === tab.id ? '#E2C06E' : 'rgba(250,246,239,0.6)',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeData && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '32px', color: '#FAF6EF', marginBottom: '8px' }}>
                {activeData.title}
              </h2>
              {activeData.subtitle && (
                <p style={{ color: '#C9A84C', fontSize: '16px', fontWeight: '500' }}>{activeData.subtitle}</p>
              )}
            </div>

            {/* Notes */}
            {activeData.notes && activeData.notes.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', padding: '20px', marginBottom: '40px' }}>
                <h4 style={{ color: '#C9A84C', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Observações:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(250,246,239,0.7)', fontSize: '14px', lineHeight: '1.6' }}>
                  {activeData.notes.map((note, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Items Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {activeData.items.map((item: MenuItem, idx: number) => (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, borderColor 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '16px' }}>
                    <h3 style={{ color: '#FAF6EF', fontSize: '18px', fontWeight: '700', lineHeight: '1.3' }}>{item.title}</h3>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ display: 'block', color: '#C9A84C', fontWeight: '700', fontSize: '18px' }}>R$ {item.price}</span>
                      {item.unit && <span style={{ color: 'rgba(250,246,239,0.4)', fontSize: '12px' }}>por {item.unit}</span>}
                    </div>
                  </div>
                  
                  {item.description && (
                    <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '14px', lineHeight: '1.5', flex: 1, marginBottom: '20px' }}>
                      {item.description}
                    </p>
                  )}

                  <a
                    href={generateWhatsAppLink(activeData.title, item.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'rgba(37,211,102,0.1)',
                      color: '#25D366',
                      border: '1px solid rgba(37,211,102,0.2)',
                      padding: '10px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginTop: item.description ? '0' : 'auto',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(37,211,102,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(37,211,102,0.1)'
                    }}
                  >
                    <MessageCircle size={16} /> Encomendar
                  </a>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
