'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Package, 
  ArrowLeft, 
  Search, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown,
  Layers,
  RefreshCw,
  X
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'

interface StockCategory {
  id: string
  name: string
}

interface StockItem {
  id: string
  name: string
  unit: string
  current_quantity: number
  min_quantity: number
  ideal_quantity: number
  last_purchase_price: number
  expiry_date: string | null
  stock_categories?: StockCategory | null
}

export default function StockPage() {
  const supabase = createClient()
  const [stock, setStock] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [categories, setCategories] = useState<StockCategory[]>([])

  // Modal State for stock adjustments
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [adjustQty, setAdjustQty] = useState('')
  const [adjustType, setAdjustType] = useState<'entry' | 'exit'>('entry')
  const [adjustNotes, setAdjustNotes] = useState('')

  const fetchStock = useCallback(async () => {
    setLoading(true)
    try {
      const { data: stockData, error: stockErr } = await supabase
        .from('stock_items')
        .select(`
          id, name, unit, current_quantity, min_quantity, ideal_quantity, last_purchase_price, expiry_date,
          stock_categories ( id, name )
        `)
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (stockErr) throw stockErr
      setStock((stockData as any) || [])

      // Fetch Categories
      const { data: catData } = await supabase
        .from('stock_categories')
        .select('id, name')
      setCategories(catData || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchStock()
  }, [fetchStock])

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem || !adjustQty) return

    const qtyNum = parseFloat(adjustQty)
    if (isNaN(qtyNum) || qtyNum <= 0) return

    try {
      const quantityChange = adjustType === 'entry' ? qtyNum : -qtyNum
      const newQty = Math.max(0, Number(selectedItem.current_quantity) + quantityChange)

      // 1. Update stock_items
      const { error: itemErr } = await supabase
        .from('stock_items')
        .update({ current_quantity: newQty })
        .eq('id', selectedItem.id)

      if (itemErr) throw itemErr

      // 2. Register movement log
      const { error: logErr } = await supabase
        .from('stock_movements')
        .insert({
          stock_item_id: selectedItem.id,
          type: adjustType,
          quantity: qtyNum,
          unit_cost: selectedItem.last_purchase_price,
          notes: adjustNotes || 'Ajuste manual de estoque'
        })

      if (logErr) throw logErr

      // Reset & Refresh
      setAdjustModalOpen(false)
      setSelectedItem(null)
      setAdjustQty('')
      setAdjustNotes('')
      fetchStock()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredStock = stock.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.stock_categories?.id === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockCount = stock.filter((item) => Number(item.current_quantity) < Number(item.min_quantity)).length

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
            Controle de Estoque 📦
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Gestão de matérias-primas, insumos de panificação, alertas de quebra e compras.
          </p>
        </div>

        <button
          onClick={fetchStock}
          className="p-2.5 rounded-lg border border-white/10 text-neutral-400 hover:text-[#FAF6EF] transition-all bg-white/5 self-end sm:self-center"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Itens Catalogados', value: stock.length, color: '#C9A84C', badge: 'Ativos' },
          { label: 'Matéria-Prima Crítica', value: lowStockCount, color: lowStockCount > 0 ? '#EF4444' : '#10B981', badge: lowStockCount > 0 ? 'Atenção' : 'Excelente' },
          { label: 'Valor em Estoque (Est.)', value: formatCurrency(stock.reduce((acc, i) => acc + (Number(i.current_quantity) * Number(i.last_purchase_price || 0)), 0)), color: '#10B981', badge: 'Ativo Circ.' },
          { label: 'Vencimentos Próximos', value: stock.filter(s => s.expiry_date && new Date(s.expiry_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length, color: '#F59E0B', badge: '7 dias' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/[0.06] bg-[#121212]/40 relative overflow-hidden">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">{item.label}</span>
            <span className="text-base lg:text-lg font-bold text-[#FAF6EF] mt-1 block" style={{ color: item.color, fontFamily: 'var(--font-serif)' }}>{item.value}</span>
            <span className="text-[8px] font-extrabold uppercase mt-2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 w-max block tracking-wide">{item.badge}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.06] bg-[#121212]/20">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar insumos (ex: Farinha, Ovos)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-[#FAF6EF] placeholder-neutral-500 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#C9A84C]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-xs text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C] cursor-pointer"
            >
              <option value="all" className="bg-[#121212]">Todas Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#121212]">{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando insumos...</p>
        </div>
      ) : filteredStock.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border border-white/[0.06] bg-[#121212]/30 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <Package size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhum insumo encontrado</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Experimente mudar os filtros ou cadastre novos ingredientes.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#121212]/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-neutral-400 uppercase text-[9px] tracking-wider font-bold">
                <th className="p-4">Insumo</th>
                <th className="p-4">Categoria</th>
                <th className="p-4 text-right">Qtd Atual</th>
                <th className="p-4 text-right">Qtd Mínima</th>
                <th className="p-4 text-right">Qtd Ideal</th>
                <th className="p-4 text-right">Preço Compra</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Movimentar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-xs text-neutral-300">
              {filteredStock.map((item) => {
                const isLow = Number(item.current_quantity) < Number(item.min_quantity)
                return (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-semibold text-[#E8E8E8]">{item.name}</td>
                    <td className="p-4 text-neutral-400">{item.stock_categories?.name || 'Insumo Geral'}</td>
                    <td className="p-4 text-right font-mono font-bold text-[#FAF6EF]">
                      {item.current_quantity} <span className="text-[10px] text-neutral-500 lowercase">{item.unit}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-neutral-400">
                      {item.min_quantity} <span className="text-[10px] text-neutral-600 lowercase">{item.unit}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-neutral-400">
                      {item.ideal_quantity} <span className="text-[10px] text-neutral-600 lowercase">{item.unit}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-neutral-400">
                      {formatCurrency(item.last_purchase_price)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        isLow ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {isLow ? 'Crítico' : 'Normal'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setAdjustModalOpen(true)
                        }}
                        className="p-1 px-2.5 rounded border border-[#C9A84C]/20 text-[10px] text-[#C9A84C] font-semibold hover:bg-[#C9A84C]/10 transition-all bg-transparent"
                      >
                        Ajustar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust Inventory Modal */}
      {adjustModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-[#160D09]/95 border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl space-y-4 relative"
          >
            <button
              onClick={() => {
                setAdjustModalOpen(false)
                setSelectedItem(null)
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-[#FAF6EF] transition-colors bg-white/5 border border-white/10 rounded-lg p-1.5"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Lançamento de Estoque</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">{selectedItem.name}</h3>
              <p className="text-[10px] text-neutral-500">Saldo atual: {selectedItem.current_quantity} {selectedItem.unit}</p>
            </div>

            <form onSubmit={handleAdjust} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Tipo de Movimentação</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('entry')}
                    className={`py-2 rounded-lg font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      adjustType === 'entry'
                        ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                        : 'border-white/10 text-neutral-400 bg-transparent'
                    }`}
                  >
                    <Plus size={14} /> Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('exit')}
                    className={`py-2 rounded-lg font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      adjustType === 'exit'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'border-white/10 text-neutral-400 bg-transparent'
                    }`}
                  >
                    <TrendingDown size={14} /> Retirada / CMV
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Quantidade ({selectedItem.unit})</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  placeholder="0.00"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Observações</label>
                <textarea
                  placeholder="Ex: Nota fiscal Nº 481, quebra, validade..."
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C] h-16 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase shadow-lg hover:shadow-xl transition-all"
              >
                Confirmar Lançamento
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
