'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  Settings, 
  Building, 
  Clock, 
  Coins, 
  Save, 
  Percent, 
  MapPin, 
  Globe, 
  Phone, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Coffee,
  Bell,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface AppSettingRow {
  key: string
  value: any
  description: string
}

export default function SettingsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'business' | 'financial' | 'operation'>('business')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Local state for settings keys
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Padaria Nova Paokent',
    phone: '11976535789',
    instagram: '@novapaokent',
    address: 'Rua Prof. Artur Ramos, 223 — Jardim Paulistano, São Paulo',
    google_maps_url: '',
    ifood_url: '',
    founded_year: 1994
  })

  const [dailyGoal, setDailyGoal] = useState({ amount: 5000 })
  
  const [shifts, setShifts] = useState({
    shift_1: { name: 'Turno 1', start: '06:00', end: '14:00' },
    shift_2: { name: 'Turno 2', start: '14:00', end: '22:00' }
  })

  const [expenseApproval, setExpenseApproval] = useState({ amount: 500 })
  const [wasteAlert, setWasteAlert] = useState({ percent: 1.5 })
  const [cmvAlert, setCmvAlert] = useState({ percent: 35 })
  const [whatsappReport, setWhatsappReport] = useState({ hour: 22, minute: 0 })

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
      
      if (error) throw error

      if (data) {
        data.forEach((row: AppSettingRow) => {
          switch (row.key) {
            case 'business_info':
              setBusinessInfo(row.value)
              break
            case 'daily_goal':
              setDailyGoal(row.value)
              break
            case 'shifts':
              setShifts(row.value)
              break
            case 'expense_approval_threshold':
              setExpenseApproval(row.value)
              break
            case 'waste_alert_threshold':
              setWasteAlert(row.value)
              break
            case 'cmv_alert_threshold':
              setCmvAlert(row.value)
              break
            case 'whatsapp_report_time':
              setWhatsappReport(row.value)
              break
          }
        });
      }
    } catch (err: any) {
      console.error('Erro ao carregar configurações:', err)
      showToast('Erro ao carregar configurações do banco de dados.', 'error')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  const handleSaveSetting = async (key: string, value: any) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      showToast('Configurações salvas com sucesso!', 'success')
    } catch (err: any) {
      console.error('Erro ao salvar:', err)
      showToast('Erro ao salvar as configurações no banco de dados.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const updates = [
        { key: 'business_info', value: businessInfo },
        { key: 'daily_goal', value: dailyGoal },
        { key: 'shifts', value: shifts },
        { key: 'expense_approval_threshold', value: expenseApproval },
        { key: 'waste_alert_threshold', value: wasteAlert },
        { key: 'cmv_alert_threshold', value: cmvAlert },
        { key: 'whatsapp_report_time', value: whatsappReport }
      ]

      for (const item of updates) {
        const { error } = await supabase
          .from('app_settings')
          .upsert({
            key: item.key,
            value: item.value,
            updated_at: new Date().toISOString()
          })
        if (error) throw error
      }

      showToast('Todas as alterações salvas com sucesso!', 'success')
    } catch (err: any) {
      console.error('Erro ao salvar tudo:', err)
      showToast('Falha ao salvar as configurações.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'business', label: 'Empresa', icon: Building, desc: 'Dados e links da padaria' },
    { id: 'financial', label: 'Financeiro & CMV', icon: Coins, desc: 'Metas e limites do sistema' },
    { id: 'operation', label: 'Operação', icon: Clock, desc: 'Turnos e relatórios diários' }
  ] as const

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/80 border-red-500/30 text-red-300'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-xs font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/dashboard" className="text-[#C9A84C] hover:underline flex items-center gap-1 text-xs">
              <ArrowLeft size={12} /> Dashboard
            </Link>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#FAF6EF]" style={{ fontFamily: 'var(--font-serif)' }}>
            Configurações do Sistema
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Gerencie os parâmetros de controle financeiro, turnos de funcionários, alertas de CMV e dados de exibição.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            className="p-2.5 rounded-xl border border-white/10 text-neutral-400 hover:text-[#FAF6EF] transition-all bg-white/5"
            title="Recarregar do banco"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={handleSaveAll}
            disabled={loading || saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E3C26F] text-[#2C1A0E] font-bold text-xs shadow-lg hover:shadow-[#C9A84C]/15 transition-all disabled:opacity-50"
          >
            <Save size={14} className={saving ? 'animate-spin' : ''} />
            <span>Salvar Tudo</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando configurações...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="md:col-span-1 space-y-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#C9A84C]/10 to-transparent border-[#C9A84C]/45 text-[#FAF6EF]'
                      : 'bg-white/[0.01] border-white/[0.04] text-neutral-400 hover:bg-white/[0.03] hover:text-[#FAF6EF]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-[#C9A84C] text-[#2C1A0E]' : 'bg-white/5 text-neutral-400'
                  }`}>
                    <TabIcon size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold leading-tight">{tab.label}</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{tab.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Tab Contents */}
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'business' && (
                <motion.div
                  key="business"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="p-6 rounded-2xl border border-white/[0.06] bg-[#140C08]/85 backdrop-blur-md space-y-6"
                >
                  <div>
                    <h2 className="text-sm font-bold text-[#FAF6EF] flex items-center gap-2">
                      <Building size={16} className="text-[#C9A84C]" />
                      Informações da Empresa
                    </h2>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Estes dados são mostrados na landing page do cliente e nos cabeçalhos de notas/relatórios.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Nome Fantasia</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"><Coffee size={14} /></span>
                        <input
                          type="text"
                          value={businessInfo.name}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Telefone / WhatsApp</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"><Phone size={14} /></span>
                        <input
                          type="text"
                          value={businessInfo.phone}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        />
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Instagram</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"><Globe size={14} /></span>
                        <input
                          type="text"
                          value={businessInfo.instagram}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, instagram: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        />
                      </div>
                    </div>

                    {/* Founded Year */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Ano de Fundação</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"><Calendar size={14} /></span>
                        <input
                          type="number"
                          value={businessInfo.founded_year}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, founded_year: parseInt(e.target.value) || 1994 })}
                          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Endereço Completo</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 text-neutral-500"><MapPin size={14} /></span>
                        <textarea
                          rows={2}
                          value={businessInfo.address}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 resize-none"
                        />
                      </div>
                    </div>

                    {/* Google Maps URL */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">URL do Google Maps</label>
                      <input
                        type="text"
                        value={businessInfo.google_maps_url}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, google_maps_url: e.target.value })}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        placeholder="https://maps.google.com/?q=..."
                      />
                    </div>

                    {/* iFood URL */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">URL do Canal iFood</label>
                      <input
                        type="text"
                        value={businessInfo.ifood_url}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, ifood_url: e.target.value })}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        placeholder="https://www.ifood.com.br/delivery/..."
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleSaveSetting('business_info', businessInfo)}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#C9A84C]/20 hover:bg-[#C9A84C]/10 text-xs font-bold text-[#C9A84C] transition-all"
                    >
                      <Save size={12} />
                      <span>Salvar Negócio</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'financial' && (
                <motion.div
                  key="financial"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="p-6 rounded-2xl border border-white/[0.06] bg-[#140C08]/85 backdrop-blur-md space-y-6"
                >
                  <div>
                    <h2 className="text-sm font-bold text-[#FAF6EF] flex items-center gap-2">
                      <Coins size={16} className="text-[#C9A84C]" />
                      Configurações Financeiras & Alertas
                    </h2>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Determine as metas e as margens aceitáveis para as operações automáticas da padaria.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Daily Sales Goal */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Meta Diária Faturamento</label>
                        <span className="text-[9px] text-neutral-500">R$ {dailyGoal.amount.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"><DollarSign size={14} /></span>
                        <input
                          type="number"
                          value={dailyGoal.amount}
                          onChange={(e) => setDailyGoal({ amount: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        />
                      </div>
                    </div>

                    {/* Expense Approval Threshold */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Alçada de Aprovação de Gasto</label>
                        <span className="text-[9px] text-neutral-500">Acima de R$ {expenseApproval.amount} requer aval</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"><DollarSign size={14} /></span>
                        <input
                          type="number"
                          value={expenseApproval.amount}
                          onChange={(e) => setExpenseApproval({ amount: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        />
                      </div>
                    </div>

                    {/* CMV Threshold */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Limite de CMV Crítico</label>
                        <span className="text-[9px] text-amber-400">{cmvAlert.percent}%</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"><Percent size={14} /></span>
                        <input
                          type="number"
                          step="0.1"
                          value={cmvAlert.percent}
                          onChange={(e) => setCmvAlert({ percent: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        />
                      </div>
                      <p className="text-[9px] text-neutral-500">Lança um alerta se o Custo de Mercadorias Vendidas ultrapassar a margem.</p>
                    </div>

                    {/* Waste Percent Limit */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Tolerância de Desperdício</label>
                        <span className="text-[9px] text-red-400">{wasteAlert.percent}%</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"><Percent size={14} /></span>
                        <input
                          type="number"
                          step="0.05"
                          value={wasteAlert.percent}
                          onChange={(e) => setWasteAlert({ percent: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                        />
                      </div>
                      <p className="text-[9px] text-neutral-500">Alerta se perdas de produção superarem esta fatia da receita diária.</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={async () => {
                        await handleSaveSetting('daily_goal', dailyGoal)
                        await handleSaveSetting('expense_approval_threshold', expenseApproval)
                        await handleSaveSetting('cmv_alert_threshold', cmvAlert)
                        await handleSaveSetting('waste_alert_threshold', wasteAlert)
                      }}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#C9A84C]/20 hover:bg-[#C9A84C]/10 text-xs font-bold text-[#C9A84C] transition-all"
                    >
                      <Save size={12} />
                      <span>Salvar Financeiro</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'operation' && (
                <motion.div
                  key="operation"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="p-6 rounded-2xl border border-white/[0.06] bg-[#140C08]/85 backdrop-blur-md space-y-6"
                >
                  <div>
                    <h2 className="text-sm font-bold text-[#FAF6EF] flex items-center gap-2">
                      <Clock size={16} className="text-[#C9A84C]" />
                      Configuração de Turnos & Relatórios
                    </h2>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Defina os intervalos de trabalho para fechamento de caixa e envio de estatísticas automáticas.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Shift 1 */}
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                      <h3 className="text-xs font-bold text-[#FAF6EF]">{shifts.shift_1.name}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-400 font-bold uppercase">Entrada</label>
                          <input
                            type="time"
                            value={shifts.shift_1.start}
                            onChange={(e) => setShifts({
                              ...shifts,
                              shift_1: { ...shifts.shift_1, start: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-400 font-bold uppercase">Saída</label>
                          <input
                            type="time"
                            value={shifts.shift_1.end}
                            onChange={(e) => setShifts({
                              ...shifts,
                              shift_1: { ...shifts.shift_1, end: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shift 2 */}
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                      <h3 className="text-xs font-bold text-[#FAF6EF]">{shifts.shift_2.name}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-400 font-bold uppercase">Entrada</label>
                          <input
                            type="time"
                            value={shifts.shift_2.start}
                            onChange={(e) => setShifts({
                              ...shifts,
                              shift_2: { ...shifts.shift_2, start: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-400 font-bold uppercase">Saída</label>
                          <input
                            type="time"
                            value={shifts.shift_2.end}
                            onChange={(e) => setShifts({
                              ...shifts,
                              shift_2: { ...shifts.shift_2, end: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Whatsapp Report Time */}
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                      <h3 className="text-xs font-bold text-[#FAF6EF] flex items-center gap-2">
                        <Bell size={14} className="text-[#C9A84C]" />
                        Fechamento e Relatório Automático (WhatsApp)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-400 font-bold uppercase">Hora</label>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={whatsappReport.hour}
                            onChange={(e) => setWhatsappReport({ ...whatsappReport, hour: Math.min(23, Math.max(0, parseInt(e.target.value) || 0)) })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-neutral-400 font-bold uppercase">Minuto</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={whatsappReport.minute}
                            onChange={(e) => setWhatsappReport({ ...whatsappReport, minute: Math.min(59, Math.max(0, parseInt(e.target.value) || 0)) })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-white/[0.02] text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50"
                          />
                        </div>
                      </div>
                      <p className="text-[9px] text-neutral-500">Horário programado para consolidar o DRE/faturamento diário e notificar a gerência.</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={async () => {
                        await handleSaveSetting('shifts', shifts)
                        await handleSaveSetting('whatsapp_report_time', whatsappReport)
                      }}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#C9A84C]/20 hover:bg-[#C9A84C]/10 text-xs font-bold text-[#C9A84C] transition-all"
                    >
                      <Save size={12} />
                      <span>Salvar Operação</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
