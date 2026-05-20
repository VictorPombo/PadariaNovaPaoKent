'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Calendar,
  Camera,
  Utensils,
  Trash2,
  UserPlus,
  Bike,
  Plus,
  Smartphone
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface SystemAlert {
  id: string
  title: string
  message: string
  severity: 'critical' | 'warning' | 'positive' | 'info'
  created_at: string
}

interface DashboardClientProps {
  data: {
    revenueToday: number
    revenueMonth: number
    ordersToday: number
    avgTicket: number
    ifoordOrders: number
    ownDelivery: number
    goal: number
    goalProgress: number
    alerts: SystemAlert[]
    alertCount: number
  }
}

// Stagger entry animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])



  // 7 Days Mock Trend Data
  const mockTrendData = [
    { day: 'Ter', faturamento: 4200 },
    { day: 'Qua', faturamento: 4800 },
    { day: 'Qui', faturamento: 4500 },
    { day: 'Sex', faturamento: 5800 },
    { day: 'Sáb', faturamento: 7200 },
    { day: 'Dom', faturamento: 8100 },
    { day: 'Seg', faturamento: data.revenueToday || 4900 }
  ]

  // Dynamic Sales Channels Pie calculation
  const ifoodCount = data.ifoordOrders || 0
  const deliveryCount = data.ownDelivery || 0
  const totalOrders = data.ordersToday || 0
  const remainingOrders = Math.max(0, totalOrders - ifoodCount - deliveryCount)
  const counterCount = Math.round(remainingOrders * 0.6)
  const diningCount = Math.max(0, remainingOrders - counterCount)

  const rawChannelData = [
    { name: 'Balcão', value: counterCount, color: '#f59e0b' }, // amber-500
    { name: 'Delivery Próprio', value: deliveryCount, color: '#d97706' }, // amber-600
    { name: 'Saída', value: diningCount, color: '#fef08a' }, // yellow-200
    { name: 'iFood', value: ifoodCount, color: '#ef4444' } // iFood red
  ]

  const channelData = rawChannelData.some((item) => item.value > 0)
    ? rawChannelData.filter((item) => item.value > 0)
    : [
        { name: 'Balcão', value: 20, color: '#f59e0b' },
        { name: 'Delivery Próprio', value: 10, color: '#d97706' },
        { name: 'Saída', value: 5, color: '#fef08a' },
        { name: 'iFood', value: 15, color: '#ef4444' },
      ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans pb-10 relative z-10 text-neutral-100"
    >
      {/* 1. Header do Dashboard */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-100">
            Painel Gerencial
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Visão consolidada da operação, metas e métricas financeiras.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            Operação Online
          </span>
        </div>
      </motion.div>

      {/* 2. Meta do Dia */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-sm"
      >
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Meta do Dia</span>
          <span className="text-lg font-bold text-neutral-100 mt-0.5 whitespace-nowrap">{formatCurrency(data.revenueToday)}</span>
        </div>
        
        <div className="flex-1 h-[8px] bg-neutral-950 border border-neutral-800 rounded-full overflow-hidden relative self-center w-full">
           <div 
             className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full relative" 
             style={{ width: `${Math.min(data.goalProgress, 100)}%` }}
           >
             {/* Shimmer effect */}
             <div 
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" 
               style={{ 
                 backgroundSize: '200% 100%', 
                 animation: 'shimmer-effect 2.5s infinite linear' 
               }} 
             />
           </div>
        </div>
        
        <div className="flex flex-col items-start sm:items-end min-w-0">
          <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest">Progresso</span>
          <span className="text-xs text-neutral-300 font-semibold mt-0.5 whitespace-nowrap">
            {data.goalProgress.toFixed(0)}% de {formatCurrency(data.goal)}
          </span>
        </div>
      </motion.div>

      {/* 3. KPI Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Card 1: Faturamento */}
        <Link
          href="/admin/revenue"
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-neutral-700 transition-colors group outline-none"
          style={{ textDecoration: 'none' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Faturamento Hoje</p>
              <h3 className="text-3xl font-bold text-neutral-50 tracking-tight mt-2 truncate">
                {formatCurrency(data.revenueToday)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-500">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-medium text-neutral-500">Turno atual em andamento</p>
        </Link>

        {/* Card 2: Pedidos */}
        <Link
          href="/admin/orders"
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-neutral-700 transition-colors group outline-none"
          style={{ textDecoration: 'none' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Pedidos Hoje</p>
              <h3 className="text-3xl font-bold text-neutral-50 tracking-tight mt-2 truncate">
                {data.ordersToday}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-500">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-medium text-neutral-500 truncate">
            {data.ifoordOrders} iFood • {data.ownDelivery} delivery
          </p>
        </Link>

        {/* Card 3: Ticket Médio */}
        <Link
          href="/admin/revenue"
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-neutral-700 transition-colors group outline-none"
          style={{ textDecoration: 'none' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ticket Médio</p>
              <h3 className="text-3xl font-bold text-neutral-50 tracking-tight mt-2 truncate">
                {formatCurrency(data.avgTicket)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-medium text-neutral-500">Média por venda hoje</p>
        </Link>

        {/* Card 4: Faturamento Mês */}
        <Link
          href="/admin/revenue"
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:border-neutral-700 transition-colors group outline-none"
          style={{ textDecoration: 'none' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Faturamento Mês</p>
              <h3 className="text-3xl font-bold text-neutral-50 tracking-tight mt-2 truncate">
                {formatCurrency(data.revenueMonth)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-500">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-medium text-neutral-500">Acumulado do mês atual</p>
        </Link>
      </motion.div>

      {/* 4. Charts Section */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Chart: Revenue Area Chart */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-neutral-100">
                Análise de Vendas
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">Faturamento dos últimos 7 dias operacionais</p>
            </div>
            <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Semanal
            </span>
          </div>

          <div className="h-56 w-full pr-2">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartAmber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#525252"
                    fontSize={10}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#525252"
                    fontSize={10}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={() => ''}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#171717',
                      border: '1px solid #262626',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#f5f5f5',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#f59e0b', fontWeight: 600 }}
                    formatter={(v) => [`R$ ${v}`, 'Faturamento']}
                    labelFormatter={(label) => `Dia: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="faturamento"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#chartAmber)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Chart: Channel distribution Donut Chart */}
        <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-100">
              Canais de Venda
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">Distribuição do volume hoje</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center my-4">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#171717"
                    strokeWidth={2}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#171717',
                      border: '1px solid #262626',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#f5f5f5',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                    }}
                    formatter={(value) => [`${value} pedidos`]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={6}
                    wrapperStyle={{ fontSize: '10px', color: '#a3a3a3', paddingTop: '10px' }}
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </motion.div>

      {/* 5. Ações Rápidas */}
      <motion.div variants={itemVariants} className="pt-2">
        <h3 className="text-[10px] font-extrabold text-neutral-400 tracking-widest uppercase mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: '/admin/stock', label: 'Entrada de Estoque', icon: Camera },
            { href: '/admin/production', label: 'Produção do Turno', icon: Utensils },
            { href: '/admin/waste', label: 'Registrar Desperdício', icon: Trash2 },
            { href: '/admin/foot-traffic', label: 'Contar Clientes', icon: UserPlus }
          ].map((action, idx) => {
            const Icon = action.icon
            return (
              <Link
                key={idx}
                href={action.href}
                className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer group outline-none"
                style={{ textDecoration: 'none' }}
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-xs text-neutral-300 font-semibold text-center mt-1 group-hover:text-neutral-100 transition-colors truncate w-full px-1">
                  {action.label}
                </span>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Keyframe simulation in TSX */}
      <style>{`
        @keyframes shimmer-effect {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  )
}
