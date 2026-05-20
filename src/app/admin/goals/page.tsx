'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Target, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  TrendingUp, 
  RefreshCw,
  X,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SalesGoal {
  id: string
  period_type: 'daily' | 'weekly' | 'monthly'
  channel: string | null
  target_amount: number
  start_date: string
  end_date: string
}

export default function GoalsPage() {
  const supabase = createClient()
  const [goals, setGoals] = useState<SalesGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [currentRevenueToday, setCurrentRevenueToday] = useState(0)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [targetAmount, setTargetAmount] = useState('')
  const [periodType, setPeriodType] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('sales_goals')
        .select('*')
        .order('start_date', { ascending: false })
      setGoals(data || [])

      // Fetch today revenue to check daily goal progress
      const todayStr = new Date().toISOString().split('T')[0]
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('total')
        .gte('created_at', `${todayStr}T00:00:00`)
        .lte('created_at', `${todayStr}T23:59:59`)

      const rev = todayOrders?.reduce((acc, o) => acc + o.total, 0) || 0
      setCurrentRevenueToday(rev)
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
    if (!targetAmount || !startDate || !endDate) return

    try {
      const { error } = await supabase
        .from('sales_goals')
        .insert({
          period_type: periodType,
          target_amount: parseFloat(targetAmount),
          start_date: startDate,
          end_date: endDate
        })

      if (error) throw error
      setModalOpen(false)
      setTargetAmount('')
      fetchData()
    } catch (err) {
      console.error(err)
    }
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
            Metas & Alvos Faturamento 🎯
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Definição de alvos comerciais diários, semanais e mensais da Padaria Nova Paokent.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <Plus size={14} /> Estipular Meta
          </button>
          <button
            onClick={fetchData}
            className="p-2.5 rounded-lg border border-white/10 text-neutral-400 hover:text-[#FAF6EF] transition-all bg-white/5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Goal Board Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando metas comerciais...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border border-white/[0.06] bg-[#121212]/30 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <Target size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhuma meta estipulada</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Abra a estipulação de metas e defina marcos contábeis para motivar seu time de vendas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const isDaily = goal.period_type === 'daily'
            // Calculate progress estimation
            const current = isDaily ? currentRevenueToday : currentRevenueToday * 4 // mockup estimation for longer periods
            const progress = Math.min((current / Number(goal.target_amount)) * 100, 100)

            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl border border-[#C9A84C]/20 bg-[#121212]/40 relative flex flex-col justify-between hover:border-[#C9A84C]/45 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-[#C9A84C]/35 bg-[#C9A84C]/10 text-[#C9A84C] uppercase tracking-wider">
                      Meta {goal.period_type === 'daily' ? 'Diária' : goal.period_type === 'weekly' ? 'Semanal' : 'Mensal'}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      Até {new Date(goal.end_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h3
                    className="text-lg lg:text-xl font-bold text-[#FAF6EF] mt-3"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {formatCurrency(goal.target_amount)}
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Março de execução: de {new Date(goal.start_date).toLocaleDateString('pt-BR')}
                  </p>

                  {/* Progress Indicator */}
                  <div className="space-y-1.5 mt-5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-neutral-500">Progresso Estimado:</span>
                      <span className="font-bold text-[#C9A84C]">{progress.toFixed(0)}% ({formatCurrency(current)})</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full bg-[#C9A84C]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-[#160D09]/95 border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl space-y-4 relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-[#FAF6EF] transition-colors bg-white/5 border border-white/10 rounded-lg p-1.5"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Estipular Meta</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Definir Marco Comercial</h3>
              <p className="text-[10px] text-neutral-500">Configure alvos comerciais em reais.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Período Contábil</label>
                <select
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value as any)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="daily">Faturamento Diário</option>
                  <option value="weekly">Faturamento Semanal</option>
                  <option value="monthly">Faturamento Mensal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Valor Alvo (R$)</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Data Inicial</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Data Final</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase transition-all"
              >
                Lançar Nova Meta
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
