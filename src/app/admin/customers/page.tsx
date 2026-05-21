'use client'
import { USE_MOCK, mockCustomers } from '@/lib/mockData'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  ArrowLeft, 
  Search, 
  Plus, 
  Calendar, 
  UserPlus, 
  RefreshCw,
  X,
  DollarSign,
  Phone,
  Mail,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface Customer {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  notes: string | null
  total_orders: number
  total_spent: number
  last_order_at: string | null
  created_at: string
}

export default function CustomersPage() {
  const supabase = createClient()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Add Customer Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const fetchData = useCallback(async () => {
    if (USE_MOCK) { setCustomers(mockCustomers as any); setLoading(false); return }
    setLoading(true)
    try {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .order('total_spent', { ascending: false })
      setCustomers(data || [])
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
    if (!fullName) return

    try {
      const { error } = await supabase
        .from('customers')
        .insert({
          full_name: fullName,
          phone: phone || null,
          email: email || null,
          notes: notes || null,
          total_orders: 0,
          total_spent: 0
        })

      if (error) throw error
      setModalOpen(false)
      setFullName('')
      setPhone('')
      setEmail('')
      setNotes('')
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredCustomers = customers.filter((c) => {
    const term = search.toLowerCase()
    return (
      (c.full_name?.toLowerCase().includes(term) || false) ||
      (c.phone?.includes(term) || false) ||
      (c.email?.toLowerCase().includes(term) || false)
    )
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
            CRM & Clientes Fidelizados
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Histórico de consumo, canais de relacionamento e ranking de clientes recorrentes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <UserPlus size={14} /> Cadastrar Cliente
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
          { label: 'Clientes Cadastrados', value: customers.length, color: '#C9A84C', badge: 'CRM Total' },
          { label: 'Clientes Recorrentes (>5 ped)', value: customers.filter(c => c.total_orders > 5).length, color: '#10B981', badge: 'Fidelizados' },
          { label: 'Faturamento CRM Acumulado', value: formatCurrency(customers.reduce((acc, c) => acc + Number(c.total_spent || 0), 0)), color: '#3B82F6', badge: 'Investido' },
          { label: 'Ticket Médio CRM', value: formatCurrency(customers.length > 0 ? customers.reduce((acc, c) => acc + Number(c.total_spent || 0), 0) / customers.length : 0), color: '#F59E0B', badge: 'Consumo Médio' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/[0.06] bg-[#1A0F08]/40 relative overflow-hidden">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">{item.label}</span>
            <span className="text-base lg:text-lg font-bold text-[#FAF6EF] mt-1 block" style={{ color: item.color, fontFamily: 'var(--font-serif)' }}>{item.value}</span>
            <span className="text-[8px] font-extrabold uppercase mt-2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 w-max block tracking-wide">{item.badge}</span>
          </div>
        ))}
      </div>

      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.06] bg-[#1A0F08]/20">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-[#FAF6EF] placeholder-neutral-500 focus:outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando carteira de clientes...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border border-white/[0.06] bg-[#1A0F08]/30 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <Users size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhum cliente localizado</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Experimente mudar a busca ou cadastre um novo cliente fidelidade para a padaria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#1A0F08]/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-neutral-400 uppercase text-[9px] tracking-wider font-bold">
                <th className="p-4">Cliente</th>
                <th className="p-4">Contato</th>
                <th className="p-4 text-right">Qtd Pedidos</th>
                <th className="p-4 text-right">Total Consumido</th>
                <th className="p-4">Último Pedido</th>
                <th className="p-4">Notas / Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-xs text-neutral-300">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 font-semibold text-[#E8E8E8]">{c.full_name}</td>
                  <td className="p-4">
                    {c.phone && <p className="flex items-center gap-1 text-[10px] text-neutral-400"><Phone size={10} className="text-[#C9A84C]" /> {c.phone}</p>}
                    {c.email && <p className="flex items-center gap-1 text-[10px] text-neutral-500 mt-0.5"><Mail size={10} /> {c.email}</p>}
                  </td>
                  <td className="p-4 text-right font-mono font-semibold text-neutral-400">{c.total_orders} ped</td>
                  <td className="p-4 text-right font-mono font-bold text-[#10B981]">{formatCurrency(c.total_spent)}</td>
                  <td className="p-4 text-neutral-400">
                    {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString('pt-BR') : 'Sem pedidos'}
                  </td>
                  <td className="p-4 text-neutral-500 max-w-xs truncate">{c.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Customer Modal */}
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
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Novo Cliente</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Cadastrar Ficha de Cliente</h3>
              <p className="text-[10px] text-neutral-500">Mapeie as preferências e gerencie fidelidade.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">E-mail</label>
                  <input
                    type="email"
                    placeholder="email@dominio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Observações / Preferências</label>
                <textarea
                  placeholder="Ex: Gosta de pão bem passado, consome muito cappuccino, mora perto..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C] h-16 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase transition-all"
              >
                Cadastrar Ficha
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
