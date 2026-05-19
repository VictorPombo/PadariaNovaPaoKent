import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard',
}

async function getDashboardData() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0]

  // Faturamento hoje
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('total, channel')
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)

  // Faturamento do mês
  const { data: monthOrders } = await supabase
    .from('orders')
    .select('total')
    .gte('created_at', `${startOfMonth}T00:00:00`)

  // Alertas ativos
  const { data: alerts, count: alertCount } = await supabase
    .from('system_alerts')
    .select('*', { count: 'exact' })
    .eq('is_dismissed', false)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(5)

  // Meta do dia
  const { data: goals } = await supabase
    .from('sales_goals')
    .select('*')
    .eq('period_type', 'daily')
    .lte('start_date', today)
    .gte('end_date', today)
    .limit(1)

  const revenueToday = todayOrders?.reduce((s, o) => s + o.total, 0) || 0
  const revenueMonth = monthOrders?.reduce((s, o) => s + o.total, 0) || 0
  const ordersToday = todayOrders?.length || 0
  const avgTicket = ordersToday > 0 ? revenueToday / ordersToday : 0
  const ifoordOrders = todayOrders?.filter((o) => o.channel === 'ifood').length || 0
  const ownDelivery = todayOrders?.filter((o) => o.channel === 'delivery_own').length || 0

  const goal = goals?.[0]?.target_amount || 5000
  const goalProgress = Math.min((revenueToday / goal) * 100, 100)

  return {
    revenueToday,
    revenueMonth,
    ordersToday,
    avgTicket,
    ifoordOrders,
    ownDelivery,
    goal,
    goalProgress,
    alerts: alerts || [],
    alertCount: alertCount || 0,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const kpis = [
    {
      id: 'revenue-today',
      label: 'Faturamento Hoje',
      value: formatCurrency(data.revenueToday),
      icon: '💰',
      color: '#C9A84C',
      href: '/admin/revenue',
    },
    {
      id: 'orders-today',
      label: 'Pedidos Hoje',
      value: data.ordersToday.toString(),
      icon: '🛒',
      color: '#3B82F6',
      href: '/admin/orders',
    },
    {
      id: 'avg-ticket',
      label: 'Ticket Médio',
      value: formatCurrency(data.avgTicket),
      icon: '🎫',
      color: '#22C55E',
      href: '/admin/revenue',
    },
    {
      id: 'revenue-month',
      label: 'Faturamento Mês',
      value: formatCurrency(data.revenueMonth),
      icon: '📅',
      color: '#8B5CF6',
      href: '/admin/revenue',
    },
    {
      id: 'ifood-orders',
      label: 'Pedidos iFood',
      value: data.ifoordOrders.toString(),
      icon: '🔴',
      color: '#EA1D2C',
      href: '/admin/orders',
    },
    {
      id: 'own-delivery',
      label: 'Delivery Próprio',
      value: data.ownDelivery.toString(),
      icon: '🛵',
      color: '#25D366',
      href: '/admin/orders',
    },
  ]

  const alertColors: Record<string, string> = {
    critical: '#EF4444',
    warning: '#F59E0B',
    positive: '#22C55E',
    info: '#3B82F6',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#FAF6EF', fontFamily: 'var(--font-playfair)' }}
          >
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#888888' }}>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, #9E7A2E, #C9A84C)',
            color: '#2C1A0E',
            textDecoration: 'none',
          }}
        >
          + Novo Pedido
        </Link>
      </div>

      {/* 🎯 META DO DIA — sempre primeiro */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(26,26,26,1))',
          border: '1px solid rgba(201,168,76,0.3)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium" style={{ color: '#C9A84C' }}>🎯 Meta do Dia</p>
            <p className="text-3xl font-bold mt-1" style={{ color: '#FAF6EF', fontFamily: 'var(--font-playfair)' }}>
              {formatCurrency(data.revenueToday)}
            </p>
            <p className="text-sm" style={{ color: '#888888' }}>
              de {formatCurrency(data.goal)} • {data.goalProgress.toFixed(0)}% concluída
            </p>
          </div>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              background:
                data.goalProgress >= 100
                  ? 'rgba(34,197,94,0.2)'
                  : data.goalProgress >= 75
                  ? 'rgba(201,168,76,0.2)'
                  : 'rgba(239,68,68,0.1)',
              border:
                data.goalProgress >= 100
                  ? '2px solid #22C55E'
                  : data.goalProgress >= 75
                  ? '2px solid #C9A84C'
                  : '2px solid rgba(239,68,68,0.3)',
              color:
                data.goalProgress >= 100
                  ? '#22C55E'
                  : data.goalProgress >= 75
                  ? '#C9A84C'
                  : '#888888',
            }}
          >
            {data.goalProgress >= 100 ? '🏆' : `${data.goalProgress.toFixed(0)}%`}
          </div>
        </div>
        {/* Barra de progresso */}
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${data.goalProgress}%`,
              background: 'linear-gradient(90deg, #9E7A2E, #C9A84C, #E2C06E)',
            }}
          />
        </div>
      </div>

      {/* 🚨 ALERTAS */}
      {data.alerts.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: '#E8E8E8' }}>
              🚨 Alertas Ativos
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444' }}
              >
                {data.alertCount}
              </span>
            </h2>
            <Link
              href="/admin/alerts"
              className="text-xs"
              style={{ color: '#C9A84C', textDecoration: 'none' }}
            >
              Ver todos →
            </Link>
          </div>
          <div className="space-y-2">
            {data.alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: `rgba(${
                    alert.severity === 'critical'
                      ? '239,68,68'
                      : alert.severity === 'warning'
                      ? '245,158,11'
                      : alert.severity === 'positive'
                      ? '34,197,94'
                      : '59,130,246'
                  }, 0.08)`,
                  border: `1px solid rgba(${
                    alert.severity === 'critical'
                      ? '239,68,68'
                      : alert.severity === 'warning'
                      ? '245,158,11'
                      : alert.severity === 'positive'
                      ? '34,197,94'
                      : '59,130,246'
                  }, 0.3)`,
                }}
              >
                <span style={{ color: alertColors[alert.severity], fontSize: '16px' }}>
                  {alert.severity === 'critical'
                    ? '🔴'
                    : alert.severity === 'warning'
                    ? '🟡'
                    : alert.severity === 'positive'
                    ? '🟢'
                    : 'ℹ️'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#E8E8E8' }}>
                    {alert.title}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#888888' }}>
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.id}
            href={kpi.href}
            id={`kpi-${kpi.id}`}
            className="block rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(201,168,76,0.08)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#555555' }}>
                {kpi.label}
              </p>
              <span className="text-xl">{kpi.icon}</span>
            </div>
            <p
              className="text-2xl font-bold"
              style={{ color: kpi.color, fontFamily: 'var(--font-playfair)' }}
            >
              {kpi.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
      >
        <h2 className="font-semibold mb-4" style={{ color: '#E8E8E8' }}>
          ⚡ Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/stock', icon: '📷', label: 'Entrada de estoque', color: '#3B82F6' },
            { href: '/admin/production', icon: '🍞', label: 'Produção do turno', color: '#F59E0B' },
            { href: '/admin/waste', icon: '🗑️', label: 'Registrar desperdício', color: '#EF4444' },
            { href: '/admin/foot-traffic', icon: '🧑', label: 'Contar clientes', color: '#22C55E' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid #2A2A2A',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background = `rgba(${action.color === '#3B82F6' ? '59,130,246' : action.color === '#F59E0B' ? '245,158,11' : action.color === '#EF4444' ? '239,68,68' : '34,197,94'}, 0.08)`
                el.style.borderColor = action.color + '44'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.background = 'rgba(255,255,255,0.03)'
                el.style.borderColor = '#2A2A2A'
              }}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-medium" style={{ color: '#888888' }}>
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
