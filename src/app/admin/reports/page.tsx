'use client'

import { useState } from 'react'
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Calendar, 
  RefreshCw,
  CheckCircle,
  BarChart3,
  Package,
  Trash2,
  CreditCard,
  Users
} from 'lucide-react'
import Link from 'next/link'

const reportTypes = [
  { id: 'sales', label: 'Vendas & Pedidos', desc: 'Faturamento consolidado, ticket médio e canais', icon: BarChart3, color: '#C9A84C' },
  { id: 'inventory', label: 'Fechamento de Estoque', desc: 'Inventário, CMC e ponto de reposição', icon: Package, color: '#3B82F6' },
  { id: 'waste', label: 'Desperdício & CMV', desc: 'Histórico de perdas e impacto financeiro', icon: Trash2, color: '#EF4444' },
  { id: 'expenses', label: 'Gastos & Despesas', desc: 'Custos fixos e variáveis contábeis', icon: CreditCard, color: '#10B981' },
  { id: 'foot-traffic', label: 'Fluxo de Clientes', desc: 'Movimentação presencial e horas de pico', icon: Users, color: '#8B5CF6' },
]

const recentReports = [
  { id: '1', name: 'Relatório Semanal — Semana 20', type: 'sales', period: '12/05 a 18/05/2026', status: 'ready', generated: '18/05/2026 22:00', size: '2.4 MB' },
  { id: '2', name: 'DRE Mensal — Abril 2026', type: 'expenses', period: '01/04 a 30/04/2026', status: 'ready', generated: '01/05/2026 00:15', size: '1.8 MB' },
  { id: '3', name: 'Inventário Consolidado — Maio', type: 'inventory', period: '01/05 a 20/05/2026', status: 'ready', generated: '20/05/2026 22:30', size: '3.1 MB' },
  { id: '4', name: 'Relatório de Desperdício — Sem. 20', type: 'waste', period: '12/05 a 18/05/2026', status: 'ready', generated: '18/05/2026 22:35', size: '890 KB' },
  { id: '5', name: 'Fluxo Presencial — Maio (parcial)', type: 'foot-traffic', period: '01/05 a 20/05/2026', status: 'ready', generated: '20/05/2026 23:00', size: '540 KB' },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('sales')
  const [format, setFormat] = useState('csv')
  const [exporting, setExporting] = useState(false)

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
    }, 1500)
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
            Centro de Relatórios & Auditorias
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Exporte tabelas de vendas, inventários, perdas contábeis e logs em formatos universais (CSV/PDF).
          </p>
        </div>
      </div>

      {/* Report Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {reportTypes.map((rt) => {
          const Icon = rt.icon
          const isSelected = selectedReport === rt.id
          return (
            <button
              key={rt.id}
              onClick={() => setSelectedReport(rt.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-[#C9A84C]/40 bg-[#C9A84C]/[0.06]'
                  : 'border-white/[0.06] bg-[#1A0F08]/30 hover:bg-white/[0.03]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                isSelected ? 'bg-[#C9A84C]/15' : 'bg-white/5'
              }`}>
                <Icon size={16} style={{ color: isSelected ? rt.color : '#888' }} />
              </div>
              <h4 className={`text-xs font-bold ${isSelected ? 'text-[#FAF6EF]' : 'text-neutral-400'}`}>{rt.label}</h4>
              <p className="text-[9px] text-neutral-500 mt-0.5 leading-relaxed">{rt.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Export Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 rounded-2xl border border-white/[0.06] bg-[#1A0F08]/30 p-5 space-y-5">
          <h3 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase flex items-center gap-2">
            <Download size={14} /> Gerador de Exportação
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium">Formato do Arquivo</label>
              <div className="grid grid-cols-2 gap-2">
                {['csv', 'pdf'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`py-2.5 rounded-lg font-bold border transition-all text-center ${
                      format === f
                        ? 'bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#C9A84C]'
                        : 'border-white/10 text-neutral-400 bg-transparent hover:bg-white/[0.03]'
                    }`}
                  >
                    {f === 'csv' ? 'Excel / CSV' : 'Documento PDF'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium">Período de Extração</label>
              <select className="w-full bg-[#1A0F08] border border-white/10 rounded-lg py-2.5 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]">
                <option value="this_month">Mês Atual (Maio/2026)</option>
                <option value="last_month">Mês Anterior (Abril/2026)</option>
                <option value="last_week">Última Semana</option>
                <option value="today">Vendas de Hoje</option>
                <option value="q1">1º Trimestre 2026</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Compilando...</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Baixar Relatório</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#1A0F08]/30 p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase flex items-center gap-2">
            <FileText size={14} /> Relatórios Recentes Gerados
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-neutral-500 uppercase text-[9px] tracking-wider font-bold">
                  <th className="py-3 pr-4">Relatório</th>
                  <th className="py-3 pr-4">Período</th>
                  <th className="py-3 pr-4">Gerado em</th>
                  <th className="py-3 pr-4">Tamanho</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-neutral-300">
                {recentReports.map((report) => {
                  const rt = reportTypes.find(r => r.id === report.type)
                  const Icon = rt?.icon || FileText
                  return (
                    <tr key={report.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Icon size={13} style={{ color: rt?.color || '#888' }} />
                          </div>
                          <span className="font-semibold text-[#FAF6EF]">{report.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-neutral-400 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar size={10} />
                          {report.period}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-neutral-500 whitespace-nowrap">{report.generated}</td>
                      <td className="py-3 pr-4 text-neutral-500 font-mono">{report.size}</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle size={8} /> Pronto
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button className="p-1.5 rounded-lg border border-white/10 hover:border-[#C9A84C]/30 text-neutral-400 hover:text-[#C9A84C] transition-all bg-white/5">
                          <Download size={12} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
