'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  CreditCard, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  TrendingDown, 
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

export default function ExpensesPage() {
  const supabase = createClient()
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([])
  const [variableExpenses, setVariableExpenses] = useState<VariableExpense[]>([])
  const [loading, setLoading] = useState(true)

  // Modals for register
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
    try {
      const { error } = await supabase
        .from('fixed_expenses')
        .update({
          is_paid: !isPaid,
          paid_at: !isPaid ? new Date().toISOString().split('T')[0] : null
        })
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
        .insert({
          name: fixedName,
          category: fixedCategory,
          amount: parseFloat(fixedAmount),
          due_day: parseInt(fixedDueDay),
          reference_month: new Date().toISOString().slice(0, 7) + '-01'
        })

      if (error) throw error
      setFixedModalOpen(false)
      setFixedName('')
      setFixedAmount('')
      setFixedDueDay('')
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleVariableSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!varDesc || !varAmount) return

    try {
      const { error } = await supabase
        .from('variable_expenses')
        .insert({
          description: varDesc,
          category: varCategory,
          amount: parseFloat(varAmount),
          expense_date: new Date().toISOString().split('T')[0]
        })

      if (error) throw error
      setVarModalOpen(false)
      setVarDesc('')
      setVarAmount('')
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const totalFixedPaid = fixedExpenses.filter(e => e.is_paid).reduce((s, e) => s + Number(e.amount), 0)
  const totalFixedUnpaid = fixedExpenses.filter(e => !e.is_paid).reduce((s, e) => s + Number(e.amount), 0)
  const totalVariable = variableExpenses.reduce((s, e) => s + Number(e.amount), 0)

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/dashboard" className="text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 text-xs font-semibold">
              <ArrowLeft size={12} /> Dashboard
            </Link>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Livro de Gastos & Despesas 💸
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gestão de custos fixos (aluguel, folha) e gastos variáveis contábeis da Padaria Nova Paokent.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFixedModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-semibold bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Plus size={14} /> Novo Custo Fixo
          </button>
          <button
            onClick={() => setVarModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-md cursor-pointer border-0"
          >
            <Plus size={14} /> Lançar Gasto Variável
          </button>
          <button
            onClick={fetchData}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 transition-all bg-white hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Contas Fixas Pagas', value: formatCurrency(totalFixedPaid), color: 'text-emerald-600', badge: 'Quitadas' },
          { label: 'Contas Fixas Pendentes', value: formatCurrency(totalFixedUnpaid), color: 'text-amber-600', badge: 'A Pagar' },
          { label: 'Despesas Variáveis (Mês)', value: formatCurrency(totalVariable), color: 'text-blue-600', badge: 'Lançamentos' },
          { label: 'Custo Total Acumulado', value: formatCurrency(totalFixedPaid + totalFixedUnpaid + totalVariable), color: 'text-slate-900', badge: 'Geral' }
        ].map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-slate-200/80 bg-white relative overflow-hidden shadow-sm hover:shadow-md transition-all">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{item.label}</span>
            <span className={`text-2xl font-extrabold mt-1 block font-sans tracking-tight ${item.color}`}>{item.value}</span>
            <span className="text-[8px] font-extrabold uppercase mt-2 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500 w-max block tracking-wide">{item.badge}</span>
          </div>
        ))}
      </div>

      {/* Lists in grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Fixed Expenses */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-amber-600 tracking-widest uppercase">Gastos Fixos & Mensais</h3>

          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent animate-spin rounded-full" />
            </div>
          ) : fixedExpenses.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-10">Nenhum custo fixo lançado.</p>
          ) : (
            <div className="space-y-2">
              {fixedExpenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-50 border border-slate-200/40 hover:border-slate-300 transition-all shadow-2xs">
                  <div>
                    <p className="font-semibold text-slate-800">{exp.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Vence todo dia {exp.due_day}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-slate-900">{formatCurrency(exp.amount)}</p>
                    <button
                      onClick={() => handlePayFixed(exp.id, exp.is_paid)}
                      className={`p-1 px-2.5 rounded text-[10px] font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                        exp.is_paid 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      {exp.is_paid ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {exp.is_paid ? 'Pago' : 'Pendente'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Variable Expenses */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-amber-600 tracking-widest uppercase">Gastos Variáveis & Lançamentos</h3>

          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent animate-spin rounded-full" />
            </div>
          ) : variableExpenses.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-10">Nenhum gasto variável lançado.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              {variableExpenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-50 border border-slate-200/40 shadow-2xs">
                  <div>
                    <p className="font-semibold text-slate-800">{exp.description}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{new Date(exp.expense_date).toLocaleDateString('pt-BR')} • {exp.category}</p>
                  </div>
                  <p className="font-bold text-rose-600">{formatCurrency(exp.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Custo Modal */}
      {fixedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xl space-y-4 relative"
          >
            <button
              onClick={() => setFixedModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 border border-slate-200/60 rounded-lg p-1.5 cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">Novo Custo Fixo</span>
              <h3 className="text-sm font-bold text-slate-800 mt-1">Registrar Custo Administrativo</h3>
              <p className="text-[10px] text-slate-500 font-medium">Insira as obrigações mensais recorrentes.</p>
            </div>

            <form onSubmit={handleFixedSubmit} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">Nome do Custo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aluguel do Prédio, Pro-Labore..."
                  value={fixedName}
                  onChange={(e) => setFixedName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">Valor Mensal</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">Dia do Vencimento</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    placeholder="10"
                    value={fixedDueDay}
                    onChange={(e) => setFixedDueDay(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">Categoria</label>
                <select
                  value={fixedCategory}
                  onChange={(e) => setFixedCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="rental">Aluguel & Contratos</option>
                  <option value="utilities">Água, Luz & Internet</option>
                  <option value="salary">Folha Pagamento</option>
                  <option value="taxes">Impostos & Taxas</option>
                  <option value="other">Outros Custos</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-md transition-all cursor-pointer border-0"
              >
                Salvar Custo Fixo
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Variable Custo Modal */}
      {varModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xl space-y-4 relative"
          >
            <button
              onClick={() => setVarModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 border border-slate-200/60 rounded-lg p-1.5 cursor-pointer"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">Novo Gasto Variável</span>
              <h3 className="text-sm font-bold text-slate-800 mt-1">Lançar Despesa Diária</h3>
              <p className="text-[10px] text-slate-500 font-medium">Gastos pontuais e aquisições operacionais.</p>
            </div>

            <form onSubmit={handleVariableSubmit} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">Descrição da Despesa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Embalagens kraft, Reparo da masseira..."
                  value={varDesc}
                  onChange={(e) => setVarDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={varAmount}
                    onChange={(e) => setVarAmount(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">Categoria</label>
                  <select
                    value={varCategory}
                    onChange={(e) => setVarCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  >
                    <option value="packaging">Embalagens</option>
                    <option value="maintenance">Manutenção Obras</option>
                    <option value="marketing">Marketing & Panfletos</option>
                    <option value="supplies">Insumos Urgência</option>
                    <option value="other">Outros</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white font-bold text-xs tracking-wider uppercase bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-md transition-all cursor-pointer border-0"
              >
                Registrar Lançamento
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
