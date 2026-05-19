// =============================================
// PADARIA NOVA PAOKENT — Tipos TypeScript
// Baseados no schema do Supabase
// =============================================

export type SaleChannel = 'counter' | 'dining_room' | 'delivery_own' | 'ifood'
export type ShiftType = 'shift_1' | 'shift_2'
export type StockMovementType = 'entry' | 'exit' | 'adjustment' | 'waste'
export type WasteReason = 'expired' | 'leftover' | 'damaged' | 'other'
export type AlertSeverity = 'critical' | 'warning' | 'positive' | 'info'
export type UserRole = 'owner' | 'manager' | 'cashier'
export type StockStatus = 'zero' | 'critical' | 'low' | 'normal'
export type ExpiryStatus = 'expired' | 'expiring_soon' | 'expiring' | 'ok'

// Auth & Usuários
export interface Profile {
  id: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Cardápio
export interface MenuCategory {
  id: string
  name: string
  icon: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface MenuItem {
  id: string
  category_id: string | null
  name: string
  description: string | null
  image_url: string | null
  price_small: number | null
  price_large: number | null
  cost_estimate: number
  tags: string[]
  is_active: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // Joins
  category?: MenuCategory
  specialty?: SpecialtySandwich
}

export interface SpecialtySandwich {
  id: string
  menu_item_id: string
  street_name: string
  ingredients: string
  story: string | null
  display_order: number
}

// Clientes
export interface Customer {
  id: string
  full_name: string | null
  phone: string | null
  email: string | null
  birth_date: string | null
  address: string | null
  notes: string | null
  total_orders: number
  total_spent: number
  last_order_at: string | null
  created_at: string
  updated_at: string
}

// Vendas & Pedidos
export interface Order {
  id: string
  channel: SaleChannel
  shift: ShiftType
  cashier_id: string | null
  customer_id: string | null
  subtotal: number
  discount: number
  delivery_fee: number
  total: number
  payment_method: string | null
  ifood_order_id: string | null
  notes: string | null
  created_at: string
  // Joins
  items?: OrderItem[]
  cashier?: Profile
  customer?: Customer
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string | null
  item_name: string
  quantity: number
  unit_price: number
  size: 'small' | 'large' | null
  notes: string | null
}

export interface SalesGoal {
  id: string
  period_type: 'daily' | 'weekly' | 'monthly'
  channel: SaleChannel | null
  shift: ShiftType | null
  target_amount: number
  start_date: string
  end_date: string
  created_by: string | null
  created_at: string
}

// Estoque
export interface StockCategory {
  id: string
  name: string
  icon: string | null
  sort_order: number
}

export interface Supplier {
  id: string
  name: string
  contact_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  reliability_score: number
  notes: string | null
  is_active: boolean
  created_at: string
}

export interface StockItem {
  id: string
  category_id: string | null
  name: string
  unit: string
  current_quantity: number
  min_quantity: number
  ideal_quantity: number
  last_supplier_id: string | null
  last_purchase_price: number | null
  expiry_date: string | null
  image_url: string | null
  barcode: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  // Joins / Views
  category?: StockCategory
  supplier?: Supplier
  stock_status?: StockStatus
  expiry_status?: ExpiryStatus
}

export interface StockMovement {
  id: string
  stock_item_id: string
  type: StockMovementType
  quantity: number
  unit_cost: number | null
  supplier_id: string | null
  invoice_image_url: string | null
  invoice_data: Record<string, unknown> | null
  expiry_date: string | null
  notes: string | null
  registered_by: string | null
  created_at: string
}

// Produção & Desperdício
export interface ProductionLog {
  id: string
  menu_item_id: string | null
  item_name: string
  shift: ShiftType
  production_date: string
  quantity_produced: number
  quantity_sold: number
  leftover_cost: number
  registered_by: string | null
  created_at: string
}

export interface WasteLog {
  id: string
  stock_item_id: string | null
  menu_item_id: string | null
  item_name: string
  waste_reason: WasteReason
  quantity: number
  estimated_cost: number
  shift: ShiftType | null
  waste_date: string
  notes: string | null
  registered_by: string | null
  created_at: string
}

// Gastos
export interface FixedExpense {
  id: string
  name: string
  category: string
  amount: number
  due_day: number | null
  is_paid: boolean
  paid_at: string | null
  reference_month: string
  receipt_image_url: string | null
  notes: string | null
  created_at: string
}

export interface VariableExpense {
  id: string
  category: string
  description: string
  amount: number
  receipt_image_url: string | null
  requires_approval: boolean
  approved_by: string | null
  approved_at: string | null
  expense_date: string
  registered_by: string | null
  created_at: string
}

// Fluxo Presencial
export interface FootTraffic {
  id: string
  count_date: string
  shift: ShiftType
  hour_slot: number
  customer_count: number
  registered_by: string | null
  created_at: string
}

// Alertas
export interface SystemAlert {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  type: string | null
  is_read: boolean
  is_dismissed: boolean
  metadata: Record<string, unknown>
  reference_id: string | null
  created_at: string
  expires_at: string | null
}

// Avaliações
export interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  source: 'google' | 'ifood' | 'whatsapp' | 'manual'
  is_featured: boolean
  review_date: string
  created_at: string
}

// Equipamentos
export interface Equipment {
  id: string
  name: string
  model: string | null
  serial_number: string | null
  purchase_date: string | null
  last_maintenance: string | null
  next_maintenance: string | null
  maintenance_interval_days: number
  maintenance_cost: number | null
  notes: string | null
  is_active: boolean
  created_at: string
}

// Redes Sociais
export interface SocialMediaReport {
  id: string
  platform: 'instagram' | 'facebook' | 'google' | 'tiktok'
  report_type: 'organic' | 'paid'
  report_date: string
  posts_count: number
  reach: number
  impressions: number
  engagement_rate: number
  followers_count: number
  followers_gained: number
  ad_spend: number
  clicks: number
  cpc: number
  conversions: number
  roi: number
  raw_data: Record<string, unknown>
  created_at: string
}

// Dashboard KPIs
export interface DashboardKPIs {
  revenueToday: number
  revenueWeek: number
  revenueMonth: number
  ordersToday: number
  avgTicketToday: number
  ifoordOrdersToday: number
  ownDeliveryToday: number
  counterOrdersToday: number
  goalToday: number
  goalProgress: number // 0-100
}

// DRE
export interface DREData {
  month: string
  grossRevenue: number
  cmvCost: number
  ifoordFees: number
  fixedExpenses: number
  variableExpenses: number
  taxEstimate: number
  wasteCost: number
  netProfit: number
  netMargin: number
}

// IA Gerencial
export interface AIQuery {
  question: string
  context?: Record<string, unknown>
}

export interface AIResponse {
  answer: string
  data?: Record<string, unknown>
  suggestions?: string[]
}

// App Settings
export interface AppSettings {
  business_info: {
    name: string
    phone: string
    instagram: string
    address: string
    google_maps_url: string
    ifood_url: string
    founded_year: number
  }
  daily_goal: { amount: number }
  shifts: {
    shift_1: { name: string; start: string; end: string }
    shift_2: { name: string; start: string; end: string }
  }
  expense_approval_threshold: { amount: number }
  waste_alert_threshold: { percent: number }
  cmv_alert_threshold: { percent: number }
  whatsapp_report_time: { hour: number; minute: number }
}
