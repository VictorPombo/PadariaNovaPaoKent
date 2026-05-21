'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Flame, Save } from 'lucide-react'

const availableSandwiches = [
  'Arthur Ramos',
  'Faria Lima',
  'Cidade Jardim',
  'Iguatemi'
]

export default function WeeklyHighlightAdmin() {
  const [sandwichName, setSandwichName] = useState(availableSandwiches[0])
  const [fakeCounter, setFakeCounter] = useState('47')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadCurrent() {
      const { data } = await supabase
        .from('weekly_highlight')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data) {
        setSandwichName(data.sandwich_name)
        setFakeCounter(data.fake_counter.toString())
      }
    }
    loadCurrent()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    // Deactivate previous
    await supabase.from('weekly_highlight').update({ is_active: false }).eq('is_active', true)
    
    // Insert new
    const { error } = await supabase.from('weekly_highlight').insert([
      { sandwich_name: sandwichName, fake_counter: parseInt(fakeCounter, 10), is_active: true }
    ])
    
    setSaving(false)
    if (error) {
      alert('Erro ao salvar destaque. Verifique as permissões do banco.')
    } else {
      alert('Destaque da semana atualizado com sucesso!')
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto text-[#FAF6EF]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#C9A84C] font-playfair mb-2">Destaque da Semana</h1>
        <p className="text-sm text-neutral-400">Escolha qual sanduíche especial receberá o crachá de mais pedido na landing page.</p>
      </div>

      <div className="bg-[#1A0F08]/40 border border-[#C9A84C]/20 rounded-xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#FAF6EF] mb-2">Qual sanduíche destacar?</label>
            <select 
              value={sandwichName} 
              onChange={e => setSandwichName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-[#C9A84C] text-[#FAF6EF]"
            >
              {availableSandwiches.map(s => (
                <option key={s} value={s} className="bg-[#2C1A0E] text-[#FAF6EF]">{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#FAF6EF] mb-2">
              Número de pedidos (Contador visual)
            </label>
            <p className="text-xs text-neutral-400 mb-2">Esse número aparecerá como "🔥 X pedidos essa semana" para gerar escassez/prova social.</p>
            <input 
              type="number" 
              value={fakeCounter} 
              onChange={e => setFakeCounter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-[#C9A84C]"
              placeholder="Ex: 47"
            />
          </div>

          <div className="pt-4 border-t border-white/10">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#1A0F08] font-bold px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Salvando...' : <><Save size={18} /> Publicar Destaque</>}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex gap-3">
        <Flame className="text-orange-500 flex-shrink-0" />
        <p className="text-sm text-orange-200">
          O sanduíche escolhido aparecerá em <strong>primeiro lugar</strong> na lista, ganhará uma borda dourada e o botão de compra enviará o cliente direto para o WhatsApp com uma mensagem exclusiva.
        </p>
      </div>
    </div>
  )
}
