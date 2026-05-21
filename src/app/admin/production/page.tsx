'use client'
import { USE_MOCK, mockProduction } from '@/lib/mockData'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  ChefHat, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Sparkles, 
  Trash2,
  RefreshCw,
  X
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface MenuItem {
  id: string
  name: string
}

interface ProductionLog {
  id: string
  item_name: string
  shift: 'shift_1' | 'shift_2'
  production_date: string
  quantity_produced: number
  quantity_sold: number
  leftover_cost: number
  created_at: string
}

export default function ProductionPage() {
  const supabase = createClient()
  const [logs, setLogs] = useState<ProductionLog[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  // Register Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMenuItemId, setSelectedMenuItemId] = useState('')
  const [qtyProduced, setQtyProduced] = useState('')
  const [qtySold, setQtySold] = useState('')
  const [shift, setShift] = useState<'shift_1' | 'shift_2'>('shift_1')
  const [prodDate, setProdDate] = useState(new Date().toISOString().split('T')[0])

  const fetchData = useCallback(async () => {
    if (USE_MOCK) {
      const today = new Date().toISOString().split('T')[0]
      setLogs([
        { id: '1', item_name: 'Pão Francês', shift: 'shift_1', production_date: today, quantity_produced: 480, quantity_sold: 465, leftover_cost: 22.50, created_at: `${today}T06:30:00` },
        { id: '2', item_name: 'Baguete', shift: 'shift_1', production_date: today, quantity_produced: 78, quantity_sold: 72, leftover_cost: 36.00, created_at: `${today}T06:45:00` },
        { id: '3', item_name: 'Pão de Queijo', shift: 'shift_1', production_date: today, quantity_produced: 195, quantity_sold: 190, leftover_cost: 12.50, created_at: `${today}T07:00:00` },
        { id: '4', item_name: 'Croissant', shift: 'shift_1', production_date: today, quantity_produced: 58, quantity_sold: 55, leftover_cost: 18.00, created_at: `${today}T07:15:00` },
        { id: '5', item_name: 'Bolo de Chocolate', shift: 'shift_1', production_date: today, quantity_produced: 8, quantity_sold: 6, leftover_cost: 24.00, created_at: `${today}T08:00:00` },
        { id: '6', item_name: 'Bisnaga', shift: 'shift_2', production_date: today, quantity_produced: 115, quantity_sold: 108, leftover_cost: 10.50, created_at: `${today}T14:30:00` },
        { id: '7', item_name: 'Pão Integral', shift: 'shift_2', production_date: today, quantity_produced: 58, quantity_sold: 52, leftover_cost: 15.00, created_at: `${today}T15:00:00` },
      ] as any)
      setMenuItems([
        { id: '1', name: 'Pão Francês' }, { id: '2', name: 'Baguete' }, { id: '3', name: 'Pão de Queijo' },
        { id: '4', name: 'Croissant' }, { id: '5', name: 'Bolo de Chocolate' }, { id: '6', name: 'Bisnaga' },
        { id: '7', name: 'Pão Integral' }, { id: '8', name: 'Broa de Milho' }, { id: '9', name: 'Ciabatta' },
      ])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data: logsData } = await supabase
        .from('production_logs')
        .select('*')
        .order('production_date', { ascending: false })
      setLogs(logsData || [])

      const { data: items } = await supabase
        .from('menu_items')
        .select('id, name')
        .eq('is_active', true)
      setMenuItems(items || [])
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
    if (!selectedMenuItemId || !qtyProduced) return

    const menuItem = menuItems.find(i => i.id === selectedMenuItemId)
    if (!menuItem) return

    try {
      const producedNum = parseInt(qtyProduced)
      const soldNum = qtySold ? parseInt(qtySold) : 0

      const { error } = await supabase
        .from('production_logs')
        .insert({
          menu_item_id: selectedMenuItemId,
          item_name: menuItem.name,
          quantity_produced: producedNum,
          quantity_sold: soldNum,
          shift,
          production_date: prodDate
        })

      if (error) throw error

      setModalOpen(false)
      setSelectedMenuItemId('')
      setQtyProduced('')
      setQtySold('')
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
            Produção do Turno
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Acompanhe o lote de pães, salgados, doces assados e otimize as fornadas por turno.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <Plus size={14} /> Registrar Fornada
          </button>
          <button
            onClick={fetchData}
            className="p-2.5 rounded-lg border border-white/10 text-neutral-400 hover:text-[#FAF6EF] transition-all bg-white/5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Unidades Assadas (Hoje)', value: logs.reduce((acc, l) => acc + l.quantity_produced, 0), color: '#C9A84C', info: 'Volume fornadas' },
          { label: 'Vendido no Turno', value: logs.reduce((acc, l) => acc + l.quantity_sold, 0), color: '#10B981', info: 'Descoamento' },
          { label: 'Quebra / Sobras', value: logs.reduce((acc, l) => acc + Math.max(0, l.quantity_produced - l.quantity_sold), 0), color: '#F59E0B', info: 'Excesso estimado' },
          { label: 'Aproveitamento Médio', value: `${logs.length > 0 ? ((logs.reduce((acc, l) => acc + l.quantity_sold, 0) / logs.reduce((acc, l) => acc + l.quantity_produced, 0), 0) * 100 || 88).toFixed(0) : 100}%`, color: '#3B82F6', info: 'Eficiência' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/[0.06] bg-[#1A0F08]/40 relative overflow-hidden">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">{item.label}</span>
            <span className="text-base lg:text-lg font-bold text-[#FAF6EF] mt-1 block" style={{ color: item.color, fontFamily: 'var(--font-serif)' }}>{item.value}</span>
            <span className="text-[9px] font-semibold text-neutral-500 mt-2 block">{item.info}</span>
          </div>
        ))}
      </div>

      {/* Production List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando logs de produção...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border border-white/[0.06] bg-[#1A0F08]/30 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <ChefHat size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhuma fornada registrada hoje</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Abra um novo registro e comece a metrificar a produção de pães e confeitos da padaria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#1A0F08]/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-neutral-400 uppercase text-[9px] tracking-wider font-bold">
                <th className="p-4">Item de Produção</th>
                <th className="p-4">Data fornada</th>
                <th className="p-4">Turno</th>
                <th className="p-4 text-right">Qtd Produzida</th>
                <th className="p-4 text-right">Qtd Vendida</th>
                <th className="p-4 text-right">Perda Rel.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-xs text-neutral-300">
              {logs.map((log) => {
                const diff = Math.max(0, log.quantity_produced - log.quantity_sold)
                return (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-semibold text-[#E8E8E8]">{log.item_name}</td>
                    <td className="p-4 text-neutral-400">{new Date(log.production_date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 text-neutral-400">
                      {log.shift === 'shift_1' ? '1º Turno (Manhã)' : '2º Turno (Tarde/Noite)'}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-[#FAF6EF]">{log.quantity_produced} un</td>
                    <td className="p-4 text-right font-mono text-neutral-400">{log.quantity_sold} un</td>
                    <td className="p-4 text-right font-mono text-red-400 font-semibold">{diff} un ({((diff / log.quantity_produced) * 100 || 0).toFixed(0)}%)</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Fornada Register Modal */}
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
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Nova Fornada</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Registrar Lote de Produção</h3>
              <p className="text-[10px] text-neutral-500">Insira as contagens do turno de panificação.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Produto Produzido</label>
                <select
                  required
                  value={selectedMenuItemId}
                  onChange={(e) => setSelectedMenuItemId(e.target.value)}
                  className="w-full bg-[#1A0F08] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="">Selecione do Cardápio...</option>
                  {menuItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Qtd Produzida</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="0"
                    value={qtyProduced}
                    onChange={(e) => setQtyProduced(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Qtd Vendida (Turno)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={qtySold}
                    onChange={(e) => setQtySold(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Turno</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full bg-[#1A0F08] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="shift_1">Manhã</option>
                    <option value="shift_2">Tarde / Noite</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Data</label>
                  <input
                    type="date"
                    required
                    value={prodDate}
                    onChange={(e) => setProdDate(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase shadow-lg hover:shadow-xl transition-all"
              >
                Registrar Fornada
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
