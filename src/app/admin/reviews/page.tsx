'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Star, 
  ArrowLeft, 
  Plus, 
  Calendar, 
  MessageSquare, 
  RefreshCw,
  X,
  ThumbsUp,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  source: 'google' | 'ifood' | 'whatsapp' | 'manual'
  review_date: string
  is_featured: boolean
}

export default function ReviewsPage() {
  const supabase = createClient()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [source, setSource] = useState<'google' | 'ifood' | 'whatsapp' | 'manual'>('manual')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .order('review_date', { ascending: false })
      setReviews(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName) return

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          customer_name: customerName,
          rating,
          comment: comment || null,
          source,
          is_featured: rating >= 4
        })

      if (error) throw error
      setModalOpen(false)
      setCustomerName('')
      setRating(5)
      setComment('')
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_featured: !current })
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredReviews = reviews.filter((r) => {
    return filterRating === 'all' || r.rating === filterRating
  })

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 5

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
            Avaliações & Clientes ⭐
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Painel consolidado do Google My Business, iFood reviews e formulário público de satisfação.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setModalOpen(true)}
            className="btn-premium-gold h-[38px] px-4"
          >
            <Plus size={14} /> Lançar Depoimento
          </button>
          <button
            onClick={fetchData}
            className="btn-premium-ghost w-[38px] h-[38px] flex items-center justify-center"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Nota Média Global', value: `${averageRating.toFixed(1)} / 5.0`, color: '#C9A84C', badge: 'Satisfação' },
          { label: 'Total de Avaliações', value: reviews.length, color: '#FAF6EF', badge: 'Recolhidas' },
          { label: 'Nota Máxima (5 estrelas)', value: reviews.filter(r => r.rating === 5).length, color: '#10B981', badge: 'Promotores' },
          { label: 'Destaques no Site', value: reviews.filter(r => r.is_featured).length, color: '#3B82F6', badge: 'Landing Page' }
        ].map((item, idx) => (
          <div key={idx} className="p-4 admin-glass-card border-[#C9A84C]/15 relative overflow-hidden">
            <span className="text-[10px] font-extrabold text-[#9E7A2E] uppercase tracking-wider block">{item.label}</span>
            <span className="text-base lg:text-lg font-bold text-[#FAF6EF] mt-1 block tracking-tight" style={{ color: item.color, fontFamily: 'var(--font-serif)' }}>{item.value}</span>
            <span className="text-[8px] font-extrabold uppercase mt-2 px-2 py-0.5 rounded border border-[#C9A84C]/15 bg-[#C9A84C]/10 text-[#C9A84C] w-max block tracking-wider">{item.badge}</span>
          </div>
        ))}
      </div>

      {/* Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 admin-glass-card border-[#C9A84C]/15">
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="text-xs text-neutral-400 mr-2">Filtrar por estrelas:</span>
          <div className="flex gap-1.5 flex-wrap">
            {['all', 5, 4, 3, 2, 1].map((val) => (
              <button
                key={val}
                onClick={() => setFilterRating(val as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterRating === val 
                    ? 'btn-premium-gold border-none font-bold' 
                    : 'btn-premium-ghost border border-white/10'
                }`}
              >
                {val === 'all' ? 'Ver Todas' : `${val} ★`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
          <p className="text-xs text-neutral-400">Carregando depoimentos...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="admin-glass-card p-12 text-center border-[#C9A84C]/15">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
            <MessageSquare size={20} />
          </div>
          <h3 className="text-sm font-bold text-[#FAF6EF]">Nenhum depoimento localizado</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            Experimente mudar o filtro de estrelas ou adicione novas avaliações manuais.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className="p-5 admin-glass-card border-[#C9A84C]/15 relative flex flex-col justify-between"
            >

              <div>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-[#FAF6EF] text-sm">{r.customer_name}</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-widest">{r.source} • {new Date(r.review_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-neutral-700'} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  &ldquo;{r.comment || 'Sem comentários, apenas avaliação por estrelas.'}&rdquo;
                </p>
              </div>

              <div className="flex justify-end mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleToggleFeatured(r.id, r.is_featured)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold transition-all border ${
                    r.is_featured
                      ? 'bg-[#3B82F6]/20 border-[#3B82F6]/40 text-blue-200'
                      : 'btn-premium-ghost border-white/10'
                  }`}
                >
                  <ThumbsUp size={10} />
                  {r.is_featured ? 'Destacado no Site' : 'Destacar no Site'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-neutral-900/95 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4 relative backdrop-blur-xl"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-[#FAF6EF] transition-all btn-premium-ghost p-1.5"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[9px] font-extrabold text-[#C9A84C] tracking-widest uppercase">Novo Depoimento</span>
              <h3 className="text-sm font-bold text-[#FAF6EF] mt-1">Lançar Avaliação Manual</h3>
              <p className="text-[10px] text-neutral-500">Adicione feedbacks recebidos no balcão ou WhatsApp.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-black/60 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Estrelas (1 a 5)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-black/60 transition-all font-medium"
                  >
                    <option value="5">5 Estrelas (Excelente)</option>
                    <option value="4">4 Estrelas (Muito Bom)</option>
                    <option value="3">3 Estrelas (Regular)</option>
                    <option value="2">2 Estrelas (Ruim)</option>
                    <option value="1">1 Estrela (Péssimo)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Canal Recebimento</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-black/60 transition-all font-medium"
                  >
                    <option value="manual">Balcão / Caixa</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="google">Google My Business</option>
                    <option value="ifood">iFood Review</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Comentário / Depoimento</label>
                <textarea
                  placeholder="Mensagem deixada pelo cliente..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-[#FAF6EF] focus:outline-none focus:border-[#C9A84C]/50 focus:bg-black/60 transition-all font-medium h-20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-premium-gold h-[38px]"
              >
                Salvar Avaliação
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
