'use client'
import { USE_MOCK, mockFootTraffic } from '@/lib/mockData'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Footprints, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  RefreshCw,
  X,
  Users,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

interface FootTrafficLog {
  id: string
  count_date: string
  shift: 'shift_1' | 'shift_2'
  hour_slot: number
  customer_count: number
}

export default function FootTrafficPage() {
  const supabase = createClient()
  const [logs, setLogs] = useState<FootTrafficLog[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0])

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [count, setCount] = useState('')
  const [shift, setShift] = useState<'shift_1' | 'shift_2'>('shift_1')
  const [hour, setHour] = useState('8')

  const fetchData = useCallback(async () => {
    if (USE_MOCK) {
      setLogs(mockFootTraffic.hourly.map((h, i) => ({ id: String(i+1), date: new Date().toISOString().split('T')[0], hour: parseInt(h.hour), count: h.count, shift: parseInt(h.hour) < 14 ? 'shift_1' : 'shift_2', created_at: new Date().toISOString() })) as any);
      setLoading(false);
      return
    }
    setLoading(true)
    try {
      const { data } = await supabase
        .from('foot_traffic')
        .select('*')
        .order('count_date', { ascending: false })
        .order('hour_slot', { ascending: true })
      setLogs(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!count || !hour) return

    try {
      const { error } = await supabase
        .from('foot_traffic')
        .upsert({
          count_date: dateFilter,
          shift,
          hour_slot: parseInt(hour),
          customer_count: parseInt(count)
        }, { onConflict: 'count_date,shift,hour_slot' })

      if (error) throw error
      setModalOpen(false)
      setCount('')
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  // Filter logs for today/selected date chart
  const dayLogs = logs.filter(l => l.count_date === dateFilter)
  const chartData = Array.from({ length: 15 }, (_, i) => {
    const hr = i + 7 // 7:00 to 21:00
    const log = dayLogs.find(l => l.hour_slot === hr)
    return {
      hour: `${hr}h`,
      Clientes: log ? log.customer_count : 0
    }
  })

  const totalFootTraffic = dayLogs.reduce((acc, l) => acc + l.customer_count, 0)
  const peakHour = dayLogs.length > 0 
    ? [...dayLogs].sort((a,b) => b.customer_count - a.customer_count)[0] 
    : null

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
            Fluxo Presencial de Clientes
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Mapeamento de visitas de clientes na loja física por hora para redimensionamento de equipe de atendimento.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#1A0F08] border border-white/10 rounded-lg py-2 px-3 text-xs text-[#FAF6EF]"
          />
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <Plus size={14} /> Registrar Contagem
          </button>
          <button
            onClick={fetchData}
            className="p-2.5 rounded-lg border border-white/10 text-neutral-400 hover:text-[#FAF6EF] transition-all bg-white/5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Visitas Hoje (Física)', value: totalFootTraffic, color: '#C9A84C', info: 'Clientes totais' },
          { label: 'Horário de Pico', value: peakHour ? `${peakHour.hour_slot}:00` : 'Sem registros', color: '#10B981', info: peakHour ? `${peakHour.customer_count} visitas` : 'Aguardando' },
          { label: 'Fluxo Turno Manhã', value: dayLogs.filter(l => l.shift === 'shift_1').reduce((s, l) => s + l.customer_count, 0), color: '#3B82F6', info: '7:00 as 12:00' },
          { label: 'Fluxo Turno Tarde/Noite', value: dayLogs.filter(l => l.shift === 'shift_2').reduce((s, l) => s + l.customer_count, 0), color: '#F59E0B', info: '13:00 as 21:00' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/[0.06] bg-[#1A0F08]/40 relative overflow-hidden">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">{item.label}</span>
            <span className="text-base lg:text-lg font-bold text-[#FAF6EF] mt-1 block" style={{ color: item.color, fontFamily: 'var(--font-serif)' }}>{item.value}</span>
            <span className="text-[9px] font-semibold text-neutral-500 mt-2 block">{item.info}</span>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1A0F08]/30 p-5">
        <h3 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase mb-4 flex items-center gap-1.5">
          <Clock size={14} /> Curva de Fluxo do Dia • {new Date(dateFilter).toLocaleDateString('pt-BR')}
        </h3>

        <div className="h-64 w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent animate-spin rounded-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="hour" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#140C08', border: '1px solid rgba(201, 168, 76, 0.15)', borderRadius: '8px', color: '#FAF6EF', fontSize: '11px' }}
                  formatter={(v) => [`${v} clientes`]}
                />
                <Bar dataKey="Clientes" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0F08]/75 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-[#2C1A0E]/95 border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl space-y-4 relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-[#FAF6EF] transition-colors bg-white/5 border border-white/10 rounded-lg p-1.5"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Lançar Visitas</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Registrar Fluxo Presencial</h3>
              <p className="text-[10px] text-neutral-500">Mapeie o movimento físico para escala de atendentes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Faixa Horária</label>
                  <select
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-full bg-[#1A0F08] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  >
                    {Array.from({ length: 15 }, (_, i) => i + 7).map(hr => (
                      <option key={hr} value={hr}>{hr}:00 às {hr + 1}:00</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Contagem Clientes</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    min="0"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Turno</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="w-full bg-[#1A0F08] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="shift_1">Manhã (Shift 1)</option>
                  <option value="shift_2">Tarde / Noite (Shift 2)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase transition-all"
              >
                Upsert Contagem
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
