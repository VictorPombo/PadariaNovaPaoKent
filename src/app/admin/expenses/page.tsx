'use client'
import { USE_MOCK } from '@/lib/mockData'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  CreditCard, 
  ArrowLeft, 
  Plus, 
  RefreshCw,
  X,
  DollarSign,
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'

interface FixedExpense {
  id: string
  name: string
  category: string
  amount: number
  due_day: number
  is_paid: boolean
  paid_at: string | null
  reference_month: string
}

interface VariableExpense {
  id: string
  category: string
  description: string
  amount: number
  expense_date: string
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  rental: { label: 'Aluguel', color: '#C9A84C' },
  utilities: { label: 'Contas', color: '#3B82F6' },
  salary: { label: 'Folha', color: '#8B5CF6' },
  taxes: { label: 'Impostos', color: '#EF4444' },
  packaging: { label: 'Embalagens', color: '#10B981' },
  maintenance: { label: 'Manutenção', color: '#F59E0B' },
  marketing: { label: 'Marketing', color: '#EC4899' },
  supplies: { label: 'Insumos', color: '#06B6D4' },
  other: { label: 'Outros', color: '#6B7280' },
}

export default function ExpensesPage() {
  const supabase = createClient()
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([])
  const [variableExpenses, setVariableExpenses] = useState<VariableExpense[]>([])
  const [loading, setLoading] = useState(true)

  const [fixedModalOpen, setFixedModalOpen] = useState(false)
  const [fixedName, setFixedName] = useState('')
  const [fixedCategory, setFixedCategory] = useState('other')
  const [fixedAmount, setFixedAmount] = useState('')
  const [fixedDueDay, setFixedDueDay] = useState('')

  const [varModalOpen, setVarModalOpen] = useState(false)
  const [varDesc, setVarDesc] = useState('')
  const [varCategory, setVarCategory] = useState('other')
  const [varAmount, setVarAmount] = useState('')

  const fetchData = useCallback(async () => {
    if (USE_MOCK) {
      setFixedExpenses([
        { id: '1', name: 'Aluguel do Prédio', category: 'rental', amount: 12000, due_day: 10, is_paid: true, paid_at: '2026-05-10', reference_month: '2026-05-01' },
        { id: '2', name: 'Conta de Luz', category: 'utilities', amount: 3200, due_day: 18, is_paid: true, paid_at: '2026-05-18', reference_month: '2026-05-01' },
        { id: '3', name: 'Conta de Água', category: 'utilities', amount: 480, due_day: 15, is_paid: true, paid_at: '2026-05-15', reference_month: '2026-05-01' },
        { id: '4', name: 'Folha de Pagamento', category: 'salary', amount: 28500, due_day: 5, is_paid: true, paid_at: '2026-05-05', reference_month: '2026-05-01' },
        { id: '5', name: 'Internet & Telefone', category: 'utilities', amount: 350, due_day: 20, is_paid: false, paid_at: null, reference_month: '2026-05-01' },
        { id: '6', name: 'Simples Nacional', category: 'taxes', amount: 4200, due_day: 20, is_paid: false, paid_at: null, reference_month: '2026-05-01' },
        { id: '7', name: 'Seguro do Imóvel', category: 'other', amount: 890, due_day: 25, is_paid: false, paid_at: null, reference_month: '2026-05-01' },
      ])
      setVariableExpenses([
        { id: '1', description: 'Compra de Farinha — Moinho Paulista', category: 'supplies', amount: 1350, expense_date: '2026-05-20' },
        { id: '2', description: 'Manutenção Forno Industrial #2', category: 'maintenance', amount: 850, expense_date: '2026-05-15' },
        { id: '3', description: 'Compra de Frios — Sadia/Ceratti', category: 'supplies', amount: 2890.50, expense_date: '2026-05-14' },
        { id: '4', description: 'Embalagens Personalizadas', category: 'packaging', amount: 680, expense_date: '2026-05-12' },
        { id: '5', description: 'Campanha Instagram — Maio', category: 'marketing', amount: 650, expense_date: '2026-05-10' },
        { id: '6', description: 'Café em Grão — Orfeu (15kg)', category: 'supplies', amount: 720, expense_date: '2026-05-08' },
        { id: '7', description: 'Reparo da Masseira Espiral', category: 'maintenance', amount: 420, expense_date: '2026-05-06' },
      ])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data: fixed } = await supabase
        .from('fixed_expenses')
        .select('*')
        .order('due_day', { ascending: true })
      setFixedExpenses(fixed || [])

      const { data: variable } = await supabase
        .from('variable_expenses')
        .select('*')
        .order('expense_date', { ascending: false })
      setVariableExpenses(variable || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePayFixed = async (id: string, isPaid: boolean) => {
    if (USE_MOCK) {
      setFixedExpenses(prev => prev.map(e => e.id === id ? { ...e, is_paid: !isPaid, paid_at: !isPaid ? new Date().toISOString().split('T')[0] : null } : e))
      return
    }
    try {
      const { error } = await supabase
        .from('fixed_expenses')
        .update({ is_paid: !isPaid, paid_at: !isPaid ? new Date().toISOString().split('T')[0] : null })
        .eq('id', id)
      if (error) throw error
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleFixedSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fixedName || !fixedAmount || !fixedDueDay) return
    try {
      const { error } = await supabase
        .from('fixed_expenses')
        .insert({ name: fixedName, category: fixedCategory, amount: parseFloat(fixedAmount), due_day: parseInt(fixedDueDay), reference_month: new Date().toISOString().slice(0, 7) + '-01' })
      if (error) throw error
      setFixedModalOpen(false); setFixedName(''); setFixedAmount(''); setFixedDueDay('')
      fetchData()
    } catch (err) { console.error(err) }
  }

  const handleVariableSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!varDesc || !varAmount) return
    try {
      const { error } = await supabase
        .from('variable_expenses')
        .insert({ description: varDesc, category: varCategory, amount: parseFloat(varAmount), expense_date: new Date().toISOString().split('T')[0] })
      if (error) throw error
      setVarModalOpen(false); setVarDesc(''); setVarAmount('')
      fetchData()
    } catch (err) { console.error(err) }
  }

  const totalFixedPaid = fixedExpenses.filter(e => e.is_paid).reduce((s, e) => s + Number(e.amount), 0)
  const totalFixedUnpaid = fixedExpenses.filter(e => !e.is_paid).reduce((s, e) => s + Number(e.amount), 0)
  const totalVariable = variableExpenses.reduce((s, e) => s + Number(e.amount), 0)

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
            Livro de Gastos & Despesas
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Gestão de custos fixos (aluguel, folha) e gastos variáveis contábeis da Padaria Nova Paokent.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          <button
            onClick={() => setFixedModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 text-xs text-neutral-300 font-semibold bg-white/5 hover:bg-white/[0.08] transition-colors"
          >
            <Plus size={14} /> Custo Fixo
          </button>
          <button
            onClick={() => setVarModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <Plus size={14} /> Gasto Variável
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
          { label: 'Contas Fixas Pagas', value: formatCurrency(totalFixedPaid), color: '#10B981', info: `${fixedExpenses.filter(e => e.is_paid).length} contas quitadas` },
          { label: 'Contas Fixas Pendentes', value: formatCurrency(totalFixedUnpaid), color: '#F59E0B', info: `${fixedExpenses.filter(e => !e.is_paid).length} a pagar` },
          { label: 'Despesas Variáveis', value: formatCurrency(totalVariable), color: '#3B82F6', info: `${variableExpenses.length} lançamentos` },
          { label: 'Custo Total Acumulado', value: formatCurrency(totalFixedPaid + totalFixedUnpaid + totalVariable), color: '#EF4444', info: 'Impacto no DRE' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/[0.06] bg-[#1A0F08]/40 relative overflow-hidden">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">{item.label}</span>
            <span className="text-base lg:text-lg font-bold text-[#FAF6EF] mt-1 block" style={{ color: item.color, fontFamily: 'var(--font-serif)' }}>{item.value}</span>
            <span className="text-[9px] font-semibold text-neutral-500 mt-2 block">{item.info}</span>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Fixed Expenses */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#1A0F08]/30 p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase flex items-center gap-2">
            <CreditCard size={14} /> Gastos Fixos & Mensais
          </h3>

          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent animate-spin rounded-full" />
            </div>
          ) : fixedExpenses.length === 0 ? (
            <p className="text-xs text-neutral-500 italic text-center py-10">Nenhum custo fixo lançado.</p>
          ) : (
            <div className="space-y-2">
              {fixedExpenses.map((exp) => {
                const cat = categoryLabels[exp.category] || categoryLabels.other
                return (
                  <div key={exp.id} className="flex justify-between items-center text-xs p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#C9A84C]/20 transition-all">
                    <div className="flex-1">
                      <p className="font-semibold text-[#FAF6EF]">{exp.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: cat.color, background: `${cat.color}15` }}>{cat.label}</span>
                        <span className="text-[10px] text-neutral-500">Vence dia {exp.due_day}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-[#FAF6EF]">{formatCurrency(exp.amount)}</p>
                      <button
                        onClick={() => handlePayFixed(exp.id, exp.is_paid)}
                        className={`p-1 px-2 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-all ${
                          exp.is_paid
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}
                      >
                        {exp.is_paid ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {exp.is_paid ? 'Pago' : 'Pendente'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Variable Expenses */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#1A0F08]/30 p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase flex items-center gap-2">
            <DollarSign size={14} /> Gastos Variáveis & Lançamentos
          </h3>

          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent animate-spin rounded-full" />
            </div>
          ) : variableExpenses.length === 0 ? (
            <p className="text-xs text-neutral-500 italic text-center py-10">Nenhum gasto variável lançado.</p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {variableExpenses.map((exp) => {
                const cat = categoryLabels[exp.category] || categoryLabels.other
                return (
                  <div key={exp.id} className="flex justify-between items-center text-xs p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#C9A84C]/20 transition-all">
                    <div className="flex-1">
                      <p className="font-semibold text-[#FAF6EF]">{exp.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: cat.color, background: `${cat.color}15` }}>{cat.label}</span>
                        <span className="text-[10px] text-neutral-500">{new Date(exp.expense_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <p className="font-bold text-red-400">{formatCurrency(exp.amount)}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Modal */}
      {fixedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0F08]/75 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-[#2C1A0E]/95 border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl space-y-4 relative">
            <button onClick={() => setFixedModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-[#FAF6EF] bg-white/5 border border-white/10 rounded-lg p-1.5"><X size={16} /></button>
            <div>
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Novo Custo Fixo</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Registrar Custo Administrativo</h3>
            </div>
            <form onSubmit={handleFixedSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Nome do Custo</label>
                <input type="text" required placeholder="Ex: Aluguel, Pro-Labore..." value={fixedName} onChange={(e) => setFixedName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Valor Mensal</label>
                  <input type="number" required placeholder="0.00" value={fixedAmount} onChange={(e) => setFixedAmount(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]" />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Dia Vencimento</label>
                  <input type="number" min="1" max="31" required placeholder="10" value={fixedDueDay} onChange={(e) => setFixedDueDay(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Categoria</label>
                <select value={fixedCategory} onChange={(e) => setFixedCategory(e.target.value)}
                  className="w-full bg-[#1A0F08] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]">
                  <option value="rental">Aluguel & Contratos</option>
                  <option value="utilities">Água, Luz & Internet</option>
                  <option value="salary">Folha Pagamento</option>
                  <option value="taxes">Impostos & Taxas</option>
                  <option value="other">Outros Custos</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase">Salvar Custo Fixo</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Variable Modal */}
      {varModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0F08]/75 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-[#2C1A0E]/95 border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl space-y-4 relative">
            <button onClick={() => setVarModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-[#FAF6EF] bg-white/5 border border-white/10 rounded-lg p-1.5"><X size={16} /></button>
            <div>
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Novo Gasto Variável</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Lançar Despesa Diária</h3>
            </div>
            <form onSubmit={handleVariableSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Descrição</label>
                <input type="text" required placeholder="Ex: Embalagens, reparo..." value={varDesc} onChange={(e) => setVarDesc(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Valor</label>
                  <input type="number" step="0.01" required placeholder="0.00" value={varAmount} onChange={(e) => setVarAmount(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]" />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Categoria</label>
                  <select value={varCategory} onChange={(e) => setVarCategory(e.target.value)}
                    className="w-full bg-[#1A0F08] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]">
                    <option value="packaging">Embalagens</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="marketing">Marketing</option>
                    <option value="supplies">Insumos</option>
                    <option value="other">Outros</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase">Registrar Lançamento</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
