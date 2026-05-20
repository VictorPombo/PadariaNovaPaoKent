'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Brain, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  TrendingUp, 
  DollarSign, 
  Package,
  Wrench
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá, Hadi! Sou a sua IA Gerencial da Padaria Nova Paokent. Posso analisar o CMV, faturamento de hoje, desperdício ou prever o fluxo de clientes. Qual insights contábeis você precisa hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMsg,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }])

    setLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      let reply = 'Interessante! Vamos analisar isso com base no banco de dados. De acordo com as últimas vendas, o canal de faturamento iFood lidera as margens líquidas esta semana. O CMV ideal está oscilando em torno de 32%, sugerindo que o ajuste manual do estoque para farinha e laticínios está correto.'

      const msgLower = userMsg.toLowerCase()
      if (msgLower.includes('cmv') || msgLower.includes('custo')) {
        reply = 'Analisando os registros do DRE de Maio, o Custo de Mercadorias Vendidas (CMV) acumulado é de 32.0%. A principal recomendação é otimizar as perdas por sobras de balcão (desperdício), que representam R$ 340,00 esta semana.'
      } else if (msgLower.includes('fluxo') || msgLower.includes('pico') || msgLower.includes('visita')) {
        reply = 'De acordo com o log do Fluxo Presencial, o pico de clientes ocorre aos sábados e domingos entre as 8h e 10h da manhã. Sugiro realocar mais um atendente do turno da tarde para apoiar o caixa matutino.'
      } else if (msgLower.includes('faturamento') || msgLower.includes('venda') || msgLower.includes('dinheiro')) {
        reply = 'Seu faturamento bruto acumulado está dentro da meta diária estipulada de R$ 5.000,00. No momento, o ticket médio geral está em R$ 37,80, impulsionado pelas vendas de combos no balcão.'
      } else if (msgLower.includes('estoque') || msgLower.includes('insumo')) {
        reply = 'Identifiquei que 3 insumos de panificação estão abaixo do nível mínimo de estoque. Recomendo abrir uma cotação de compra para Farinha de Trigo Tipo 1 e Manteiga com Sal.'
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }])
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/dashboard" className="text-[#C9A84C] hover:underline flex items-center gap-1 text-xs">
              <ArrowLeft size={12} /> Dashboard
            </Link>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#FAF6EF]" style={{ fontFamily: 'var(--font-serif)' }}>
            IA Gerencial & Insights 🧠
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Assistente executivo inteligente conectado em tempo real à base de vendas, estoque e CMV da padaria.
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
        {/* Chat Drawer */}
        <div className="flex-1 flex flex-col rounded-2xl border border-white/[0.06] bg-[#121212]/30 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2 flex-shrink-0">
            <Sparkles size={16} className="text-[#C9A84C] animate-pulse" />
            <span className="text-xs font-bold text-[#FAF6EF]">Chat Inteligente Nova Paokent</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                  msg.role === 'user'
                    ? 'bg-[#C9A84C]/10 border-[#C9A84C]/35 text-[#C9A84C]'
                    : 'bg-[#160D09] border-white/5 text-[#FAF6EF]'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] font-medium rounded-tr-none'
                    : 'bg-[#121212] border border-white/5 text-neutral-200 rounded-tl-none'
                }`}>
                  <p>{msg.content}</p>
                  <span className={`text-[9px] block mt-1.5 text-right ${msg.role === 'user' ? 'text-[#2C1A0E]/70' : 'text-neutral-500'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#160D09] border border-white/5 text-[#FAF6EF]">
                  <Bot size={14} />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#121212] border border-white/5 text-xs text-neutral-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/[0.06] bg-white/[0.01] flex items-center gap-3 flex-shrink-0">
            <input
              type="text"
              placeholder="Digite sua dúvida de negócios (ex: Qual nosso CMV atual?)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-xs text-[#FAF6EF] placeholder-neutral-500 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-[#9E7A2E] to-[#C9A84C] text-[#2C1A0E] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

        {/* Suggestion Prompts Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-3 flex-shrink-0">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Dicas de Insights</p>
          {[
            { q: 'Qual nosso CMV este mês?', label: 'Análise de CMV contábil', icon: TrendingUp },
            { q: 'Qual é o horário de pico de visitas?', label: 'Previsão de Fluxo', icon: Package },
            { q: 'Recomendações para redução de perdas', label: 'Estratégias de Desperdício', icon: Wrench },
            { q: 'Como estão as vendas do iFood?', label: 'Canal de Vendas Performance', icon: DollarSign }
          ].map((prompt, idx) => {
            const Icon = prompt.icon
            return (
              <button
                key={idx}
                onClick={() => setInput(prompt.q)}
                className="p-3 rounded-xl border border-white/[0.05] hover:border-[#C9A84C]/35 bg-[#121212]/30 hover:bg-[#121212]/50 text-left text-xs transition-all duration-300 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <Icon size={12} className="text-[#C9A84C]" />
                  <span className="font-semibold text-[#FAF6EF]">{prompt.label}</span>
                </div>
                <p className="text-[10px] text-neutral-500 truncate">{prompt.q}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
