'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Wrench, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  RefreshCw,
  X,
  AlertTriangle,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Equipment {
  id: string
  name: string
  model: string | null
  serial_number: string | null
  purchase_date: string | null
  last_maintenance: string | null
  next_maintenance: string | null
  maintenance_interval_days: number
  maintenance_cost: number | null
  is_active: boolean
}

export default function EquipmentPage() {
  const supabase = createClient()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [model, setModel] = useState('')
  const [serial, setSerial] = useState('')
  const [intervalDays, setIntervalDays] = useState('90')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('equipment')
        .select('*')
        .order('name', { ascending: true })
      setEquipment(data || [])
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
    if (!name) return

    try {
      const today = new Date().toISOString().split('T')[0]
      const nextDays = parseInt(intervalDays)
      const nextDate = new Date(Date.now() + nextDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const { error } = await supabase
        .from('equipment')
        .insert({
          name,
          model: model || null,
          serial_number: serial || null,
          maintenance_interval_days: nextDays,
          last_maintenance: today,
          next_maintenance: nextDate,
          is_active: true
        })

      if (error) throw error
      setModalOpen(false)
      setName('')
      setModel('')
      setSerial('')
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
            Controle de Equipamentos 🛠️
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Plano de manutenção preventiva de fornos, masseiras, POS e câmaras frias.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setModalOpen(true)}
            className="btn-premium-gold h-[38px] px-4"
          >
            <Plus size={14} /> Cadastrar Máquina
          </button>
          <button
            onClick={fetchData}
            className="btn-premium-ghost w-[38px] h-[38px] flex items-center justify-center"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Equipment List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando inventário de ativos...</p>
        </div>
      ) : equipment.length === 0 ? (
        <div className="admin-glass-card p-12 text-center border-[#C9A84C]/15">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <Wrench size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhum equipamento catalogado</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Registre os fornos e maquinários industriais para controlar preventivas automaticamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {equipment.map((eq) => {
            const daysLeft = eq.next_maintenance 
              ? Math.ceil((new Date(eq.next_maintenance).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
              : 90
            const isLate = daysLeft < 0

            return (
              <div
                key={eq.id}
                className="p-5 admin-glass-card border-[#C9A84C]/15 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-[#FAF6EF] text-sm leading-snug">{eq.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                      isLate ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {isLate ? 'Atrasado' : 'OK'}
                    </span>
                  </div>

                  <p className="text-[10px] text-neutral-500 mt-1 uppercase font-medium">{eq.model || 'Modelo Padrão'} • SN: {eq.serial_number || '-'}</p>

                  <div className="flex justify-between items-baseline mt-4 border-b border-white/5 pb-2 text-xs">
                    <span className="text-neutral-500">Última Revisão:</span>
                    <span className="font-semibold text-neutral-400">{eq.last_maintenance ? new Date(eq.last_maintenance).toLocaleDateString('pt-BR') : '-'}</span>
                  </div>

                  <div className="flex justify-between items-baseline mt-2 text-xs">
                    <span className="text-neutral-500">Próxima Revisão:</span>
                    <span className="font-bold text-[#FAF6EF]">{eq.next_maintenance ? new Date(eq.next_maintenance).toLocaleDateString('pt-BR') : '-'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/5 justify-between">
                  <span className="text-[10px] text-neutral-500 font-medium">Revisão em: {daysLeft} dias</span>
                  {isLate && <AlertTriangle size={14} className="text-red-400 animate-pulse" />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-neutral-900/95 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4 relative backdrop-blur-xl"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-[#FAF6EF] transition-all btn-premium-ghost p-1.5"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Novo Equipamento</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Lançar Maquinário Ativo</h3>
              <p className="text-[10px] text-neutral-500">Insira a frequência para inspeções preventivas.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Nome da Máquina / Local</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Forno Turbo Industrial, Masseira..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-black/60 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Modelo / Marca</label>
                  <input
                    type="text"
                    placeholder="Ex: Tedesco, Venâncio..."
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-black/60 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Nº Série</label>
                  <input
                    type="text"
                    placeholder="SN489302"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-black/60 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Intervalo Revisão Preventiva (Dias)</label>
                <select
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-black/60 transition-all font-medium animate-none"
                >
                  <option value="30">Mensal (30 dias)</option>
                  <option value="90">Trimestral (90 dias)</option>
                  <option value="180">Semestral (180 dias)</option>
                  <option value="365">Anual (365 dias)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full btn-premium-gold h-[38px]"
              >
                Catalogar Ativo
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
