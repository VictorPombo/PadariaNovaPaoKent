import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/admin/DashboardClient'
import { mockDashboard } from '@/lib/mockData'

export const metadata = {
  title: 'Dashboard',
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

async function getDashboardData() {
  if (USE_MOCK) return mockDashboard

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

  return <DashboardClient data={data} />
}
