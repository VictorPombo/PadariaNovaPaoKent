-- =============================================
-- PADARIA NOVA PAOKENT — Schema Inicial Completo
-- Migration: 001_initial_schema.sql
-- =============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- busca por texto

-- =============================================
-- TIPOS ENUM
-- =============================================

CREATE TYPE sale_channel AS ENUM ('counter', 'dining_room', 'delivery_own', 'ifood');
CREATE TYPE shift_type AS ENUM ('shift_1', 'shift_2');
CREATE TYPE stock_movement_type AS ENUM ('entry', 'exit', 'adjustment', 'waste');
CREATE TYPE waste_reason AS ENUM ('expired', 'leftover', 'damaged', 'other');
CREATE TYPE alert_severity AS ENUM ('critical', 'warning', 'positive', 'info');
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'cashier');

-- =============================================
-- AUTH & USUÁRIOS
-- =============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'cashier',
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  device_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, (subscription->>'endpoint'))
);

-- =============================================
-- CARDÁPIO
-- =============================================

CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price_small NUMERIC(10,2),
  price_large NUMERIC(10,2),
  cost_estimate NUMERIC(10,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE specialty_sandwiches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  street_name TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  story TEXT,
  display_order INT DEFAULT 0
);

-- =============================================
-- CLIENTES (precisa vir antes de orders)
-- =============================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  birth_date DATE,
  address TEXT,
  notes TEXT,
  total_orders INT DEFAULT 0,
  total_spent NUMERIC(10,2) DEFAULT 0,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percent', 'fixed')) NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_amount NUMERIC(10,2) DEFAULT 0,
  max_uses INT,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- VENDAS & PEDIDOS
-- =============================================

CREATE TABLE sales_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_type TEXT CHECK (period_type IN ('daily', 'weekly', 'monthly')) NOT NULL,
  channel sale_channel,
  shift shift_type,
  target_amount NUMERIC(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel sale_channel NOT NULL DEFAULT 'counter',
  shift shift_type NOT NULL,
  cashier_id UUID REFERENCES auth.users(id),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'credit', 'debit', 'pix', 'other')),
  ifood_order_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL, -- snapshot do nome na hora do pedido
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  size TEXT CHECK (size IN ('small', 'large')),
  notes TEXT
);

-- =============================================
-- ESTOQUE & FORNECEDORES
-- =============================================

CREATE TABLE stock_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  reliability_score INT CHECK (reliability_score BETWEEN 1 AND 5) DEFAULT 3,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stock_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES stock_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'un',
  current_quantity NUMERIC(10,3) DEFAULT 0,
  min_quantity NUMERIC(10,3) DEFAULT 0,
  ideal_quantity NUMERIC(10,3) DEFAULT 0,
  last_supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  last_purchase_price NUMERIC(10,2),
  expiry_date DATE,
  image_url TEXT,
  barcode TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_item_id UUID REFERENCES stock_items(id) ON DELETE CASCADE,
  type stock_movement_type NOT NULL,
  quantity NUMERIC(10,3) NOT NULL,
  unit_cost NUMERIC(10,2),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  invoice_image_url TEXT,
  invoice_data JSONB,
  expiry_date DATE,
  notes TEXT,
  registered_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inventory_counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  counted_by UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('open', 'completed', 'reviewed')) DEFAULT 'open',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE inventory_count_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  count_id UUID REFERENCES inventory_counts(id) ON DELETE CASCADE,
  stock_item_id UUID REFERENCES stock_items(id) ON DELETE CASCADE,
  expected_quantity NUMERIC(10,3),
  counted_quantity NUMERIC(10,3),
  notes TEXT
);

-- =============================================
-- PRODUÇÃO & DESPERDÍCIO
-- =============================================

CREATE TABLE production_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  shift shift_type NOT NULL,
  production_date DATE NOT NULL DEFAULT CURRENT_DATE,
  quantity_produced INT NOT NULL DEFAULT 0 CHECK (quantity_produced >= 0),
  quantity_sold INT NOT NULL DEFAULT 0 CHECK (quantity_sold >= 0),
  leftover_cost NUMERIC(10,2) DEFAULT 0,
  registered_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE waste_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_item_id UUID REFERENCES stock_items(id) ON DELETE SET NULL,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  waste_reason waste_reason NOT NULL,
  quantity NUMERIC(10,3) NOT NULL CHECK (quantity > 0),
  estimated_cost NUMERIC(10,2) DEFAULT 0,
  shift shift_type,
  waste_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  registered_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- GASTOS
-- =============================================

CREATE TABLE fixed_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  due_day INT CHECK (due_day BETWEEN 1 AND 31),
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at DATE,
  reference_month DATE NOT NULL,
  receipt_image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE variable_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  receipt_image_url TEXT,
  requires_approval BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  registered_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FLUXO PRESENCIAL
-- =============================================

CREATE TABLE foot_traffic (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  count_date DATE NOT NULL DEFAULT CURRENT_DATE,
  shift shift_type NOT NULL,
  hour_slot INT CHECK (hour_slot BETWEEN 6 AND 22),
  customer_count INT NOT NULL DEFAULT 0 CHECK (customer_count >= 0),
  registered_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(count_date, shift, hour_slot)
);

-- =============================================
-- AVALIAÇÕES
-- =============================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  comment TEXT,
  source TEXT DEFAULT 'google' CHECK (source IN ('google', 'ifood', 'whatsapp', 'manual')),
  is_featured BOOLEAN DEFAULT FALSE,
  review_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EQUIPAMENTOS
-- =============================================

CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  maintenance_interval_days INT DEFAULT 90,
  maintenance_cost NUMERIC(10,2),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ALERTAS DO SISTEMA
-- =============================================

CREATE TABLE system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity alert_severity NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('stock', 'sales', 'goal', 'delivery', 'expense', 'waste', 'equipment', 'general')),
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- =============================================
-- REDES SOCIAIS
-- =============================================

CREATE TABLE social_media_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'google', 'tiktok')),
  report_type TEXT NOT NULL CHECK (report_type IN ('organic', 'paid')),
  report_date DATE NOT NULL,
  posts_count INT DEFAULT 0,
  reach INT DEFAULT 0,
  impressions INT DEFAULT 0,
  engagement_rate NUMERIC(5,2) DEFAULT 0,
  followers_count INT DEFAULT 0,
  followers_gained INT DEFAULT 0,
  ad_spend NUMERIC(10,2) DEFAULT 0,
  clicks INT DEFAULT 0,
  cpc NUMERIC(10,4) DEFAULT 0,
  conversions INT DEFAULT 0,
  roi NUMERIC(10,2) DEFAULT 0,
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, report_type, report_date)
);

-- =============================================
-- ÍNDICES DE PERFORMANCE
-- =============================================

-- Vendas
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_channel ON orders(channel);
CREATE INDEX idx_orders_shift ON orders(shift);
CREATE INDEX idx_orders_cashier ON orders(cashier_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu ON order_items(menu_item_id);

-- Estoque
CREATE INDEX idx_stock_items_category ON stock_items(category_id);
CREATE INDEX idx_stock_items_active ON stock_items(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_stock_items_expiry ON stock_items(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_stock_movements_item ON stock_movements(stock_item_id);
CREATE INDEX idx_stock_movements_created ON stock_movements(created_at DESC);
CREATE INDEX idx_stock_movements_type ON stock_movements(type);

-- Alertas
CREATE INDEX idx_alerts_severity ON system_alerts(severity);
CREATE INDEX idx_alerts_unread ON system_alerts(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_alerts_created ON system_alerts(created_at DESC);

-- Fluxo presencial
CREATE INDEX idx_foot_traffic_date ON foot_traffic(count_date DESC);
CREATE INDEX idx_foot_traffic_shift ON foot_traffic(shift);

-- Produção e desperdício
CREATE INDEX idx_production_date ON production_logs(production_date DESC);
CREATE INDEX idx_production_shift ON production_logs(shift);
CREATE INDEX idx_waste_date ON waste_logs(waste_date DESC);
CREATE INDEX idx_waste_reason ON waste_logs(waste_reason);

-- Cardápio
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_active ON menu_items(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_menu_items_name_trgm ON menu_items USING gin(name gin_trgm_ops);

-- Gastos
CREATE INDEX idx_fixed_expenses_month ON fixed_expenses(reference_month);
CREATE INDEX idx_fixed_expenses_paid ON fixed_expenses(is_paid);
CREATE INDEX idx_variable_expenses_date ON variable_expenses(expense_date DESC);

-- CRM
CREATE INDEX idx_customers_phone ON customers(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_customers_email ON customers(email) WHERE email IS NOT NULL;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialty_sandwiches ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_count_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE variable_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE foot_traffic ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_reports ENABLE ROW LEVEL SECURITY;

-- Políticas: tabelas públicas (cardápio e avaliações visíveis para todos)
CREATE POLICY "menu_categories_public_read" ON menu_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "menu_items_public_read" ON menu_items FOR SELECT USING (is_active = TRUE);
CREATE POLICY "specialty_sandwiches_public_read" ON specialty_sandwiches FOR SELECT USING (TRUE);
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (TRUE);

-- Políticas: dados admin (apenas usuários autenticados)
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "push_subscriptions_own" ON push_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Tabelas admin: leitura/escrita para autenticados
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'customers', 'coupons', 'sales_goals', 'orders', 'order_items',
    'stock_categories', 'suppliers', 'stock_items', 'stock_movements',
    'inventory_counts', 'inventory_count_items', 'production_logs',
    'waste_logs', 'fixed_expenses', 'variable_expenses', 'foot_traffic',
    'equipment', 'system_alerts', 'social_media_reports'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (auth.role() = ''authenticated'')', 
      'admin_authenticated_' || t, t);
  END LOOP;
END $$;

-- Menu categories e items: admins podem escrever
CREATE POLICY "menu_categories_admin_write" ON menu_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "menu_items_admin_write" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "specialty_sandwiches_admin_write" ON specialty_sandwiches FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- FUNÇÕES & TRIGGERS
-- =============================================

-- Trigger: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_menu_items
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_stock_items
  BEFORE UPDATE ON stock_items
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_customers
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Trigger: atualizar estoque ao registrar movimentação
CREATE OR REPLACE FUNCTION update_stock_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'entry' THEN
    UPDATE stock_items SET current_quantity = current_quantity + NEW.quantity WHERE id = NEW.stock_item_id;
  ELSIF NEW.type IN ('exit', 'waste') THEN
    UPDATE stock_items SET current_quantity = GREATEST(current_quantity - NEW.quantity, 0) WHERE id = NEW.stock_item_id;
  ELSIF NEW.type = 'adjustment' THEN
    UPDATE stock_items SET current_quantity = NEW.quantity WHERE id = NEW.stock_item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_stock_movement
  AFTER INSERT ON stock_movements
  FOR EACH ROW EXECUTE FUNCTION update_stock_quantity();

-- Trigger: criar alerta quando estoque fica crítico
CREATE OR REPLACE FUNCTION check_stock_alert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_quantity <= 0 THEN
    INSERT INTO system_alerts (severity, title, message, type, reference_id, metadata)
    VALUES (
      'critical',
      'Estoque zerado: ' || NEW.name,
      NEW.name || ' está sem estoque. Faça a reposição imediatamente.',
      'stock',
      NEW.id,
      jsonb_build_object('stock_item_id', NEW.id, 'item_name', NEW.name)
    )
    ON CONFLICT DO NOTHING;
  ELSIF NEW.current_quantity <= NEW.min_quantity AND NEW.min_quantity > 0 THEN
    INSERT INTO system_alerts (severity, title, message, type, reference_id, metadata)
    VALUES (
      'warning',
      'Estoque baixo: ' || NEW.name,
      NEW.name || ' está abaixo do mínimo (' || NEW.current_quantity || ' ' || NEW.unit || ' restantes).',
      'stock',
      NEW.id,
      jsonb_build_object('stock_item_id', NEW.id, 'item_name', NEW.name, 'quantity', NEW.current_quantity)
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_stock_update_alert
  AFTER UPDATE OF current_quantity ON stock_items
  FOR EACH ROW EXECUTE FUNCTION check_stock_alert();

-- Trigger: atualizar total_orders e total_spent do cliente
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE customers
    SET 
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total,
      last_order_at = NEW.created_at
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_order_customer_stats
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

-- Trigger: criar perfil automaticamente ao registrar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'cashier')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- Vista: faturamento por dia/canal (para dashboard)
CREATE VIEW v_daily_revenue AS
SELECT
  DATE(created_at) as date,
  channel,
  shift,
  COUNT(*) as order_count,
  SUM(total) as total_revenue,
  AVG(total) as avg_ticket
FROM orders
GROUP BY DATE(created_at), channel, shift;

-- Vista: produtos mais vendidos
CREATE VIEW v_top_products AS
SELECT
  mi.id,
  mi.name,
  mi.category_id,
  COUNT(oi.id) as times_ordered,
  SUM(oi.quantity) as total_quantity,
  SUM(oi.quantity * oi.unit_price) as total_revenue,
  AVG(oi.unit_price) as avg_price
FROM order_items oi
JOIN menu_items mi ON oi.menu_item_id = mi.id
GROUP BY mi.id, mi.name, mi.category_id;

-- Vista: DRE mensal simplificado
CREATE VIEW v_monthly_dre AS
SELECT
  DATE_TRUNC('month', o.created_at) as month,
  SUM(o.total) as gross_revenue,
  COALESCE(expenses.fixed_total, 0) as fixed_expenses,
  COALESCE(waste_cost.total, 0) as waste_cost
FROM orders o
LEFT JOIN (
  SELECT DATE_TRUNC('month', reference_month::TIMESTAMPTZ) as month, SUM(amount) as fixed_total
  FROM fixed_expenses GROUP BY DATE_TRUNC('month', reference_month::TIMESTAMPTZ)
) expenses ON DATE_TRUNC('month', o.created_at) = expenses.month
LEFT JOIN (
  SELECT DATE_TRUNC('month', waste_date::TIMESTAMPTZ) as month, SUM(estimated_cost) as total
  FROM waste_logs GROUP BY DATE_TRUNC('month', waste_date::TIMESTAMPTZ)
) waste_cost ON DATE_TRUNC('month', o.created_at) = waste_cost.month
GROUP BY DATE_TRUNC('month', o.created_at), expenses.fixed_total, waste_cost.total;

-- Vista: alertas ativos (não lidos e não expirados)
CREATE VIEW v_active_alerts AS
SELECT * FROM system_alerts
WHERE is_dismissed = FALSE
  AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY 
  CASE severity WHEN 'critical' THEN 1 WHEN 'warning' THEN 2 WHEN 'positive' THEN 3 ELSE 4 END,
  created_at DESC;

-- Vista: status do estoque com semáforo
CREATE VIEW v_stock_status AS
SELECT
  si.*,
  sc.name as category_name,
  sc.icon as category_icon,
  s.name as supplier_name,
  CASE
    WHEN si.current_quantity <= 0 THEN 'zero'
    WHEN si.current_quantity <= si.min_quantity THEN 'critical'
    WHEN si.current_quantity <= si.min_quantity * 1.5 THEN 'low'
    ELSE 'normal'
  END as stock_status,
  CASE
    WHEN si.expiry_date IS NOT NULL AND si.expiry_date <= CURRENT_DATE THEN 'expired'
    WHEN si.expiry_date IS NOT NULL AND si.expiry_date <= CURRENT_DATE + 3 THEN 'expiring_soon'
    WHEN si.expiry_date IS NOT NULL AND si.expiry_date <= CURRENT_DATE + 7 THEN 'expiring'
    ELSE 'ok'
  END as expiry_status
FROM stock_items si
LEFT JOIN stock_categories sc ON si.category_id = sc.id
LEFT JOIN suppliers s ON si.last_supplier_id = s.id
WHERE si.is_active = TRUE;
