-- =============================================
-- PADARIA NOVA PAOKENT — Seed de Dados Reais
-- Migration: 002_seed_data.sql
-- =============================================

-- =============================================
-- CATEGORIAS DO CARDÁPIO
-- =============================================

INSERT INTO menu_categories (id, name, icon, sort_order) VALUES
  ('cat-mat', 'Matinais', '☕', 1),
  ('cat-pao', 'Pães', '🍞', 2),
  ('cat-trad', 'Lanches Tradicionais', '🥪', 3),
  ('cat-esp', 'Especiais no Pão Francês', '🥖', 4),
  ('cat-burg', 'Especiais', '🍔', 5),
  ('cat-sal', 'Tortas, Omeletes e Saladas', '🥗', 6),
  ('cat-salg', 'Salgados', '🥟', 7),
  ('cat-sob', 'Sobremesas', '🍰', 8)
ON CONFLICT DO NOTHING;

-- =============================================
-- MATINAIS
-- =============================================

INSERT INTO menu_items (category_id, name, description, price_small, tags, sort_order) VALUES
  ('cat-mat', 'Café Expresso', 'Café expresso encorpado', 8.50, '{}', 1),
  ('cat-mat', 'Expresso Duplo', 'Café expresso duplo', 16.00, '{}', 2),
  ('cat-mat', 'Média Expresso', 'Expresso com leite', 10.90, '{"mais_vendido"}', 3),
  ('cat-mat', 'Chocolate Pequeno', 'Chocolate quente', 8.00, '{}', 4),
  ('cat-mat', 'Chocolate Médio', 'Chocolate quente médio', 11.90, '{}', 5),
  ('cat-mat', 'Chocolate Gelado', 'Chocolate gelado', 15.90, '{}', 6),
  ('cat-mat', 'Cappuccino Pequeno', 'Cappuccino tradicional', 9.40, '{}', 7),
  ('cat-mat', 'Cappuccino Médio', 'Cappuccino médio', 16.90, '{}', 8),
  ('cat-mat', 'Copo de Leite', 'Leite quente ou gelado', 7.00, '{}', 9),
  ('cat-mat', 'Chá Quente', 'Chá a sua escolha', 7.00, '{}', 10);

-- =============================================
-- PÃES
-- =============================================

INSERT INTO menu_items (category_id, name, description, price_small, tags, sort_order) VALUES
  ('cat-pao', 'Pão c/ Manteiga', 'Pão francês com manteiga', 7.20, '{"mais_vendido"}', 1),
  ('cat-pao', 'Baguete c/ Manteiga', 'Baguete artesanal com manteiga', 12.90, '{}', 2),
  ('cat-pao', 'Baguete c/ Requeijão', 'Baguete com requeijão cremoso', 14.20, '{}', 3),
  ('cat-pao', 'Pão Francês c/ Requeijão', 'Pão francês com requeijão', 9.90, '{"mais_vendido"}', 4),
  ('cat-pao', 'Bisnaga c/ Manteiga', 'Bisnaga com manteiga', 9.90, '{}', 5),
  ('cat-pao', 'Integral c/ Manteiga', 'Pão integral com manteiga', 8.50, '{}', 6),
  ('cat-pao', 'Integral c/ Requeijão', 'Pão integral com requeijão', 10.50, '{}', 7),
  ('cat-pao', 'Pão de Queijo c/ Manteiga', 'Pão de queijo artesanal', 9.90, '{"mais_vendido"}', 8),
  ('cat-pao', 'Pão Francês c/ Nutella', 'Pão francês com Nutella', 15.80, '{}', 9),
  ('cat-pao', 'Ovos Mexidos', 'Ovos mexidos cremosos', 15.90, '{}', 10),
  ('cat-pao', 'Pão de Queijo', 'Pão de queijo sem manteiga', 8.90, '{}', 11);

-- =============================================
-- LANCHES TRADICIONAIS
-- =============================================

INSERT INTO menu_items (category_id, name, description, price_small, price_large, tags, sort_order) VALUES
  ('cat-trad', 'Bauru', 'Queijo, presunto, tomate e pepino', 22.80, 39.80, '{"mais_vendido"}', 1),
  ('cat-trad', 'Misto Quente ou Frio', 'Presunto e queijo', 21.50, 38.50, '{}', 2),
  ('cat-trad', 'Queijo Quente', 'Queijo derretido', 21.50, 38.50, '{}', 3),
  ('cat-trad', 'Mortadela Ceratti', 'Mortadela Ceratti premium', 23.50, 40.50, '{"mais_vendido"}', 4),
  ('cat-trad', 'Queijo Branco', 'Queijo branco artesanal', 22.80, 39.80, '{}', 5),
  ('cat-trad', 'Presunto', 'Presunto selecionado', 21.50, 37.50, '{}', 6),
  ('cat-trad', 'Presunto Parma', 'Presunto Parma importado', 38.90, 54.90, '{}', 7),
  ('cat-trad', 'Provolone', 'Queijo provolone derretido', 23.50, 37.50, '{}', 8),
  ('cat-trad', 'Salame', 'Salame italiano', 24.80, 37.50, '{}', 9),
  ('cat-trad', 'Copa', 'Copa premium fatiada', 29.90, 44.00, '{}', 10),
  ('cat-trad', 'Presunto Royale', 'Presunto royale especial', 26.90, 41.50, '{}', 11),
  ('cat-trad', 'Queijo Emental', 'Queijo emental suíço', 39.00, 54.50, '{}', 12),
  ('cat-trad', 'Pão c/ Ovos', 'Ovos fritos ou mexidos', 17.50, 29.90, '{}', 13),
  ('cat-trad', 'Pão c/ Ovos e Queijo', 'Ovos com queijo', 22.50, 39.50, '{}', 14);

-- =============================================
-- ESPECIAIS NO PÃO FRANCÊS (com nome de rua)
-- =============================================

INSERT INTO menu_items (id, category_id, name, price_small, price_large, tags, is_featured, sort_order) VALUES
  ('item-arthur', 'cat-esp', 'Arthur Ramos', 47.90, 56.90, '{"mais_vendido", "especial"}', TRUE, 1),
  ('item-mario', 'cat-esp', 'Mario Ferraz', 39.50, 46.50, '{"especial"}', FALSE, 2),
  ('item-tucuma', 'cat-esp', 'Tucumã', 39.50, 46.50, '{"especial"}', TRUE, 3),
  ('item-cidade', 'cat-esp', 'Cidade Jardim', 39.50, 46.50, '{"especial"}', TRUE, 4),
  ('item-amauri', 'cat-esp', 'Amauri', 39.50, 46.50, '{"especial"}', TRUE, 5),
  ('item-jacurici', 'cat-esp', 'Jacurici', 39.50, 46.50, '{"especial"}', FALSE, 6),
  ('item-farialima', 'cat-esp', 'Faria Lima', 39.50, 46.50, '{"especial", "mais_vendido"}', TRUE, 7),
  ('item-tabapua', 'cat-esp', 'Tabapuã', 39.50, 46.50, '{"especial"}', FALSE, 8),
  ('item-iguatemi', 'cat-esp', 'Iguatemi', NULL, NULL, '{"especial"}', TRUE, 9),
  ('item-joaquim', 'cat-esp', 'Joaquim Floriano', 39.50, 46.50, '{"especial"}', FALSE, 10),
  ('item-horacio', 'cat-esp', 'Horácio Lafer', 39.50, 46.50, '{"especial"}', FALSE, 11),
  ('item-novejulho', 'cat-esp', 'Nove de Julho', 39.50, 46.50, '{"especial"}', FALSE, 12),
  ('item-eduardo', 'cat-esp', 'Eduardo', 39.50, 46.50, '{"especial"}', FALSE, 13);

-- Descrições dos especiais (Specialty Sandwiches)
INSERT INTO specialty_sandwiches (menu_item_id, street_name, ingredients, display_order) VALUES
  ('item-arthur', 'Arthur Ramos', 'Presunto Parma, queijo estepe, rúcula, mostarda dijon', 1),
  ('item-farialima', 'Faria Lima', 'Salame, queijo estepe, molho tártaro, alface, tomate', 2),
  ('item-cidade', 'Cidade Jardim', 'Rosbife, queijo prato, catupiry, alface, tomate', 3),
  ('item-iguatemi', 'Iguatemi', 'Mortadela com pistache, queijo prato, molho rosé', 4),
  ('item-tucuma', 'Tucumã', 'Peito de peru, mussarela de búfala, tomate seco, rúcula', 5),
  ('item-amauri', 'Amauri', 'Rosbife, parmesão, catupiry, rúcula, mostarda', 6),
  ('item-mario', 'Mario Ferraz', 'Combinação especial do chef', 7),
  ('item-jacurici', 'Jacurici', 'Combinação especial do chef', 8),
  ('item-tabapua', 'Tabapuã', 'Combinação especial do chef', 9),
  ('item-joaquim', 'Joaquim Floriano', 'Combinação especial do chef', 10),
  ('item-horacio', 'Horácio Lafer', 'Combinação especial do chef', 11),
  ('item-novejulho', 'Nove de Julho', 'Combinação especial do chef', 12),
  ('item-eduardo', 'Eduardo', 'Combinação especial do chef', 13);

-- =============================================
-- ESPECIAIS (Hambúrguer e Beirute)
-- =============================================

INSERT INTO menu_items (category_id, name, description, price_small, tags, sort_order) VALUES
  ('cat-burg', 'X-Salada', 'Hambúrguer, queijo, alface, tomate', 32.90, '{}', 1),
  ('cat-burg', 'X-Burguer', 'Hambúrguer clássico com queijo', 28.90, '{"mais_vendido"}', 2),
  ('cat-burg', 'X-Egg', 'Hambúrguer com ovo e queijo', 37.90, '{}', 3),
  ('cat-burg', 'Americano no Francês', 'Hambúrguer no pão francês', 28.90, '{}', 4),
  ('cat-burg', 'Americano na Baguete', 'Hambúrguer na baguete artesanal', 39.90, '{}', 5),
  ('cat-burg', 'Beirute Jerônimo da Veiga', 'Beirute especial com ingredientes premium', 45.90, '{}', 6),
  ('cat-burg', 'Beirute Seridó', 'Beirute tradicional nordestino', 45.90, '{}', 7);

-- =============================================
-- TORTAS, OMELETES E SALADAS
-- =============================================

INSERT INTO menu_items (category_id, name, description, price_small, tags, sort_order) VALUES
  ('cat-sal', 'Salada Mista', 'Salada fresca do dia', 22.90, '{}', 1),
  ('cat-sal', 'Tapioca Presunto e Queijo', 'Tapioca com presunto e queijo', 27.90, '{}', 2),
  ('cat-sal', 'Tapioca Peito de Peru', 'Tapioca com peito de peru', 28.90, '{}', 3),
  ('cat-sal', 'Omelete Misto', 'Omelete de presunto e queijo', 28.90, '{"mais_vendido"}', 4),
  ('cat-sal', 'Omelete c/ Salada', 'Omelete acompanhado de salada', 37.90, '{}', 5),
  ('cat-sal', 'Torta Frango Pedaço', 'Pedaço de torta de frango', 22.90, '{"mais_vendido"}', 6),
  ('cat-sal', 'Torta Frango c/ Salada', 'Torta de frango com salada', 37.90, '{}', 7),
  ('cat-sal', 'Tapioca c/ Ovos', 'Tapioca com ovos', 28.50, '{}', 8),
  ('cat-sal', 'Tapioca c/ Manteiga', 'Tapioca simples com manteiga', 19.50, '{}', 9);

-- =============================================
-- SALGADOS
-- =============================================

INSERT INTO menu_items (category_id, name, description, price_small, tags, sort_order) VALUES
  ('cat-salg', 'Tortinhas', 'Tortinhas variadas', 14.50, '{}', 1),
  ('cat-salg', 'Salgados Diversos', 'Coxinha, empada, esfirra...', 12.00, '{"mais_vendido"}', 2),
  ('cat-salg', 'Coxa Creme', 'Coxa de frango com creme', 14.50, '{"ifood_top"}', 3),
  ('cat-salg', 'Empada Frango/Palmito', 'Empada artesanal', 10.90, '{}', 4);

-- =============================================
-- SOBREMESAS
-- =============================================

INSERT INTO menu_items (category_id, name, description, price_small, tags, sort_order) VALUES
  ('cat-sob', 'Pedaço de Bolo', 'Bolo do dia', 12.50, '{}', 1),
  ('cat-sob', 'Mini Torta Morango/Limão', 'Mini torta (preço por kg)', 108.00, '{}', 2),
  ('cat-sob', 'Mamão em Pedaços', 'Mamão fresco fatiado', 16.90, '{}', 3),
  ('cat-sob', 'Salada de Frutas', 'Salada de frutas da estação', 20.90, '{}', 4);

-- =============================================
-- CATEGORIAS DE ESTOQUE (seed inicial)
-- =============================================

INSERT INTO stock_categories (name, icon, sort_order) VALUES
  ('Salgados', '🥟', 1),
  ('Bebidas', '🥤', 2),
  ('Pães e Massas', '🍞', 3),
  ('Frios', '🧀', 4),
  ('Laticínios', '🧈', 5),
  ('Insumos', '🧂', 6),
  ('Embalagens', '📦', 7),
  ('Limpeza', '🧹', 8);

-- =============================================
-- AVALIAÇÕES REAIS (seed)
-- =============================================

INSERT INTO reviews (customer_name, rating, comment, source, is_featured, review_date) VALUES
  ('Júlio César', 5, 'Muito gostoso. O café é saboroso e o pão não chapa.', 'google', TRUE, '2024-11-01'),
  ('Vera Santos', 5, 'Sou cliente há mais de 40 anos. Qualidade sempre impecável!', 'google', TRUE, '2024-10-15'),
  ('Arthur Rebelo', 5, 'A melhor broa de milho de todas!', 'google', TRUE, '2024-09-20'),
  ('Marina Costa', 5, 'Ambiente acolhedor, atendimento excelente. Venho toda semana!', 'google', FALSE, '2024-12-01'),
  ('Roberto Alves', 5, 'O lanche Arthur Ramos é incrível. Vale cada centavo!', 'google', FALSE, '2024-11-28'),
  ('Fernanda Lima', 5, 'Cafeteria premium no coração do Jardim Paulistano. Recomendo!', 'google', FALSE, '2024-12-10');

-- =============================================
-- EQUIPAMENTOS (seed inicial)
-- =============================================

INSERT INTO equipment (name, model, maintenance_interval_days) VALUES
  ('Forno Industrial', 'Forno Turbo', 90),
  ('Câmara Fria', 'Câmara Frigorífica', 180),
  ('Máquina de Café Expresso', 'La Marzocco', 60),
  ('Batedeira Industrial', 'Batedeira 30L', 180),
  ('Câmara de Fermentação', 'Fermentadora', 90),
  ('Fritadeira Industrial', 'Fritadeira 14L', 60);

-- =============================================
-- CONFIGURAÇÕES DO SISTEMA (meta)
-- =============================================
-- Nota: criar tabela de configurações para armazenar metas padrão, 
-- limiar de aprovação de gastos, etc.

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO app_settings (key, value, description) VALUES
  ('business_info', '{
    "name": "Padaria Nova Paokent",
    "phone": "11976535789",
    "instagram": "@novapaokent",
    "address": "Rua Prof. Artur Ramos, 223 — Jardim Paulistano, São Paulo",
    "google_maps_url": "https://maps.google.com/?q=Rua+Prof+Artur+Ramos+223+Jardim+Paulistano+Sao+Paulo",
    "ifood_url": "",
    "founded_year": 1994
  }', 'Informações básicas do negócio'),
  ('daily_goal', '{"amount": 5000}', 'Meta diária padrão de faturamento'),
  ('shifts', '{
    "shift_1": {"name": "Turno 1", "start": "06:00", "end": "14:00"},
    "shift_2": {"name": "Turno 2", "start": "14:00", "end": "22:00"}
  }', 'Configuração de turnos'),
  ('expense_approval_threshold', '{"amount": 500}', 'Gastos acima desse valor requerem aprovação do dono'),
  ('waste_alert_threshold', '{"percent": 1.5}', 'Alerta quando desperdício passa de 1.5% do faturamento'),
  ('cmv_alert_threshold', '{"percent": 35}', 'Alerta quando CMV passa de 35%'),
  ('whatsapp_report_time', '{"hour": 22, "minute": 0}', 'Hora do relatório diário automático via WhatsApp')
ON CONFLICT DO NOTHING;

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_settings_authenticated" ON app_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "app_settings_public_read" ON app_settings FOR SELECT USING (key IN ('business_info'));
