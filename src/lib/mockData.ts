// ================================================
// MOCK DATA FOR DEMO/PRESENTATION
// Use NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local
// ================================================

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

const today = new Date().toISOString().split('T')[0]
const now = new Date().toISOString()

// ── Dashboard ──
export const mockDashboard = {
  revenueToday: 4823.50,
  revenueMonth: 127450.80,
  ordersToday: 68,
  avgTicket: 70.93,
  ifoordOrders: 12,
  ownDelivery: 8,
  goal: 5000,
  goalProgress: 96.47,
  alerts: [
    { id: '1', severity: 'critical', title: 'Estoque de Farinha Abaixo do Mínimo', message: 'Restam apenas 3 kg de farinha de trigo. Ponto de reposição: 15 kg.', is_read: false, is_dismissed: false, created_at: now },
    { id: '2', severity: 'warning', title: 'CMV do Dia Acima de 35%', message: 'CMV atual: 37.2%. Verificar preços de fornecedores.', is_read: false, is_dismissed: false, created_at: now },
    { id: '3', severity: 'positive', title: 'Meta Diária Quase Atingida', message: 'Faturamento de R$ 4.823,50 (96.47% da meta de R$ 5.000).', is_read: false, is_dismissed: false, created_at: now },
  ],
  alertCount: 3,
}

// ── Orders ──
export const mockOrders = [
  { id: '1', order_number: '#1247', customer_name: 'João Silva', channel: 'counter', status: 'completed', total: 47.80, items_count: 3, created_at: `${today}T08:15:00`, payment_method: 'pix' },
  { id: '2', order_number: '#1248', customer_name: 'Maria Santos', channel: 'ifood', status: 'completed', total: 89.50, items_count: 5, created_at: `${today}T08:32:00`, payment_method: 'credit_card' },
  { id: '3', order_number: '#1249', customer_name: 'Pedro Oliveira', channel: 'delivery_own', status: 'preparing', total: 125.90, items_count: 8, created_at: `${today}T09:05:00`, payment_method: 'pix' },
  { id: '4', order_number: '#1250', customer_name: 'Ana Costa', channel: 'dining_room', status: 'completed', total: 62.40, items_count: 4, created_at: `${today}T09:18:00`, payment_method: 'debit_card' },
  { id: '5', order_number: '#1251', customer_name: 'Roberto Lima', channel: 'counter', status: 'completed', total: 35.00, items_count: 2, created_at: `${today}T09:45:00`, payment_method: 'cash' },
  { id: '6', order_number: '#1252', customer_name: 'Fernanda Roque', channel: 'ifood', status: 'delivering', total: 78.30, items_count: 6, created_at: `${today}T10:12:00`, payment_method: 'credit_card' },
  { id: '7', order_number: '#1253', customer_name: 'Carlos Mendes', channel: 'counter', status: 'completed', total: 156.00, items_count: 10, created_at: `${today}T10:28:00`, payment_method: 'pix' },
  { id: '8', order_number: '#1254', customer_name: 'Luciana Alves', channel: 'delivery_own', status: 'completed', total: 44.50, items_count: 3, created_at: `${today}T10:55:00`, payment_method: 'cash' },
  { id: '9', order_number: '#1255', customer_name: 'Beatriz Moura', channel: 'dining_room', status: 'completed', total: 93.20, items_count: 5, created_at: `${today}T11:15:00`, payment_method: 'credit_card' },
  { id: '10', order_number: '#1256', customer_name: 'Marcelo Souza', channel: 'ifood', status: 'preparing', total: 67.90, items_count: 4, created_at: `${today}T11:40:00`, payment_method: 'credit_card' },
]

// ── Stock ──
export const mockStock = [
  { id: '1', name: 'Farinha de Trigo', category: 'insumos', quantity: 3, unit: 'kg', min_stock: 15, status: 'critical', cost_per_unit: 4.50, supplier: 'Moinho Paulista', badge: 'CRÍTICO' },
  { id: '2', name: 'Açúcar Refinado', category: 'insumos', quantity: 12, unit: 'kg', min_stock: 10, status: 'normal', cost_per_unit: 5.20, supplier: 'União', badge: 'OK' },
  { id: '3', name: 'Manteiga sem Sal', category: 'insumos', quantity: 4, unit: 'kg', min_stock: 8, status: 'low', cost_per_unit: 32.00, supplier: 'Aviação', badge: 'BAIXO' },
  { id: '4', name: 'Leite Integral', category: 'insumos', quantity: 25, unit: 'L', min_stock: 20, status: 'normal', cost_per_unit: 6.80, supplier: 'Piracanjuba', badge: 'OK' },
  { id: '5', name: 'Fermento Biológico', category: 'insumos', quantity: 2, unit: 'kg', min_stock: 5, status: 'critical', cost_per_unit: 18.50, supplier: 'Fleischmann', badge: 'CRÍTICO' },
  { id: '6', name: 'Presunto Cozido', category: 'frios', quantity: 8, unit: 'kg', min_stock: 5, status: 'normal', cost_per_unit: 28.90, supplier: 'Sadia', badge: 'OK' },
  { id: '7', name: 'Queijo Mussarela', category: 'frios', quantity: 6, unit: 'kg', min_stock: 8, status: 'low', cost_per_unit: 42.00, supplier: 'Tirolez', badge: 'BAIXO' },
  { id: '8', name: 'Mortadela Ceratti', category: 'frios', quantity: 10, unit: 'kg', min_stock: 5, status: 'normal', cost_per_unit: 22.50, supplier: 'Ceratti', badge: 'OK' },
  { id: '9', name: 'Café em Grão', category: 'bebidas', quantity: 15, unit: 'kg', min_stock: 10, status: 'normal', cost_per_unit: 48.00, supplier: 'Orfeu', badge: 'OK' },
  { id: '10', name: 'Chocolate em Pó', category: 'bebidas', quantity: 3, unit: 'kg', min_stock: 5, status: 'low', cost_per_unit: 24.90, supplier: 'Nestlé', badge: 'BAIXO' },
]

export const mockStockCategories = [
  { id: 'insumos', name: 'Insumos' },
  { id: 'frios', name: 'Frios' },
  { id: 'bebidas', name: 'Bebidas' },
]

// ── Revenue ──
export const mockRevenue = {
  kpis: [
    { label: 'Faturamento Hoje', value: 4823.50, change: '+12.3%', trend: 'up' },
    { label: 'Ticket Médio', value: 70.93, change: '+5.8%', trend: 'up' },
    { label: 'Pedidos Hoje', value: 68, change: '+8', trend: 'up' },
    { label: 'Faturamento Mês', value: 127450.80, change: '+15.2%', trend: 'up' },
  ],
  dailyRevenue: [
    { date: 'Seg', value: 4200 },
    { date: 'Ter', value: 4850 },
    { date: 'Qua', value: 3980 },
    { date: 'Qui', value: 5120 },
    { date: 'Sex', value: 5890 },
    { date: 'Sáb', value: 6340 },
    { date: 'Dom', value: 4070 },
  ],
  channelBreakdown: [
    { channel: 'Balcão', percent: 45, revenue: 2170.58 },
    { channel: 'Salão', percent: 22, revenue: 1061.17 },
    { channel: 'iFood', percent: 20, revenue: 964.70 },
    { channel: 'Delivery Próprio', percent: 13, revenue: 627.06 },
  ],
}

// ── Production ──
export const mockProduction = [
  { id: '1', product_name: 'Pão Francês', quantity_planned: 500, quantity_produced: 480, quantity_sold: 465, waste: 15, shift: 'shift_1', created_at: `${today}T06:30:00`, status: 'completed' },
  { id: '2', product_name: 'Baguete', quantity_planned: 80, quantity_produced: 78, quantity_sold: 72, waste: 6, shift: 'shift_1', created_at: `${today}T06:45:00`, status: 'completed' },
  { id: '3', product_name: 'Pão de Queijo', quantity_planned: 200, quantity_produced: 195, quantity_sold: 190, waste: 5, shift: 'shift_1', created_at: `${today}T07:00:00`, status: 'completed' },
  { id: '4', product_name: 'Croissant', quantity_planned: 60, quantity_produced: 58, quantity_sold: 55, waste: 3, shift: 'shift_1', created_at: `${today}T07:15:00`, status: 'completed' },
  { id: '5', product_name: 'Bolo de Chocolate', quantity_planned: 8, quantity_produced: 8, quantity_sold: 6, waste: 0, shift: 'shift_1', created_at: `${today}T08:00:00`, status: 'completed' },
  { id: '6', product_name: 'Bisnaga', quantity_planned: 120, quantity_produced: 115, quantity_sold: 108, waste: 7, shift: 'shift_2', created_at: `${today}T14:30:00`, status: 'completed' },
  { id: '7', product_name: 'Pão Integral', quantity_planned: 60, quantity_produced: 58, quantity_sold: 52, waste: 6, shift: 'shift_2', created_at: `${today}T15:00:00`, status: 'in_progress' },
]

// ── Goals ──
export const mockGoals = [
  { id: '1', title: 'Faturamento Diário', period_type: 'daily', target_amount: 5000, current_amount: 4823.50, start_date: today, end_date: today, status: 'active' },
  { id: '2', title: 'Faturamento Mensal', period_type: 'monthly', target_amount: 150000, current_amount: 127450.80, start_date: '2026-05-01', end_date: '2026-05-31', status: 'active' },
  { id: '3', title: 'Reduzir Desperdício', period_type: 'monthly', target_amount: 1.0, current_amount: 0.8, start_date: '2026-05-01', end_date: '2026-05-31', status: 'active' },
  { id: '4', title: 'Pedidos iFood', period_type: 'monthly', target_amount: 300, current_amount: 248, start_date: '2026-05-01', end_date: '2026-05-31', status: 'active' },
]

// ── Reviews ──
export const mockReviews = [
  { id: '1', customer_name: 'Júlio César', rating: 5, comment: 'Muito gostoso. O café é saboroso e o pão não chapa.', source: 'google', created_at: '2026-05-18T10:00:00', reply: null },
  { id: '2', customer_name: 'Vera Santos', rating: 5, comment: 'Sou cliente há mais de 40 anos. Qualidade sempre impecável!', source: 'google', created_at: '2026-05-15T14:00:00', reply: 'Obrigado Vera! É uma honra atendê-la.' },
  { id: '3', customer_name: 'Arthur Rebelo', rating: 5, comment: 'A melhor broa de milho de todas!', source: 'google', created_at: '2026-05-12T09:00:00', reply: null },
  { id: '4', customer_name: 'Marina Costa', rating: 4, comment: 'Ambiente acolhedor, atendimento excelente. Venho toda semana!', source: 'google', created_at: '2026-05-10T16:00:00', reply: null },
  { id: '5', customer_name: 'Roberto Alves', rating: 5, comment: 'O lanche Arthur Ramos é incrível. Vale cada centavo!', source: 'ifood', created_at: '2026-05-08T11:00:00', reply: 'Obrigado Roberto! Nosso lanche mais especial.' },
  { id: '6', customer_name: 'Fernanda Lima', rating: 4, comment: 'Cafeteria premium no coração do bairro. Recomendo!', source: 'google', created_at: '2026-05-05T08:00:00', reply: null },
  { id: '7', customer_name: 'Carlos Eduardo', rating: 5, comment: 'Delivery rápido e comida quentinha. Parabéns!', source: 'ifood', created_at: '2026-05-03T20:00:00', reply: null },
  { id: '8', customer_name: 'Beatriz Moura', rating: 5, comment: 'Os salgadinhos para festa ficaram maravilhosos!', source: 'google', created_at: '2026-04-28T15:00:00', reply: 'Que bom que gostou, Beatriz!' },
]

// ── Customers ──
export const mockCustomers = [
  { id: '1', name: 'João Silva', phone: '11987654321', email: 'joao@email.com', total_orders: 45, total_spent: 3240.50, last_order: '2026-05-20', loyalty_points: 324, tier: 'gold' },
  { id: '2', name: 'Maria Santos', phone: '11976543210', email: 'maria@email.com', total_orders: 78, total_spent: 6890.20, last_order: '2026-05-21', loyalty_points: 689, tier: 'diamond' },
  { id: '3', name: 'Pedro Oliveira', phone: '11965432109', email: 'pedro@email.com', total_orders: 23, total_spent: 1560.80, last_order: '2026-05-19', loyalty_points: 156, tier: 'silver' },
  { id: '4', name: 'Ana Costa', phone: '11954321098', email: 'ana@email.com', total_orders: 56, total_spent: 4120.90, last_order: '2026-05-21', loyalty_points: 412, tier: 'gold' },
  { id: '5', name: 'Roberto Lima', phone: '11943210987', email: 'roberto@email.com', total_orders: 12, total_spent: 890.40, last_order: '2026-05-15', loyalty_points: 89, tier: 'bronze' },
  { id: '6', name: 'Fernanda Roque', phone: '11932109876', email: 'fernanda@email.com', total_orders: 34, total_spent: 2450.60, last_order: '2026-05-20', loyalty_points: 245, tier: 'silver' },
]

// ── Menu / Cardápio Admin ──
export const mockMenuItems = [
  { id: '1', name: 'Café Expresso', category_id: 'mat', price: 8.50, cost: 2.10, is_active: true, is_bestseller: true },
  { id: '2', name: 'Pão c/ Manteiga', category_id: 'pao', price: 7.20, cost: 1.80, is_active: true, is_bestseller: true },
  { id: '3', name: 'Bauru', category_id: 'trad', price: 22.80, cost: 8.50, is_active: true, is_bestseller: true },
  { id: '4', name: 'Arthur Ramos', category_id: 'esp', price: 47.90, cost: 18.20, is_active: true, is_bestseller: true },
  { id: '5', name: 'Mortadela Ceratti', category_id: 'trad', price: 23.50, cost: 9.40, is_active: true, is_bestseller: false },
  { id: '6', name: 'Cappuccino Médio', category_id: 'mat', price: 16.90, cost: 4.50, is_active: true, is_bestseller: false },
  { id: '7', name: 'Salada Caesar', category_id: 'sal', price: 32.90, cost: 12.80, is_active: true, is_bestseller: false },
  { id: '8', name: 'Hambúrguer Artesanal', category_id: 'burg', price: 38.90, cost: 15.60, is_active: true, is_bestseller: true },
  { id: '9', name: 'Pedaço de Bolo', category_id: 'sob', price: 12.50, cost: 4.20, is_active: true, is_bestseller: false },
  { id: '10', name: 'Coxa Creme', category_id: 'salg', price: 14.50, cost: 5.80, is_active: true, is_bestseller: false },
]

export const mockMenuCategories = [
  { id: 'mat', name: 'Matinais' },
  { id: 'pao', name: 'Pães' },
  { id: 'trad', name: 'Lanches' },
  { id: 'esp', name: 'Especiais' },
  { id: 'burg', name: 'Hambúrguer' },
  { id: 'sal', name: 'Saladas' },
  { id: 'salg', name: 'Salgados' },
  { id: 'sob', name: 'Sobremesas' },
]

// ── Waste ──
export const mockWaste = [
  { id: '1', product_name: 'Pão Francês', quantity: 15, unit: 'un', reason: 'Não vendido ao final do turno', cost_estimate: 22.50, shift: 'shift_1', created_at: `${today}T14:00:00` },
  { id: '2', product_name: 'Croissant', quantity: 3, unit: 'un', reason: 'Quebra na manipulação', cost_estimate: 18.00, shift: 'shift_1', created_at: `${today}T10:30:00` },
  { id: '3', product_name: 'Baguete', quantity: 6, unit: 'un', reason: 'Não vendido ao final do turno', cost_estimate: 36.00, shift: 'shift_1', created_at: `${today}T14:00:00` },
  { id: '4', product_name: 'Leite Integral', quantity: 2, unit: 'L', reason: 'Vencido', cost_estimate: 13.60, shift: 'shift_2', created_at: `${today}T16:00:00` },
  { id: '5', product_name: 'Bolo de Cenoura', quantity: 2, unit: 'fatias', reason: 'Sobra do dia', cost_estimate: 8.40, shift: 'shift_2', created_at: `${today}T22:00:00` },
]

// ── Alerts ──
export const mockAlerts = [
  { id: '1', severity: 'critical', title: 'Estoque de Farinha Abaixo do Mínimo', message: 'Restam 3 kg. Ponto de reposição: 15 kg. Fornecedor: Moinho Paulista.', category: 'stock', is_read: false, is_dismissed: false, created_at: now },
  { id: '2', severity: 'critical', title: 'Fermento Biológico em Nível Crítico', message: 'Restam 2 kg. Mínimo: 5 kg. Produção amanhã pode ser comprometida.', category: 'stock', is_read: false, is_dismissed: false, created_at: now },
  { id: '3', severity: 'warning', title: 'CMV do Dia Acima de 35%', message: 'CMV atual: 37.2%. Meta: até 35%. Verificar precificação e fornecedores.', category: 'financial', is_read: false, is_dismissed: false, created_at: now },
  { id: '4', severity: 'warning', title: 'Manteiga Abaixo do Ponto de Reposição', message: '4 kg em estoque. Mínimo: 8 kg. Recomendado repor em até 2 dias.', category: 'stock', is_read: false, is_dismissed: false, created_at: now },
  { id: '5', severity: 'positive', title: 'Meta Diária em 96.47%', message: 'Faturamento de R$ 4.823,50. Faltam R$ 176,50 para atingir a meta de R$ 5.000.', category: 'financial', is_read: false, is_dismissed: false, created_at: now },
  { id: '6', severity: 'info', title: 'Relatório Semanal Disponível', message: 'O relatório consolidado da semana 20 está pronto para download.', category: 'system', is_read: true, is_dismissed: false, created_at: now },
]

// ── DRE ──
export const mockDre = {
  period: 'Maio 2026',
  revenue_gross: 127450.80,
  taxes: 8921.56,
  revenue_net: 118529.24,
  cogs: 44607.79, // CMV 35%
  gross_profit: 73921.45,
  operational_expenses: {
    payroll: 28500.00,
    rent: 12000.00,
    utilities: 3200.00,
    maintenance: 1500.00,
    marketing: 800.00,
    supplies: 2100.00,
    other: 1400.00,
  },
  total_opex: 49500.00,
  ebitda: 24421.45,
  depreciation: 2800.00,
  net_income: 21621.45,
  cmv_percent: 35.0,
  margin_percent: 17.0,
}

// ── Expenses ──
export const mockExpenses = [
  { id: '1', description: 'Compra de Farinha - Moinho Paulista', category: 'insumos', amount: 1350.00, date: '2026-05-20', payment_method: 'bank_transfer', status: 'paid', approved_by: 'Victor' },
  { id: '2', description: 'Conta de Luz - Maio', category: 'utilities', amount: 3200.00, date: '2026-05-18', payment_method: 'auto_debit', status: 'paid', approved_by: 'Victor' },
  { id: '3', description: 'Manutenção Forno Industrial', category: 'maintenance', amount: 850.00, date: '2026-05-15', payment_method: 'pix', status: 'paid', approved_by: 'Victor' },
  { id: '4', description: 'Compra de Frios - Sadia', category: 'insumos', amount: 2890.50, date: '2026-05-14', payment_method: 'bank_transfer', status: 'paid', approved_by: 'Victor' },
  { id: '5', description: 'Folha de Pagamento - Maio', category: 'payroll', amount: 28500.00, date: '2026-05-05', payment_method: 'bank_transfer', status: 'paid', approved_by: 'Victor' },
  { id: '6', description: 'Embalagens Personalizadas', category: 'supplies', amount: 680.00, date: '2026-05-12', payment_method: 'pix', status: 'pending', approved_by: null },
]

export const mockExpenseCategories = [
  { id: 'insumos', name: 'Insumos & Matéria-prima', budget: 15000 },
  { id: 'utilities', name: 'Contas & Serviços', budget: 4000 },
  { id: 'maintenance', name: 'Manutenção', budget: 2000 },
  { id: 'payroll', name: 'Folha de Pagamento', budget: 30000 },
  { id: 'supplies', name: 'Suprimentos & Embalagens', budget: 1500 },
  { id: 'marketing', name: 'Marketing', budget: 1000 },
]

// ── Equipment ──
export const mockEquipment = [
  { id: '1', name: 'Forno Industrial #1', brand: 'Prática', status: 'operational', last_maintenance: '2026-04-15', next_maintenance: '2026-07-15', category: 'forno' },
  { id: '2', name: 'Forno Industrial #2', brand: 'Prática', status: 'operational', last_maintenance: '2026-03-20', next_maintenance: '2026-06-20', category: 'forno' },
  { id: '3', name: 'Masseira Espiral 25kg', brand: 'G.Paniz', status: 'maintenance', last_maintenance: '2026-05-18', next_maintenance: '2026-05-25', category: 'masseira' },
  { id: '4', name: 'Câmara Fria', brand: 'Elgin', status: 'operational', last_maintenance: '2026-04-01', next_maintenance: '2026-07-01', category: 'refrigeração' },
  { id: '5', name: 'Máquina de Café Espresso', brand: 'La Marzocco', status: 'operational', last_maintenance: '2026-05-10', next_maintenance: '2026-08-10', category: 'café' },
  { id: '6', name: 'Modeladora de Pães', brand: 'Venâncio', status: 'operational', last_maintenance: '2026-02-28', next_maintenance: '2026-05-28', category: 'masseira' },
]

// ── Foot Traffic ──
export const mockFootTraffic = {
  today: 142,
  yesterday: 128,
  weekAvg: 135,
  hourly: [
    { hour: '06h', count: 8 },
    { hour: '07h', count: 22 },
    { hour: '08h', count: 35 },
    { hour: '09h', count: 28 },
    { hour: '10h', count: 18 },
    { hour: '11h', count: 24 },
    { hour: '12h', count: 32 },
    { hour: '13h', count: 20 },
    { hour: '14h', count: 15 },
    { hour: '15h', count: 12 },
    { hour: '16h', count: 18 },
    { hour: '17h', count: 22 },
    { hour: '18h', count: 28 },
    { hour: '19h', count: 15 },
    { hour: '20h', count: 8 },
  ],
  peakHour: '08h',
  conversion: 47.9,
}

// ── Social ──
export const mockSocial = {
  instagram: { followers: 4280, reach: 12500, engagement: 4.2, posts: 18, stories: 45 },
  google: { rating: 4.8, reviews: 217, views: 8900 },
  bestPost: { caption: 'Nosso Arthur Ramos, o lanche especial da casa!', likes: 342, comments: 28 },
}

// ── Reports ──
export const mockReports = [
  { id: '1', name: 'Relatório Semanal - Semana 20', type: 'weekly', status: 'ready', generated_at: '2026-05-18T22:00:00', download_url: '#' },
  { id: '2', name: 'DRE Mensal - Abril 2026', type: 'monthly', status: 'ready', generated_at: '2026-05-01T00:00:00', download_url: '#' },
  { id: '3', name: 'Relatório de Desperdício - Semana 20', type: 'weekly', status: 'ready', generated_at: '2026-05-18T22:30:00', download_url: '#' },
]
