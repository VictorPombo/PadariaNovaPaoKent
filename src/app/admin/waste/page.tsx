'use client'
import { USE_MOCK, mockWaste } from '@/lib/mockData'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Trash2, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Sparkles, 
  RefreshCw,
  X,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'

interface StockItem {
  id: string
  name: string
  last_purchase_price: number
}

interface WasteLog {
  id: string
  item_name: string
  waste_reason: 'expired' | 'leftover' | 'damaged' | 'other'
  quantity: number
  estimated_cost: number
  shift: 'shift_1' | 'shift_2'
  waste_date: string
  notes: string
  created_at: string
}

const reasonLabels = {
  expired: { label: 'Vencido', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
  leftover: { label: 'Sobras Balcão', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  damaged: { label: 'Danificado', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  other: { label: 'Outro Motivo', color: '#FAF6EF', bg: 'rgba(255, 255, 255, 0.1)' }
}

export default function WastePage() {
  const supabase = createClient()
  const [logs, setLogs] = useState<WasteLog[]>([])
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)

  // Register Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStockItemId, setSelectedStockItemId] = useState('')
  const [qty, setQty] = useState('')
  const [reason, setReason] = useState<'expired' | 'leftover' | 'damaged' | 'other'>('leftover')
  const [shift, setShift] = useState<'shift_1' | 'shift_2'>('shift_1')
  const [wasteDate, setWasteDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  const fetchData = useCallback(async () => {
    if (USE_MOCK) {
      const today = new Date().toISOString().split('T')[0]
      setLogs([
        { id: '1', item_name: 'Pão Francês', waste_reason: 'leftover', quantity: 15, estimated_cost: 22.50, shift: 'shift_1', waste_date: today, notes: 'Sobras do balcão, não vendidos até as 14h', created_at: `${today}T14:00:00` },
        { id: '2', item_name: 'Croissant', waste_reason: 'damaged', quantity: 3, estimated_cost: 18.00, shift: 'shift_1', waste_date: today, notes: 'Quebra na manipulação da vitrine', created_at: `${today}T10:30:00` },
        { id: '3', item_name: 'Baguete', waste_reason: 'leftover', quantity: 6, estimated_cost: 36.00, shift: 'shift_1', waste_date: today, notes: 'Excesso de produção do turno da manhã', created_at: `${today}T14:00:00` },
        { id: '4', item_name: 'Leite Integral', waste_reason: 'expired', quantity: 2, estimated_cost: 13.60, shift: 'shift_2', waste_date: today, notes: 'Vencimento detectado na conferência', created_at: `${today}T16:00:00` },
        { id: '5', item_name: 'Bolo de Cenoura', waste_reason: 'leftover', quantity: 2, estimated_cost: 8.40, shift: 'shift_2', waste_date: today, notes: 'Fatias restantes ao final do expediente', created_at: `${today}T22:00:00` },
        { id: '6', item_name: 'Pão de Queijo', waste_reason: 'damaged', quantity: 8, estimated_cost: 12.00, shift: 'shift_1', waste_date: '2026-05-20', notes: 'Queimou na fornada — temperatura incorreta', created_at: '2026-05-20T09:00:00' },
        { id: '7', item_name: 'Presunto Cozido', waste_reason: 'expired', quantity: 1, estimated_cost: 28.90, shift: 'shift_2', waste_date: '2026-05-19', notes: 'Embalagem aberta há mais de 3 dias', created_at: '2026-05-19T15:00:00' },
      ] as any)
      setStockItems([
        { id: '1', name: 'Pão Francês', last_purchase_price: 1.50 },
        { id: '2', name: 'Croissant', last_purchase_price: 6.00 },
        { id: '3', name: 'Baguete', last_purchase_price: 6.00 },
        { id: '4', name: 'Leite Integral', last_purchase_price: 6.80 },
        { id: '5', name: 'Bolo de Cenoura', last_purchase_price: 4.20 },
        { id: '6', name: 'Pão de Queijo', last_purchase_price: 1.50 },
        { id: '7', name: 'Presunto Cozido', last_purchase_price: 28.90 },
      ])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data: logsData } = await supabase
        .from('waste_logs')
        .select('*')
        .order('waste_date', { ascending: false })
      setLogs(logsData || [])

      const { data: items } = await supabase
        .from('stock_items')
        .select('id, name, last_purchase_price')
        .eq('is_active', true)
      setStockItems(items || [])
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
    if (!selectedStockItemId || !qty) return

    const stockItem = stockItems.find(i => i.id === selectedStockItemId)
    if (!stockItem) return

    try {
      const qtyNum = parseFloat(qty)
      const costEstimate = qtyNum * (stockItem.last_purchase_price || 2.50) // Fallback cost

      const { error } = await supabase
        .from('waste_logs')
        .insert({
          stock_item_id: selectedStockItemId,
          item_name: stockItem.name,
          waste_reason: reason,
          quantity: qtyNum,
          estimated_cost: costEstimate,
          shift,
          waste_date: wasteDate,
          notes: notes || 'Perda registrada pelo painel'
        })

      if (error) throw error

      setModalOpen(false)
      setSelectedStockItemId('')
      setQty('')
      setNotes('')
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
            Registro de Desperdício
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Controle de sobras de balcão, quebra de fornada e mercadoria vencida para redução do CMV.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <Plus size={14} /> Lançar Desperdício
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
          { label: 'Custo Total Perdas (Mês)', value: formatCurrency(logs.reduce((acc, l) => acc + (l.estimated_cost || 0), 0)), color: '#EF4444', info: 'Impacto no lucro' },
          { label: 'Ocorrências Registradas', value: logs.length, color: '#C9A84C', info: 'Registros de perdas' },
          { label: 'Desperdício por Sobra', value: formatCurrency(logs.filter(l => l.waste_reason === 'leftover').reduce((acc, l) => acc + (l.estimated_cost || 0), 0)), color: '#F59E0B', info: 'Excesso de vitrine' },
          { label: 'Vencidos / Danificados', value: formatCurrency(logs.filter(l => l.waste_reason === 'expired' || l.waste_reason === 'damaged').reduce((acc, l) => acc + (l.estimated_cost || 0), 0)), color: '#3B82F6', info: 'Problemas de estoque' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/[0.06] bg-[#1A0F08]/40 relative overflow-hidden">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">{item.label}</span>
            <span className="text-base lg:text-lg font-bold text-[#FAF6EF] mt-1 block" style={{ color: item.color, fontFamily: 'var(--font-serif)' }}>{item.value}</span>
            <span className="text-[9px] font-semibold text-neutral-500 mt-2 block">{item.info}</span>
          </div>
        ))}
      </div>

      {/* Waste Logs List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando registro de perdas...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border border-white/[0.06] bg-[#1A0F08]/30 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <Trash2 size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhum desperdício registrado</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Parabéns! Nenhuma quebra ou sobra foi lançada nas planilhas hoje.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#1A0F08]/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-neutral-400 uppercase text-[9px] tracking-wider font-bold">
                <th className="p-4">Item de Perda</th>
                <th className="p-4">Motivo</th>
                <th className="p-4">Data Ocorrência</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4 text-right">Custo Estimado</th>
                <th className="p-4">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-xs text-neutral-300">
              {logs.map((log) => {
                const labelCfg = reasonLabels[log.waste_reason] || reasonLabels.other
                return (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-semibold text-[#E8E8E8]">{log.item_name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase" style={{ color: labelCfg.color, background: labelCfg.bg }}>
                        {labelCfg.label}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{new Date(log.waste_date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 text-neutral-400 font-mono">{log.quantity} un</td>
                    <td className="p-4 text-right font-mono font-bold text-red-400">{formatCurrency(log.estimated_cost)}</td>
                    <td className="p-4 text-neutral-500 max-w-xs truncate">{log.notes}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Register Waste Modal */}
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
              <span className="text-[9px] font-extrabold text-red-400 tracking-widest uppercase flex items-center gap-1">
                <AlertTriangle size={10} /> Registro de Perdas
              </span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Lançar Desperdício de Insumos</h3>
              <p className="text-[10px] text-neutral-500">Isso ajustará as métricas CMV automaticamente.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Insumo Perdido</label>
                <select
                  required
                  value={selectedStockItemId}
                  onChange={(e) => setSelectedStockItemId(e.target.value)}
                  className="w-full bg-[#1A0F08] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="">Selecione o Insumo...</option>
                  {stockItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Qtd Descartada</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    placeholder="0"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Motivo</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full bg-[#1A0F08] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="leftover">Sobras Balcão</option>
                    <option value="expired">Vencido</option>
                    <option value="damaged">Danificado</option>
                    <option value="other">Outro Motivo</option>
                  </select>
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
                  <label className="text-neutral-400 font-medium">Data Perda</label>
                  <input
                    type="date"
                    required
                    value={wasteDate}
                    onChange={(e) => setWasteDate(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Detalhamento / Observação</label>
                <textarea
                  placeholder="Ex: Pão de queijo que queimou, leite azedou..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C] h-16 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-bold text-xs tracking-wider uppercase transition-all"
              >
                Registrar Desperdício
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
