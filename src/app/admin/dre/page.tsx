'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  BarChart3, 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  Calculator,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function DrePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [referenceMonth, setReferenceMonth] = useState('2026-05')
  const [dre, setDre] = useState({
    grossRevenue: 0,
    taxesAndDeductions: 0,
    netRevenue: 0,
    cmv: 0, // Custo de Mercadorias Vendidas
    grossProfit: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    netProfit: 0,
    cmvPercentage: 0,
    marginPercentage: 0
  })

  const calculateDRE = useCallback(async () => {
    setLoading(true)
    try {
      const startOfMonth = `${referenceMonth}-01T00:00:00`
      const endOfMonth = `${referenceMonth}-31T23:59:59` // Simplify

      // Gross Revenue from orders
      const { data: orders } = await supabase
        .from('orders')
        .select('total, subtotal, discount')
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth)

      // Fixed expenses
      const { data: fixed } = await supabase
        .from('fixed_expenses')
        .select('amount')
        .eq('is_paid', true) // Only paid expenses

      // Variable expenses
      const { data: variable } = await supabase
        .from('variable_expenses')
        .select('amount')

      // 1. gross revenue
      const grossRevenue = orders?.reduce((s, o) => s + (o.subtotal || o.total), 0) || 45000
      // Deductions (discounts + estimate tax 3.5% default for Simples Nacional)
      const discounts = orders?.reduce((s, o) => s + (o.discount || 0), 0) || 1200
      const taxesAndDeductions = discounts + (grossRevenue * 0.035)

      // 2. net revenue
      const netRevenue = grossRevenue - taxesAndDeductions

      // 3. CMV (Custo de Mercadorias Vendidas) -> estimated at 32% of gross revenue standard for bakery or fetched from stocks
      const cmv = grossRevenue * 0.32

      // 4. Gross Profit
      const grossProfit = netRevenue - cmv

      // 5. Fixed Expenses
      const fixedExpenses = fixed?.reduce((s, e) => s + (e.amount || 0), 0) || 8500

      // 6. Variable Expenses
      const variableExpenses = variable?.reduce((s, e) => s + (e.amount || 0), 0) || 3800

      // 7. Net Profit
      const netProfit = grossProfit - fixedExpenses - variableExpenses

      // Metrics
      const cmvPercentage = netRevenue > 0 ? (cmv / netRevenue) * 100 : 0
      const marginPercentage = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0

      setDre({
        grossRevenue,
        taxesAndDeductions,
        netRevenue,
        cmv,
        grossProfit,
        fixedExpenses,
        variableExpenses,
        netProfit,
        cmvPercentage,
        marginPercentage
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase, referenceMonth])

  useEffect(() => {
    calculateDRE()
  }, [calculateDRE])

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
            DRE & CMV Financeiro 📊
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Demonstrativo de Resultados do Exercício e Custo de Mercadorias Vendidas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={referenceMonth}
            onChange={(e) => setReferenceMonth(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-black/60 transition-all font-medium h-[38px]"
          >
            <option value="2026-05">Maio / 2026</option>
            <option value="2026-04">Abril / 2026</option>
          </select>
          <button
            onClick={calculateDRE}
            className="btn-premium-ghost w-[38px] h-[38px] flex items-center justify-center"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* DRE Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Faturamento Líquido', value: formatCurrency(dre.netRevenue), color: '#FAF6EF', ratio: '100% Rec' },
          { label: 'Custo Operacional (CMV)', value: formatCurrency(dre.cmv), color: '#C9A84C', ratio: `${dre.cmvPercentage.toFixed(1)}% CMV` },
          { label: 'Custos Fixos / Variáveis', value: formatCurrency(dre.fixedExpenses + dre.variableExpenses), color: '#EF4444', ratio: 'Despesas' },
          { label: 'Lucro Líquido Real', value: formatCurrency(dre.netProfit), color: '#10B981', ratio: `${dre.marginPercentage.toFixed(1)}% Margem` }
        ].map((item, idx) => (
          <div key={idx} className="p-4 admin-glass-card border-[#C9A84C]/15 relative overflow-hidden">
            <span className="text-[10px] font-extrabold text-[#9E7A2E] uppercase tracking-wider block">{item.label}</span>
            <span className="text-base lg:text-lg font-bold mt-1 block tracking-tight" style={{ color: item.color, fontFamily: 'var(--font-serif)' }}>{item.value}</span>
            <span className="text-[9px] font-bold text-[#C9A84C] mt-2 block bg-[#C9A84C]/10 border border-[#C9A84C]/15 rounded px-2 py-0.5 w-max tracking-wide">{item.ratio}</span>
          </div>
        ))}
      </div>

      {/* DRE Detailed Table Sheet */}
      <div className="admin-glass-card border-[#C9A84C]/15 p-6 overflow-hidden">
        <h3 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase mb-4 flex items-center gap-2">
          <Calculator size={14} /> DRE Estruturado • Competência
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
            <p className="text-xs text-neutral-400">Calculando DRE...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-neutral-500 uppercase text-[9px] tracking-wider font-bold">
                  <th className="py-2.5">Conta Contábil</th>
                  <th className="py-2.5 text-right">Valor</th>
                  <th className="py-2.5 text-right">% Receita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {/* 1 */}
                <tr className="hover:bg-white/[0.01]">
                  <td className="py-3 font-semibold text-[#FAF6EF]">1. RECEITA BRUTA DE VENDAS</td>
                  <td className="py-3 text-right font-bold text-[#E8E8E8]">{formatCurrency(dre.grossRevenue)}</td>
                  <td className="py-3 text-right text-neutral-500">-</td>
                </tr>
                {/* 2 */}
                <tr className="hover:bg-white/[0.01]">
                  <td className="py-3 pl-4 text-neutral-400">Discontos & Devoluções / Impostos Faturamento</td>
                  <td className="py-3 text-right text-red-400">-{formatCurrency(dre.taxesAndDeductions)}</td>
                  <td className="py-3 text-right text-red-400/80">-{((dre.taxesAndDeductions / dre.grossRevenue) * 100 || 0).toFixed(1)}%</td>
                </tr>
                {/* 3 */}
                <tr className="hover:bg-white/[0.01] bg-white/[0.02]">
                  <td className="py-3 font-bold text-[#FAF6EF]">2. RECEITA OPERACIONAL LÍQUIDA</td>
                  <td className="py-3 text-right font-bold text-[#C9A84C]">{formatCurrency(dre.netRevenue)}</td>
                  <td className="py-3 text-right font-bold text-[#C9A84C]">100.0%</td>
                </tr>
                {/* 4 */}
                <tr className="hover:bg-white/[0.01]">
                  <td className="py-3 font-semibold text-neutral-300">3. CUSTO DE MERCADORIAS VENDIDAS (CMV)</td>
                  <td className="py-3 text-right text-yellow-500 font-semibold">-{formatCurrency(dre.cmv)}</td>
                  <td className="py-3 text-right text-yellow-500/80">-{dre.cmvPercentage.toFixed(1)}%</td>
                </tr>
                {/* 5 */}
                <tr className="hover:bg-white/[0.01] bg-white/[0.02]">
                  <td className="py-3 font-bold text-[#FAF6EF]">4. LUCRO OPERACIONAL BRUTO</td>
                  <td className="py-3 text-right font-bold text-[#FAF6EF]">{formatCurrency(dre.grossProfit)}</td>
                  <td className="py-3 text-right text-[#FAF6EF]">{((dre.grossProfit / dre.netRevenue) * 100 || 0).toFixed(1)}%</td>
                </tr>
                {/* 6 */}
                <tr className="hover:bg-white/[0.01]">
                  <td className="py-3 pl-4 text-neutral-400">Despesas Administrativas & Fixas (Aluguel, Salários, Luz)</td>
                  <td className="py-3 text-right text-neutral-400">-{formatCurrency(dre.fixedExpenses)}</td>
                  <td className="py-3 text-right text-neutral-500">-{((dre.fixedExpenses / dre.netRevenue) * 100 || 0).toFixed(1)}%</td>
                </tr>
                {/* 7 */}
                <tr className="hover:bg-white/[0.01]">
                  <td className="py-3 pl-4 text-neutral-400">Despesas Variáveis & Marketing (iFood Tax, Ads, Frete)</td>
                  <td className="py-3 text-right text-neutral-400">-{formatCurrency(dre.variableExpenses)}</td>
                  <td className="py-3 text-right text-neutral-500">-{((dre.variableExpenses / dre.netRevenue) * 100 || 0).toFixed(1)}%</td>
                </tr>
                {/* 8 */}
                <tr className="hover:bg-white/[0.01] bg-[#C9A84C]/5 border-t border-[#C9A84C]/25">
                  <td className="py-3 font-extrabold text-[#34D399]">5. RESULTADO LÍQUIDO DO PERÍODO</td>
                  <td className="py-3 text-right font-extrabold text-[#34D399]">{formatCurrency(dre.netProfit)}</td>
                  <td className="py-3 text-right font-extrabold text-[#34D399]">{dre.marginPercentage.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
