'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  ChevronRight, 
  X, 
  DollarSign,
  ArrowLeft,
  RefreshCw,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface Customer {
  full_name: string
  phone: string
}

interface OrderItem {
  id: string
  item_name: string
  quantity: number
  unit_price: number
  size: string
}

interface Order {
  id: string
  channel: 'counter' | 'dining_room' | 'delivery_own' | 'ifood'
  shift: 'shift_1' | 'shift_2'
  subtotal: number
  discount: number
  delivery_fee: number
  total: number
  payment_method: 'cash' | 'credit' | 'debit' | 'pix' | 'other'
  created_at: string
  customers?: Customer | null
  order_items?: OrderItem[]
}

const channelLabels = {
  counter: { label: 'Balcão', bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
  dining_room: { label: 'Salão', bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' },
  delivery_own: { label: 'Delivery Próprio', bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
  ifood: { label: 'iFood', bg: 'rgba(234, 29, 44, 0.1)', text: '#EA1D2C' }
}

const paymentLabels = {
  cash: 'Dinheiro',
  credit: 'Crédito',
  debit: 'Débito',
  pix: 'PIX',
  other: 'Outro'
}

export default function OrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, channel, shift, subtotal, discount, delivery_fee, total, payment_method, created_at,
          customers ( full_name, phone ),
          order_items ( id, item_name, quantity, unit_price, size )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders((data as any) || [])
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customers?.full_name?.toLowerCase() || 'balcão'
    const matchesSearch = customerName.includes(search.toLowerCase()) || order.id.includes(search)
    const matchesChannel = channelFilter === 'all' || order.channel === channelFilter
    return matchesSearch && matchesChannel
  })

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
            Gerenciador de Pedidos 🛒
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Controle de fluxo de vendas, integração multi-canal e faturamento ao vivo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-lg border border-white/10 text-neutral-400 hover:text-[#FAF6EF] transition-all bg-white/5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Pedidos', value: filteredOrders.length, color: '#C9A84C' },
          { label: 'Faturamento Filtro', value: formatCurrency(filteredOrders.reduce((acc, o) => acc + o.total, 0)), color: '#10B981' },
          { label: 'Ticket Médio', value: formatCurrency(filteredOrders.length > 0 ? filteredOrders.reduce((acc, o) => acc + o.total, 0) / filteredOrders.length : 0), color: '#3B82F6' },
          { label: 'Descontos Aplicados', value: formatCurrency(filteredOrders.reduce((acc, o) => acc + (o.discount || 0), 0)), color: '#EF4444' }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-white/[0.06] bg-[#121212]/40"
          >
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">{stat.label}</span>
            <span className="text-base lg:text-lg font-bold text-[#FAF6EF] mt-1 block" style={{ color: stat.color }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.06] bg-[#121212]/20">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar por cliente ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-[#FAF6EF] placeholder-neutral-500 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          {/* Channel Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#C9A84C]" />
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-xs text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C] cursor-pointer"
            >
              <option value="all" className="bg-[#121212]">Todos Canais</option>
              <option value="counter" className="bg-[#121212]">Balcão</option>
              <option value="dining_room" className="bg-[#121212]">Salão</option>
              <option value="delivery_own" className="bg-[#121212]">Delivery Próprio</option>
              <option value="ifood" className="bg-[#121212]">iFood</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando pedidos...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border border-white/[0.06] bg-[#121212]/30 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <ShoppingCart size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhum pedido encontrado</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Experimente mudar os filtros ou adicione uma venda no caixa.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#121212]/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-neutral-400 uppercase text-[9px] tracking-wider font-bold">
                <th className="p-4">Código / Data</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Canal</th>
                <th className="p-4">Turno</th>
                <th className="p-4">Pagamento</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-xs text-neutral-300">
              {filteredOrders.map((order) => {
                const ch = channelLabels[order.channel] || { label: order.channel, bg: 'rgba(255,255,255,0.05)', text: '#FAF6EF' }
                return (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4">
                      <p className="font-mono text-[10px] text-[#C9A84C] font-semibold">#{order.id.slice(0, 8)}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-[#E8E8E8]">{order.customers?.full_name || 'Balcão (Geral)'}</p>
                      {order.customers?.phone && (
                        <p className="text-[10px] text-neutral-500 mt-0.5">{order.customers.phone}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-bold"
                        style={{ background: ch.bg, color: ch.text }}
                      >
                        {ch.label}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">
                      {order.shift === 'shift_1' ? '1º Turno (Manhã)' : '2º Turno (Tarde/Noite)'}
                    </td>
                    <td className="p-4 font-medium text-neutral-400">
                      {paymentLabels[order.payment_method] || order.payment_method}
                    </td>
                    <td className="p-4 text-right font-extrabold text-[#FAF6EF]">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg border border-white/5 hover:border-[#C9A84C]/30 text-neutral-400 hover:text-[#C9A84C] transition-all bg-white/5 inline-flex items-center justify-center"
                        title="Ver Detalhes"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#160D09]/95 border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl space-y-4 overflow-hidden relative"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-[#FAF6EF] transition-colors bg-white/5 border border-white/10 rounded-lg p-1.5"
              >
                <X size={16} />
              </button>

              <div>
                <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Detalhes do Pedido</span>
                <h3 className="font-mono text-sm font-bold text-[#FAF6EF] mt-1">#{selectedOrder.id}</h3>
                <p className="text-[11px] text-neutral-500">{new Date(selectedOrder.created_at).toLocaleString('pt-BR')}</p>
              </div>

              <div className="border-t border-b border-white/10 py-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Cliente:</span>
                  <span className="font-semibold text-[#E8E8E8]">{selectedOrder.customers?.full_name || 'Balcão (Geral)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Canal de Venda:</span>
                  <span className="font-semibold" style={{ color: channelLabels[selectedOrder.channel]?.text }}>
                    {channelLabels[selectedOrder.channel]?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Método Pagamento:</span>
                  <span className="font-semibold text-neutral-200">{paymentLabels[selectedOrder.payment_method]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Turno de Venda:</span>
                  <span className="font-semibold text-neutral-300">
                    {selectedOrder.shift === 'shift_1' ? 'Turno Matutino' : 'Turno Vespertino/Noturno'}
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Itens Solicitados</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                    selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs p-2 rounded bg-white/[0.02] border border-white/5">
                        <div>
                          <p className="font-semibold text-[#FAF6EF]">{item.item_name}</p>
                          {item.size && (
                            <p className="text-[9px] text-neutral-500 mt-0.5">Tamanho: {item.size === 'small' ? 'Padrão/Pequeno' : 'Grande'}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#E8E8E8]">{item.quantity}x</p>
                          <p className="text-[10px] text-neutral-400">{formatCurrency(item.unit_price)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500 italic">Sem itens detalhados gravados.</p>
                  )}
                </div>
              </div>

              {/* Financial Recap */}
              <div className="border-t border-white/10 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Desconto:</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                {selectedOrder.delivery_fee > 0 && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Taxa de Entrega:</span>
                    <span>+{formatCurrency(selectedOrder.delivery_fee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-[#FAF6EF] pt-1.5 border-t border-white/5">
                  <span>Faturamento Líquido:</span>
                  <span className="text-[#10B981]">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
