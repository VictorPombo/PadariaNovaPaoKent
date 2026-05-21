'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react'

interface DailyBread {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  is_active: boolean
}

export default function DailyBreadAdmin() {
  const [items, setItems] = useState<DailyBread[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Form
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    const { data } = await supabase.from('daily_bread').select('*').order('created_at', { ascending: false })
    if (data) setItems(data)
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !description || !price || !imageUrl) return alert('Preencha todos os campos')

    const { error } = await supabase.from('daily_bread').insert([
      { name, description, price: parseFloat(price.replace(',', '.')), image_url: imageUrl }
    ])
    if (!error) {
      setName(''); setDescription(''); setPrice(''); setImageUrl('')
      fetchItems()
    } else {
      alert('Erro ao salvar no banco. Verifique as permissões.')
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    // If activating, we should probably deactivate others, but let's just do a simple toggle for now
    if (!currentStatus) {
      // Deactivate all others
      await supabase.from('daily_bread').update({ is_active: false }).neq('id', id)
    }
    await supabase.from('daily_bread').update({ is_active: !currentStatus }).eq('id', id)
    fetchItems()
  }

  async function deleteItem(id: string) {
    if (!confirm('Tem certeza?')) return
    await supabase.from('daily_bread').delete().eq('id', id)
    fetchItems()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-[#FAF6EF]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#C9A84C] font-playfair mb-2">Pão do Dia</h1>
        <p className="text-sm text-neutral-400">Configure o pão de destaque que aparece no topo do site.</p>
      </div>

      <div className="bg-[#1A0F08]/40 border border-[#C9A84C]/20 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Adicionar Novo Pão</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Nome</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-[#C9A84C]" placeholder="Ex: Baguete Francesa" />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Preço (R$)</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-[#C9A84C]" placeholder="Ex: 14,90" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-neutral-400 mb-1">Descrição curta</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-[#C9A84C]" placeholder="Ex: Assada hoje de manhã, super crocante..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-neutral-400 mb-1">URL da Imagem</label>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-[#C9A84C]" placeholder="Cole o link da foto do pão" />
          </div>
          <div className="md:col-span-2 mt-2">
            <button type="submit" className="bg-[#C9A84C] text-[#1A0F08] font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#E2C06E] transition-colors">
              <Plus size={16} /> Salvar Pão
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[#1A0F08]/40 border border-[#C9A84C]/20 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#C9A84C]/10 text-[#C9A84C] text-xs uppercase">
            <tr>
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold">Preço</th>
              <th className="p-4 font-semibold text-center">Status no Site</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-neutral-400">Carregando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-neutral-400">Nenhum pão cadastrado.</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                    <div>
                      <p className="font-semibold text-[#FAF6EF]">{item.name}</p>
                      <p className="text-xs text-neutral-400 max-w-[200px] truncate">{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">R$ {item.price.toFixed(2).replace('.', ',')}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => toggleActive(item.id, item.is_active)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${item.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'}`}
                  >
                    {item.is_active ? <><CheckCircle2 size={12}/> Ativo</> : <><XCircle size={12}/> Inativo</>}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteItem(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
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
