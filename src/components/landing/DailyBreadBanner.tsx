'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Flame } from 'lucide-react'

const WHATSAPP_PHONE = '5511976535789'

interface DailyBread {
  id: string
  name: string
  description: string
  price: number
  image_url: string
}

export default function DailyBreadBanner() {
  const [bread, setBread] = useState<DailyBread | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDailyBread() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('daily_bread')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!error && data) {
        setBread(data)
      }
      setLoading(false)
    }

    fetchDailyBread()
  }, [])

  if (loading || !bread) return null

  const handleWhatsApp = () => {
    const msg = `Quero esse! O Pão do dia: ${bread.name}`
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(26,15,8,0.9))',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        borderTop: '1px solid rgba(201,168,76,0.2)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {bread.image_url && (
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundImage: `url(${bread.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '2px solid #C9A84C',
                flexShrink: 0,
              }}
            />
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EA580C', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Flame size={14} />
              <span>Saiu do forno hoje:</span>
            </div>
            <h3 style={{ margin: '4px 0 0', color: '#FAF6EF', fontSize: '20px', fontFamily: 'var(--font-playfair)', fontWeight: '700' }}>
              {bread.name} <span style={{ color: '#C9A84C', fontSize: '18px' }}>— R$ {bread.price.toFixed(2).replace('.', ',')}</span>
            </h3>
            <p style={{ margin: '2px 0 0', color: 'rgba(250,246,239,0.7)', fontSize: '13px', maxWidth: '400px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {bread.description}
            </p>
          </div>
        </div>

        <button
          onClick={handleWhatsApp}
          style={{
            background: '#C9A84C',
            color: '#1A0F08',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            fontWeight: '800',
            fontSize: '14px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all 0.2s',
            boxShadow: '0 4px 14px rgba(201,168,76,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(201,168,76,0.3)'
          }}
        >
          Quero esse!
        </button>
      </div>
    </motion.div>
  )
}
