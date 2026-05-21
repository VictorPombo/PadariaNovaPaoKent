'use client'
import { USE_MOCK, mockAlerts } from '@/lib/mockData'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Check, 
  Trash2, 
  RefreshCw, 
  ArrowLeft,
  Bell
} from 'lucide-react'
import Link from 'next/link'

interface SystemAlert {
  id: string
  severity: 'critical' | 'warning' | 'positive' | 'info'
  title: string
  message: string
  type: string
  is_read: boolean
  is_dismissed: boolean
  created_at: string
}

export default function AlertsPage() {
  const supabase = createClient()
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'warning'>('unread')

  const fetchAlerts = useCallback(async () => {
    if (USE_MOCK) { setAlerts(mockAlerts as any); setLoading(false); return }
    setLoading(true)
    try {
      let query = supabase
        .from('system_alerts')
        .select('*')
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setAlerts(data || [])
    } catch (err) {
      console.error('Erro ao buscar alertas:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({ is_read: true })
        .eq('id', id)
      if (error) throw error
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)))
    } catch (err) {
      console.error(err)
    }
  }

  const dismissAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({ is_dismissed: true })
        .eq('id', id)
      if (error) throw error
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const markAllRead = async () => {
    try {
      const { error } = await supabase
        .from('system_alerts')
        .update({ is_read: true })
        .eq('is_read', false)
      if (error) throw error
      setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })))
    } catch (err) {
      console.error(err)
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unread') return !alert.is_read
    if (filter === 'critical') return alert.severity === 'critical'
    if (filter === 'warning') return alert.severity === 'warning'
    return true
  })

  const alertColors = {
    critical: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.25)', text: '#F87171', icon: AlertTriangle },
    warning: { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.25)', text: '#FBBF24', icon: AlertCircle },
    positive: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.25)', text: '#34D399', icon: CheckCircle },
    info: { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.25)', text: '#60A5FA', icon: Info }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/dashboard" className="text-[#C9A84C] hover:underline flex items-center gap-1 text-xs">
              <ArrowLeft size={12} /> Dashboard
            </Link>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#FAF6EF]" style={{ fontFamily: 'var(--font-serif)' }}>
            Central de Alertas
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Acompanhe ocorrências, falhas e notificações de estoque e vendas em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            disabled={loading || alerts.filter(a => !a.is_read).length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#C9A84C]/20 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={14} />
            <span>Lido todos</span>
          </button>
          <button
            onClick={fetchAlerts}
            className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-[#FAF6EF] transition-all bg-white/5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="flex flex-wrap gap-2 p-1 bg-white/[0.02] border border-white/10 rounded-xl max-w-md">
        {[
          { key: 'unread', label: 'Não Lidos' },
          { key: 'all', label: 'Todos Ativos' },
          { key: 'critical', label: 'Críticos' },
          { key: 'warning', label: 'Avisos' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === tab.key
                ? 'bg-[#C9A84C] text-[#2C1A0E] font-bold'
                : 'text-neutral-400 hover:text-[#FAF6EF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table & Alert Box */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando notificações...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border border-white/[0.06] bg-[#1A0F08]/30 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <Bell size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhum alerta pendente</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Parabéns! Tudo está funcionando dentro dos parâmetros ideais da Padaria Nova Paokent.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredAlerts.map((alert, idx) => {
            const config = alertColors[alert.severity] || alertColors.info
            const Icon = config.icon
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg"
                style={{
                  background: config.bg,
                  borderColor: config.border,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${config.border}` }}
                >
                  <Icon size={20} style={{ color: config.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-[#FAF6EF]">{alert.title}</h3>
                    <span
                      className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${config.border}`,
                        color: config.text
                      }}
                    >
                      {alert.type}
                    </span>
                    {!alert.is_read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    {alert.message}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-2">
                    {new Date(alert.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!alert.is_read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="p-1.5 rounded-lg border border-white/5 hover:border-[#C9A84C]/30 text-neutral-400 hover:text-[#C9A84C] transition-all bg-white/5"
                      title="Marcar como lido"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1.5 rounded-lg border border-white/5 hover:border-red-500/30 text-neutral-400 hover:text-red-400 transition-all bg-white/5"
                    title="Dispensar alerta"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
