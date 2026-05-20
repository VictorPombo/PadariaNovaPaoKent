'use client'

import { useState } from 'react'
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Calendar, 
  Layers,
  ArrowUpRight,
  RefreshCw,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales')
  const [format, setFormat] = useState('csv')
  const [exporting, setExporting] = useState(false)

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      alert(`Relatório exportado com sucesso em formato ${format.toUpperCase()}!`)
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
            Centro de Relatórios & Auditorias 📁
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Exporte tabelas de vendas, inventários, perdas contábeis e logs em formatos universais (CSV/PDF).
          </p>
        </div>
      </div>

      {/* Grid Filter Box */}
      <div className="max-w-xl rounded-2xl border border-[#C9A84C]/20 bg-[#121212]/40 p-6 space-y-5">
        <h3 className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase">Gerador de Exportação</h3>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-neutral-400 font-medium">Selecione o Relatório</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-lg py-2.5 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C] cursor-pointer"
            >
              <option value="sales">Vendas & Pedidos Consolidados (Faturamento)</option>
              <option value="inventory">Fechamento de Estoque & CMC</option>
              <option value="waste">Histórico de Desperdício & CMV</option>
              <option value="expenses">Gastos Fixos & Despesas Contábeis</option>
              <option value="foot-traffic">Fluxo de Clientes e Horas de Pico</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium">Formato do Arquivo</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`py-2 rounded-lg font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    format === 'csv'
                      ? 'bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#C9A84C]'
                      : 'border-white/10 text-neutral-400 bg-transparent'
                  }`}
                >
                  Excel / CSV
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`py-2 rounded-lg font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    format === 'pdf'
                      ? 'bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#C9A84C]'
                      : 'border-white/10 text-neutral-400 bg-transparent'
                  }`}
                >
                  Documento PDF
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400 font-medium">Período de Extração</label>
              <select
                className="w-full bg-[#121212] border border-white/10 rounded-lg py-2.5 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
              >
                <option value="this_month">Mês Atual (Maio/2026)</option>
                <option value="last_month">Mês Anterior (Abril/2026)</option>
                <option value="today">Vendas de Hoje</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Compilando Relatório...</span>
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
    </div>
  )
}
