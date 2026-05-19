import Link from 'next/link'

export default function AdminRootPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 text-4xl"
          style={{ background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)' }}
        >
          🍞
        </div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: '#FAF6EF', fontFamily: 'var(--font-playfair)' }}
        >
          Bem-vindo ao Painel
        </h1>
        <p className="mb-6" style={{ color: '#888888' }}>
          Padaria Nova Paokent — Gestão Inteligente
        </p>
        <Link
          href="/admin/dashboard"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
          style={{
            background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
            color: '#2C1A0E',
            textDecoration: 'none',
          }}
        >
          Ir para o Dashboard →
        </Link>
      </div>
    </div>
  )
}
