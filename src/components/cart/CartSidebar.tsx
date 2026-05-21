'use client'

import React, { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, Send, X, MapPin, Loader2, AlertCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const WHATSAPP_PHONE = '5511976535789'
const PADARIA_LAT = -23.5829662
const PADARIA_LNG = -46.688023
const MAX_RADIUS_KM = 3

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function CartSidebar() {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem, clearCart, cartTotal, cartCount } = useCart()

  const [step, setStep] = useState<'cart' | 'cep' | 'address'>('cart')
  
  // CEP step state
  const [cep, setCep] = useState('')
  const [loadingCep, setLoadingCep] = useState(false)
  const [cepError, setCepError] = useState('')
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  
  // Address step state
  const [addressData, setAddressData] = useState({
    street: '',
    neighborhood: '',
    city: '',
    state: ''
  })
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [observations, setObservations] = useState('')
  const [wantsCpf, setWantsCpf] = useState(false)
  const [cpf, setCpf] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  // Reset steps when closed or emptied
  useEffect(() => {
    if (!cartOpen || cart.length === 0) {
      setStep('cart')
      setCep('')
      setCepError('')
      setDistanceKm(null)
      setNumber('')
      setComplement('')
      setObservations('')
      setWantsCpf(false)
      setCpf('')
      setPaymentMethod('')
    }
  }, [cartOpen, cart.length])

  // Handle CEP change and auto-fetch
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 8) val = val.slice(0, 8)
    
    // Mask logic: 00000-000
    let masked = val
    if (val.length > 5) masked = `${val.slice(0,5)}-${val.slice(5)}`
    
    setCep(masked)

    if (val.length === 8) {
      await fetchAddress(val)
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 11) val = val.slice(0, 11)
    
    // Mask logic: 000.000.000-00
    let masked = val
    if (val.length > 9) {
      masked = `${val.slice(0,3)}.${val.slice(3,6)}.${val.slice(6,9)}-${val.slice(9)}`
    } else if (val.length > 6) {
      masked = `${val.slice(0,3)}.${val.slice(3,6)}.${val.slice(6)}`
    } else if (val.length > 3) {
      masked = `${val.slice(0,3)}.${val.slice(3)}`
    }
    
    setCpf(masked)
  }

  const fetchAddress = async (cleanCep: string) => {
    setLoadingCep(true)
    setCepError('')
    setDistanceKm(null)
    
    try {
      const res = await fetch(`https://cep.awesomeapi.com.br/json/${cleanCep}`)
      const data = await res.json()
      
      if (!res.ok || data.code === 'invalid_cep' || data.code === 'not_found') {
        setCepError('CEP não encontrado. Verifique se digitou corretamente.')
        setLoadingCep(false)
        return
      }

      if (!data.lat || !data.lng) {
        setCepError('Não foi possível obter a localização exata deste CEP.')
        setLoadingCep(false)
        return
      }

      const dist = getDistanceFromLatLonInKm(PADARIA_LAT, PADARIA_LNG, parseFloat(data.lat), parseFloat(data.lng))
      setDistanceKm(dist)
      
      if (dist > MAX_RADIUS_KM) {
        setCepError(`Desculpe, entregamos apenas num raio de ${MAX_RADIUS_KM}km da padaria. Você está a ${dist.toFixed(1).replace('.', ',')}km de distância.`)
      } else {
        setAddressData({
          street: data.address,
          neighborhood: data.district,
          city: data.city,
          state: data.state
        })
        setStep('address') // Auto advance!
      }
    } catch (err) {
      setCepError('Erro ao buscar o CEP. Tente novamente.')
    } finally {
      setLoadingCep(false)
    }
  }

  const sendWhatsApp = () => {
    if (!number.trim()) {
      alert('Por favor, informe o número do endereço.')
      return
    }
    if (!paymentMethod) {
      alert('Por favor, selecione a forma de pagamento.')
      return
    }

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)
    let msg = '*NOVO PEDIDO - PADARIA NOVA PÃO KENT*\n'
    msg += '------------------------------------\n\n'
    cart.forEach((item, idx) => {
      msg += `Item ${idx + 1}: ${item.name}\n`
      msg += `Quantidade: ${item.quantity}x\n`
      msg += `Valor: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`
    })
    msg += '------------------------------------\n'
    msg += `*TOTAL A PAGAR: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`
    
    const fullAddress = `${addressData.street}, ${number} ${complement ? `- ${complement}` : ''}\nBairro: ${addressData.neighborhood}\nCEP: ${cep}`
    msg += `*ENDEREÇO PARA ENTREGA:*\n${fullAddress}\n\n`
    
    if (observations.trim()) {
      msg += `*OBSERVAÇÕES:*\n${observations.trim()}\n\n`
    }
    
    if (wantsCpf && cpf.trim()) {
      msg += `*CPF NA NOTA:* ${cpf}\n\n`
    }
    
    msg += `*FORMA DE PAGAMENTO:* ${paymentMethod}\n\n`
    
    msg += 'Aguardando confirmação. Muito obrigado!'

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank')
    setCartOpen(false)
    clearCart()
  }

  if (cart.length === 0) return null

  return (
    <>
      {/* Botão flutuante quando o carrinho está fechado */}
      {!cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          style={{
            position: 'fixed',
            bottom: '100px', // Adjusted to not block WhatsApp button
            right: '24px',
            zIndex: 99,
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
            color: '#2C1A0E',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 30px rgba(201,168,76,0.4)',
            transition: 'all 0.3s',
          }}
        >
          <ShoppingCart size={26} />
          <span
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#EF4444',
              color: 'white',
              fontSize: '12px',
              fontWeight: '800',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #1A0F08',
            }}
          >
            {cartCount}
          </span>
        </button>
      )}

      {/* Sidebar Overlay e Painel */}
      {cartOpen && (
        <>
          {/* Overlay escuro opcional para destacar o carrinho */}
          <div 
            onClick={() => setCartOpen(false)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 9998,
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '380px',
              maxWidth: '100%',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(26,15,8,0.98)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(201,168,76,0.25)',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Cabeçalho do Carrinho */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid rgba(201,168,76,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShoppingCart size={20} style={{ color: '#C9A84C' }} />
                <span style={{ color: '#FAF6EF', fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-playfair)' }}>Seu Pedido</span>
                <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '600', background: 'rgba(201,168,76,0.12)', padding: '4px 10px', borderRadius: '999px' }}>{cartCount} itens</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'rgba(250,246,239,0.8)', padding: '8px', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {step === 'cart' && (
              <>
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                        <p style={{ color: '#FAF6EF', fontSize: '15px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                        <p style={{ color: '#C9A84C', fontSize: '14px', fontWeight: '700', margin: '4px 0 0' }}>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#FAF6EF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ color: '#FAF6EF', fontSize: '15px', fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.1)', color: '#C9A84C', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.08)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: '24px',
                    borderTop: '1px solid rgba(201,168,76,0.15)',
                    background: 'rgba(201,168,76,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ color: 'rgba(250,246,239,0.6)', fontSize: '15px', fontWeight: '600' }}>Total do Pedido</span>
                    <span style={{ color: '#C9A84C', fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-playfair)' }}>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <button
                    onClick={() => setStep('cep')}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#25D366',
                      color: 'white',
                      fontWeight: '800',
                      fontSize: '16px',
                      padding: '18px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      boxShadow: '0 8px 25px rgba(37,211,102,0.3)',
                      transition: 'all 0.2s',
                    }}
                  >
                    Avançar para Entrega
                  </button>
                </div>
              </>
            )}

            {step === 'cep' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
                <h3 style={{ color: '#FAF6EF', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Onde vamos entregar?</h3>
                <p style={{ color: 'rgba(250,246,239,0.6)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                  Entregamos apenas num raio de <strong>3km</strong> da nossa padaria (Jardim Paulistano). Informe seu CEP para verificarmos.
                </p>

                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      paddingLeft: '48px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${cepError ? '#EF4444' : 'rgba(255,255,255,0.15)'}`,
                      borderRadius: '12px',
                      color: '#FAF6EF',
                      fontSize: '18px',
                      outline: 'none',
                      letterSpacing: '0.1em',
                    }}
                  />
                  <MapPin 
                    size={20} 
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(250,246,239,0.4)' }} 
                  />
                  {loadingCep && (
                    <Loader2 
                      size={20} 
                      className="animate-spin"
                      style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#C9A84C' }} 
                    />
                  )}
                </div>

                {cepError && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '16px', padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px' }}>
                    <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ color: '#EF4444', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>{cepError}</p>
                  </div>
                )}

                <button
                  onClick={() => setStep('cart')}
                  style={{ marginTop: 'auto', padding: '14px', background: 'transparent', color: 'rgba(250,246,239,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Voltar para o Carrinho
                </button>
              </div>
            )}

            {step === 'address' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ color: '#FAF6EF', fontSize: '18px', fontWeight: '700', margin: 0 }}>Detalhes do Endereço</h3>
                  {distanceKm && (
                    <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '4px 8px', borderRadius: '4px', fontWeight: '700' }}>
                      Dentro da área ({distanceKm.toFixed(1).replace('.', ',')}km)
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(250,246,239,0.6)', fontSize: '13px', marginBottom: '6px' }}>Rua e Bairro</label>
                    <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(250,246,239,0.5)', fontSize: '15px' }}>
                      {addressData.street} - {addressData.neighborhood}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', color: 'rgba(250,246,239,0.8)', fontSize: '13px', marginBottom: '6px' }}>Número*</label>
                      <input
                        type="text"
                        value={number}
                        onChange={e => setNumber(e.target.value)}
                        placeholder="Ex: 123"
                        style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '8px', color: '#FAF6EF', fontSize: '15px', outline: 'none' }}
                      />
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={{ display: 'block', color: 'rgba(250,246,239,0.8)', fontSize: '13px', marginBottom: '6px' }}>Complemento</label>
                      <input
                        type="text"
                        value={complement}
                        onChange={e => setComplement(e.target.value)}
                        placeholder="Apto, Bloco, etc"
                        style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FAF6EF', fontSize: '15px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'rgba(250,246,239,0.8)', fontSize: '13px', marginBottom: '6px' }}>Forma de Pagamento*</label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FAF6EF', fontSize: '15px', outline: 'none' }}
                    >
                      <option value="" disabled style={{ background: '#1A0F08' }}>Selecione o pagamento</option>
                      <option value="Pix" style={{ background: '#1A0F08' }}>Pix</option>
                      <option value="Cartão de Crédito" style={{ background: '#1A0F08' }}>Cartão de Crédito</option>
                      <option value="Cartão de Débito" style={{ background: '#1A0F08' }}>Cartão de Débito</option>
                      <option value="Dinheiro" style={{ background: '#1A0F08' }}>Dinheiro</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'rgba(250,246,239,0.8)', fontSize: '13px', marginBottom: '6px' }}>Observações do Pedido</label>
                    <textarea
                      value={observations}
                      onChange={e => setObservations(e.target.value)}
                      placeholder="Ex: Tirar cebola, troco para 50, etc."
                      style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FAF6EF', fontSize: '15px', outline: 'none', resize: 'vertical', minHeight: '80px' }}
                    />
                  </div>

                  <div style={{ marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                      <label style={{ color: '#FAF6EF', fontSize: '14px', fontWeight: '600' }}>Deseja CPF na nota?</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setWantsCpf(true)}
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', background: wantsCpf ? '#C9A84C' : 'rgba(255,255,255,0.1)', color: wantsCpf ? '#1A0F08' : '#FAF6EF', transition: 'all 0.2s' }}
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setWantsCpf(false)}
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', background: !wantsCpf ? 'rgba(255,255,255,0.1)' : 'transparent', color: !wantsCpf ? '#FAF6EF' : 'rgba(250,246,239,0.5)', transition: 'all 0.2s' }}
                        >
                          Não
                        </button>
                      </div>
                    </div>
                    
                    {wantsCpf && (
                      <div style={{ marginTop: '12px' }}>
                        <input
                          type="text"
                          value={cpf}
                          onChange={handleCpfChange}
                          placeholder="Digite o CPF: 000.000.000-00"
                          style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '8px', color: '#FAF6EF', fontSize: '15px', outline: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '24px' }}>
                  <button
                    onClick={sendWhatsApp}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: 'white', fontWeight: '800', fontSize: '16px', padding: '18px', borderRadius: '12px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase' }}
                  >
                    <Send size={18} /> Confirmar e Enviar
                  </button>
                  <button
                    onClick={() => setStep('cep')}
                    style={{ width: '100%', padding: '14px', background: 'transparent', color: 'rgba(250,246,239,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Alterar CEP
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
