'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Gift, CheckCircle2, XCircle, Download } from 'lucide-react'

interface Birthday {
  id: string
  full_name: string
  whatsapp: string
  birth_day: number
  birth_month: number
  reward_claimed: boolean
  created_at: string
}

export default function BirthdaysAdmin() {
  const [items, setItems] = useState<Birthday[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase.from('birthdays').select('*').order('birth_month', { ascending: true }).order('birth_day', { ascending: true })
    if (data) setItems(data)
    setLoading(false)
  }

  async function toggleClaimed(id: string, currentStatus: boolean) {
    await supabase.from('birthdays').update({ reward_claimed: !currentStatus }).eq('id', id)
    fetchItems()
  }

  function formatPhone(phone: string) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  function exportCSV() {
    const headers = ['Nome', 'WhatsApp', 'Dia', 'Mes', 'Resgatado']
    const rows = items.map(i => [
      i.full_name,
      i.whatsapp,
      i.birth_day,
      i.birth_month,
      i.reward_claimed ? 'Sim' : 'Nao'
    ])
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'aniversariantes_paokent.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto text-[#FAF6EF]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#C9A84C] font-playfair mb-2 flex items-center gap-2">
            <Gift className="text-[#C9A84C]" /> Aniversariantes
          </h1>
          <p className="text-sm text-neutral-400">Gerencie os clientes cadastrados para ganhar o presente de aniversário.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <div className="bg-[#1A0F08]/40 border border-[#C9A84C]/20 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#C9A84C]/10 text-[#C9A84C] text-xs uppercase">
            <tr>
              <th className="p-4 font-semibold">Cliente</th>
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold">WhatsApp</th>
              <th className="p-4 font-semibold text-center">Status Presente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-neutral-400">Carregando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-neutral-400">Nenhum aniversariante cadastrado ainda.</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-semibold text-[#FAF6EF]">{item.full_name}</td>
                <td className="p-4">{String(item.birth_day).padStart(2, '0')}/{String(item.birth_month).padStart(2, '0')}</td>
                <td className="p-4">
                  <a href={`https://wa.me/${item.whatsapp}`} target="_blank" rel="noreferrer" className="text-green-400 hover:underline">
                    {formatPhone(item.whatsapp)}
                  </a>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => toggleClaimed(item.id, item.reward_claimed)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${item.reward_claimed ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}
                  >
                    {item.reward_claimed ? <><CheckCircle2 size={14}/> Entregue</> : <><XCircle size={14}/> Pendente</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
