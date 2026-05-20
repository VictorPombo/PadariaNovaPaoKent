'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  ClipboardList, 
  ArrowLeft, 
  Plus, 
  Layers, 
  Trash2,
  RefreshCw,
  X,
  Star,
  CheckCircle2,
  AlertTriangle,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface MenuCategory {
  id: string
  name: string
}

interface MenuItem {
  id: string
  name: string
  price_small: number | null
  price_large: number | null
  cost_estimate: number | null
  is_active: boolean
  is_featured: boolean
  tags: string[]
  menu_categories?: MenuCategory | null
}

export default function MenuPage() {
  const supabase = createClient()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [priceSmall, setPriceSmall] = useState('')
  const [cost, setCost] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: items } = await supabase
        .from('menu_items')
        .select(`
          id, name, price_small, price_large, cost_estimate, is_active, is_featured, tags,
          menu_categories ( id, name )
        `)
        .order('name', { ascending: true })
      setMenuItems((items as any) || [])

      const { data: cats } = await supabase
        .from('menu_categories')
        .select('id, name')
      setCategories(cats || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_active: !current })
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_featured: !current })
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !priceSmall || !categoryId) return

    try {
      const { error } = await supabase
        .from('menu_items')
        .insert({
          name,
          category_id: categoryId,
          price_small: parseFloat(priceSmall),
          cost_estimate: cost ? parseFloat(cost) : 0,
          is_active: true,
          is_featured: false
        })

      if (error) throw error
      setModalOpen(false)
      setName('')
      setPriceSmall('')
      setCost('')
      setCategoryId('')
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCat = catFilter === 'all' || item.menu_categories?.id === catFilter
    return matchesSearch && matchesCat
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
            Cardápio & Menu 📋
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Gerenciamento de produtos, preços de venda, fichas técnicas estimadas de custo e destaques.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] text-xs font-bold uppercase tracking-wider shadow-md"
          >
            <Plus size={14} /> Novo Produto
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
          { label: 'Itens no Cardápio', value: menuItems.length, color: '#C9A84C', info: 'Itens totais' },
          { label: 'Produtos Ativos', value: menuItems.filter(i => i.is_active).length, color: '#10B981', info: 'Exibidos no site' },
          { label: 'Destaques Especiais', value: menuItems.filter(i => i.is_featured).length, color: '#3B82F6', info: 'Carrossel principal' },
          { label: 'Categorias do Menu', value: categories.length, color: '#F59E0B', info: 'Seções ativas' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/[0.06] bg-[#121212]/40 relative overflow-hidden">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">{item.label}</span>
            <span className="text-base lg:text-lg font-bold text-[#FAF6EF] mt-1 block" style={{ color: item.color, fontFamily: 'var(--font-serif)' }}>{item.value}</span>
            <span className="text-[9px] font-semibold text-neutral-500 mt-2 block">{item.info}</span>
          </div>
        ))}
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.06] bg-[#121212]/20">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar produtos (ex: Pão na chapa, Cappuccino)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-[#FAF6EF] placeholder-neutral-500 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#C9A84C]" />
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-xs text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C] cursor-pointer"
            >
              <option value="all" className="bg-[#121212]">Todas Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#121212]">{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of items */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando cardápio...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border border-white/[0.06] bg-[#121212]/30 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <ClipboardList size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhum produto cadastrado</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Experimente mudar os filtros ou adicione novos pães e confeitos ao cardápio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const margin = item.price_small && item.cost_estimate 
              ? ((item.price_small - item.cost_estimate) / item.price_small) * 100 
              : 0
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-white/[0.06] bg-[#121212]/40 relative flex flex-col justify-between hover:border-[#C9A84C]/30 transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-[#FAF6EF] text-sm leading-snug">{item.name}</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#C9A84C]">
                      {item.menu_categories?.name || 'Geral'}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline mt-3 border-b border-white/5 pb-2.5 text-xs">
                    <span className="text-neutral-500">Preço Venda:</span>
                    <span className="font-bold text-[#FAF6EF] text-sm">{formatCurrency(item.price_small || 0)}</span>
                  </div>

                  <div className="flex justify-between items-baseline mt-2 text-xs">
                    <span className="text-neutral-500">Custo Est. (CMV):</span>
                    <span className="font-semibold text-neutral-400">{formatCurrency(item.cost_estimate || 0)}</span>
                  </div>

                  {margin > 0 && (
                    <div className="flex justify-between items-baseline mt-2 text-xs">
                      <span className="text-neutral-500">Margem Estimada:</span>
                      <span className="font-bold text-[#10B981]">{margin.toFixed(0)}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                      item.is_featured 
                        ? 'bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#3B82F6]'
                        : 'border-white/10 text-neutral-400'
                    }`}
                  >
                    <Star size={10} className={item.is_featured ? 'fill-current' : ''} />
                    {item.is_featured ? 'Destaque' : 'Destacar'}
                  </button>

                  <button
                    onClick={() => handleToggleActive(item.id, item.is_active)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                      item.is_active 
                        ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    <CheckCircle2 size={10} />
                    {item.is_active ? 'Visível' : 'Oculto'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-[#160D09]/95 border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl space-y-4 relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-[#FAF6EF] transition-colors bg-white/5 border border-white/10 rounded-lg p-1.5"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Novo Produto</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Lançar Item ao Cardápio</h3>
              <p className="text-[10px] text-neutral-500">Ele ficará visível publicamente de imediato.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Nome do Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pão de queijo Premium, Waffle..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Preço Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={priceSmall}
                    onChange={(e) => setPriceSmall(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Custo Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Categoria</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="">Selecione...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-bold text-xs tracking-wider uppercase transition-all"
              >
                Cadastrar Produto
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
