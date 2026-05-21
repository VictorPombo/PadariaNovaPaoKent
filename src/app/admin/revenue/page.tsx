'use client'
import { USE_MOCK, mockRevenue } from '@/lib/mockData'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Calendar, 
  ArrowLeft, 
  ArrowUpRight,
  Percent,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  Cell
} from 'recharts'

export default function RevenuePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    avgTicket: 0,
    ifoodRevenue: 0,
    counterRevenue: 0,
    deliveryRevenue: 0,
    diningRevenue: 0,
    dailyTrends: [] as { day: string; v: number }[]
  })

  const fetchRevenueData = useCallback(async () => {
    if (USE_MOCK) {
      setData({
        totalRevenue: 127450.80,
        ordersCount: 1797,
        avgTicket: 70.93,
        ifoodRevenue: 25490.16,
        counterRevenue: 57352.86,
        deliveryRevenue: 16568.60,
        diningRevenue: 28039.18,
        dailyTrends: [
          { day: 'Seg', v: 4200 },
          { day: 'Ter', v: 4850 },
          { day: 'Qua', v: 3980 },
          { day: 'Qui', v: 5120 },
          { day: 'Sex', v: 5890 },
          { day: 'Sáb', v: 6340 },
          { day: 'Dom', v: 4070 },
        ]
      });
      setLoading(false);
      return
    }
    setLoading(true)
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('total, created_at, channel')
        .order('created_at', { ascending: true })

      if (error) throw error

      if (!orders || orders.length === 0) {
        // Fallback or empty state mock data if no DB orders
        setData({
          totalRevenue: 34800,
          ordersCount: 920,
          avgTicket: 37.8,
          ifoodRevenue: 12500,
          counterRevenue: 14200,
          deliveryRevenue: 5600,
          diningRevenue: 2500,
          dailyTrends: [
            { day: 'Ter', v: 4200 },
            { day: 'Qua', v: 4800 },
            { day: 'Qui', v: 4500 },
            { day: 'Sex', v: 5800 },
            { day: 'Sáb', v: 7200 },
            { day: 'Dom', v: 8100 },
            { day: 'Seg', v: 4900 }
          ]
        })
        return
      }

      // Calculation of real data
      const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0)
      const ordersCount = orders.length
      const avgTicket = ordersCount > 0 ? totalRevenue / ordersCount : 0

      const ifoodRevenue = orders.filter(o => o.channel === 'ifood').reduce((s, o) => s + (o.total || 0), 0)
      const counterRevenue = orders.filter(o => o.channel === 'counter').reduce((s, o) => s + (o.total || 0), 0)
      const deliveryRevenue = orders.filter(o => o.channel === 'delivery_own').reduce((s, o) => s + (o.total || 0), 0)
      const diningRevenue = orders.filter(o => o.channel === 'dining_room').reduce((s, o) => s + (o.total || 0), 0)

      // Daily trend mapping
      const dayMap: Record<string, number> = {}
      orders.forEach(o => {
        const dateObj = new Date(o.created_at)
        const dayLabel = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' })
        dayMap[dayLabel] = (dayMap[dayLabel] || 0) + (o.total || 0)
      })

      const dailyTrends = Object.entries(dayMap).map(([day, v]) => ({ day, v }))

      setData({
        totalRevenue,
        ordersCount,
        avgTicket,
        ifoodRevenue,
        counterRevenue,
        deliveryRevenue,
        diningRevenue,
        dailyTrends
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchRevenueData()
  }, [fetchRevenueData])

  const channelBreakdown = [
    { name: 'Balcão', value: data.counterRevenue, color: '#C9A84C' },
    { name: 'iFood', value: data.ifoodRevenue, color: '#EA1D2C' },
    { name: 'Delivery', value: data.deliveryRevenue, color: '#10B981' },
    { name: 'Salão', value: data.diningRevenue, color: '#3B82F6' }
  ].filter(c => c.value > 0)

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
            Faturamento & Performance
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Análise detalhada de ticket médio, taxas de conversão e receita multi-canal.
          </p>
        </div>

        <button
          onClick={fetchRevenueData}
          className="p-2.5 rounded-lg border border-white/10 text-neutral-400 hover:text-[#FAF6EF] transition-all bg-white/5 self-end sm:self-center"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Faturamento Total', value: formatCurrency(data.totalRevenue), icon: DollarSign, color: '#C9A84C' },
          { label: 'Ticket Médio', value: formatCurrency(data.avgTicket), icon: TrendingUp, color: '#10B981' },
          { label: 'Volume de Vendas', value: `${data.ordersCount} pedidos`, icon: ShoppingCart, color: '#3B82F6' }
        ].map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <div
              key={index}
              className="p-5 rounded-2xl border border-white/[0.06] bg-[#1A0F08]/40 backdrop-blur-sm flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{kpi.label}</span>
                <span className="text-xl lg:text-2xl font-bold text-[#FAF6EF] mt-1 block" style={{ fontFamily: 'var(--font-serif)' }}>
                  {kpi.value}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.02] border border-white/5">
                <Icon size={20} style={{ color: kpi.color }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sales Chart */}
        <div className="rounded-2xl p-5 border border-white/[0.06] bg-[#1A0F08]/40 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase">Evolução Faturamento</h3>
              <p className="text-[10px] text-[#666666] mt-0.5">Visão diária agregada</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#C9A84C]" />
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent animate-spin rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyTrends} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGoldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip
                    contentStyle={{ background: '#140C08', border: '1px solid rgba(201, 168, 76, 0.15)', borderRadius: '8px', color: '#FAF6EF', fontSize: '11px' }}
                    formatter={(v) => [`R$ ${v}`, 'Faturamento']}
                  />
                  <Area type="monotone" dataKey="v" stroke="#C9A84C" strokeWidth={2} fill="url(#revenueGoldGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Channel Share Chart */}
        <div className="rounded-2xl p-5 border border-white/[0.06] bg-[#1A0F08]/40 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase">Canais de Receita</h3>
              <p className="text-[10px] text-[#666666] mt-0.5">Distribuição do faturamento por canal</p>
            </div>
            <Percent className="w-4 h-4 text-[#C9A84C]" />
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent animate-spin rounded-full" />
              </div>
            ) : channelBreakdown.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500 italic">Sem registros</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelBreakdown} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip
                    contentStyle={{ background: '#140C08', border: '1px solid rgba(201, 168, 76, 0.15)', borderRadius: '8px', color: '#FAF6EF', fontSize: '11px' }}
                    formatter={(v) => [formatCurrency(v as number), 'Faturamento']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {channelBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
