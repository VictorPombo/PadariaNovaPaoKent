export interface MenuItem {
  title: string
  description?: string
  price: string
  unit: string // 'KG' | 'UN' | ''
}

export interface MenuCategory {
  title: string
  subtitle?: string
  notes?: string[]
  items: MenuItem[]
}

export const miniSanduiches: MenuCategory = {
  title: 'Mini Sanduíches',
  subtitle: 'Recomendamos uma média de 5 a 6 mini sanduíches por pessoa.',
  notes: [
    'Tipos de pães: mini roseta simples, mini roseta com gergelim, mini francês simples, mini francês com gergelim, mini francês com parmesão, mini francês integral, mini 8 grãos, mini ciabata, mini croissant, mini bisnaga, mini leite, mini australiano, mini pão vegano.',
    'As combinações de frios e molho podem ser trocados, conforme preferência do cliente.'
  ],
  items: [
    { title: 'TIPO 1', description: 'Copa, Queijo Provolone, Pasta de Alho e ervas, alface e tomate', price: '103,00', unit: 'KG' },
    { title: 'TIPO 2', description: 'Presunto, Queijo Prato, Molho Tártaro, Alface e Tomate', price: '102,00', unit: 'KG' },
    { title: 'TIPO 3', description: 'Peito de Perú, Salame Italiano, Molho Rose, Alface e Tomate', price: '103,00', unit: 'KG' },
    { title: 'TIPO 4', description: 'Rosbife da Casa, Queijo Prato, Catupiry, Alface e Tomate', price: '103,00', unit: 'KG' },
    { title: 'TIPO 5', description: 'Pastrame, Lombo Condimentado, Alface e Tomate', price: '108,00', unit: 'KG' },
    { title: 'TIPO 6', description: 'Presunto Crú, Queijo Maasdam, Molho Rose, Alface e Tomate', price: '138,00', unit: 'KG' },
    { title: 'TIPO 7', description: 'Lombo Canadense, Queijo Estepe, Pepino, Maionese, Tomate', price: '103,00', unit: 'KG' },
    { title: 'TIPO 8', description: 'Rosbife, Tomate Seco, Molho Tártaro e Alface', price: '118,00', unit: 'KG' },
    { title: 'TIPO 9', description: 'Mortadela Ceratti com ou sem Pistache, Queijo Prato, Molho Rose alface e tomate', price: '102,00', unit: 'KG' },
    { title: 'TIPO 10', description: 'Peito de Perú, Mussarela de Búfala, Orégano, Molho Rose alface e tomate', price: '103,00', unit: 'KG' },
    { title: 'TIPO 11', description: 'Presunto Cozido, Queijo Estepe, Requeijão, Alface e Tomate', price: '103,00', unit: 'KG' },
    { title: 'TIPO 12', description: 'Salame Italiano, Queijo estepe, Molho Tártaro, Alface e Tomate', price: '103,00', unit: 'KG' },
    { title: 'TIPO 13', description: 'Carpaccio, molho do carpaccio, Queijo ralado e Alface', price: '118,00', unit: 'KG' },
    { title: 'TIPO 14', description: 'Mussarela de Búfala, Tomate seco e Rúcula', price: '103,00', unit: 'KG' },
    { title: 'TIPO 15', description: 'Caponata de Berinjela', price: '119,00', unit: 'KG' },
    { title: 'TIPO 16', description: 'Carpaccio de Salmão, Cream Cheese', price: '195,00', unit: 'KG' },
    { title: 'TIPO 17', description: 'Salpicão de frango, Alface e Tomate', price: '118,00', unit: 'KG' },
  ]
}

export const paesDeMetro: MenuCategory = {
  title: 'Pães de Metro',
  subtitle: 'Perfeito para compartilhar, clássico das comemorações.',
  notes: [
    'Pães disponíveis para pães de metro: Baguete Simples, com Gergelim ou Ciabatta.'
  ],
  items: [
    { title: 'TIPO 1', description: 'Copa, Queijo Provolone, Pasta de Alho e ervas, alface e tomate', price: '106,00', unit: 'UN' },
    { title: 'TIPO 2', description: 'Presunto, Queijo Prato, Molho Tártaro, Alface e Tomate', price: '102,00', unit: 'UN' },
    { title: 'TIPO 3', description: 'Peito de Peru, Salame Italiano, Molho Rose, Alface e Tomate', price: '106,00', unit: 'UN' },
    { title: 'TIPO 4', description: 'Rosbife da Casa, Queijo Prato, Catupiry, Alface e Tomate', price: '106,00', unit: 'UN' },
    { title: 'TIPO 5', description: 'Pastrame, Lombo Condimentado, Alface e Tomate', price: '109,00', unit: 'UN' },
    { title: 'TIPO 6', description: 'Presunto Crú, Queijo Maasdam, Molho Rose, Alface e Tomate', price: '126,00', unit: 'UN' },
    { title: 'TIPO 7', description: 'Lombo Canadense, Queijo Estepe, Pepino, Maionese, Tomate', price: '106,00', unit: 'UN' },
    { title: 'TIPO 8', description: 'Rosbife, Tomate Seco, Molho Tártaro e Alface', price: '109,00', unit: 'UN' },
    { title: 'TIPO 9', description: 'Mortadela Ceratti com ou sem Pistache, Queijo Prato, Molho Rose', price: '102,00', unit: 'UN' },
    { title: 'TIPO 10', description: 'Peito de Perú, Mussarela de Búfala, Azeite, Orégano, Molho Rose', price: '106,00', unit: 'UN' },
    { title: 'TIPO 11', description: 'Presunto Cozido, Queijo Estepe, Requeijão, Alface e Tomate', price: '106,00', unit: 'UN' },
    { title: 'TIPO 12', description: 'Salame Italiano, Queijo estepe, Molho Tártaro, Alface e Tomate', price: '109,00', unit: 'UN' },
    { title: 'TIPO 13', description: 'Carpaccio, molho de carpaccio, queijo ralado e alface', price: '109,00', unit: 'UN' },
    { title: 'TIPO 14', description: 'Mussarela de búfala, Tomate seco e rúcula', price: '109,00', unit: 'UN' },
    { title: 'TIPO 15', description: 'Caponata de berinjela (VEGANO)', price: '176,00', unit: 'UN' },
    { title: 'TIPO 16', description: 'Carpaccio de salmão e cream cheese', price: '230,00', unit: 'UN' },
    { title: 'TIPO 17', description: 'Salpicão de frango, alface e tomate', price: '126,00', unit: 'UN' },
  ]
}

export const salgados: MenuCategory = {
  title: 'Salgados',
  items: [
    { title: 'Petit Four Salgado', description: 'Tipos: Folhado e Amanteigado: Parmesão, Gergelim, Aliche', price: '90,00', unit: 'KG' },
    { title: 'Mini Salgadinhos Diversos', description: 'Tipos: Coxinha, Risoles, Bolinha de Queijo, Kibe, Empadinha Palmito, Empadinha Frango, Esfiha Carne, Esfiha Frango', price: '1,75', unit: 'UN' },
    { title: 'Mini Folhados Diversos', description: 'Tipos: Bauru, Ricota c/ Azeitona, Frango, Calabresa', price: '82,00', unit: 'KG' },
    { title: 'Enroladinhos', description: 'Tipos: Salsicha, Queijo Branco e Presunto e Queijo', price: '82,00', unit: 'KG' },
    { title: 'Mini Croissant Recheado', description: 'Tipos: Queijo, Presunto e Queijo, Frango', price: '82,00', unit: 'KG' },
    { title: 'Mini Pão de Queijo', price: '76,00', unit: 'KG' },
    { title: 'Mini Pão Delícia', description: 'Massa de bisnaga recheada. Tipos: Presunto, Queijo, Peito de Peru', price: '82,00', unit: 'KG' },
    { title: 'Torta Salgada (Pequena - Balcão)', description: 'Tipos: Palmito, Frango', price: '36,00', unit: 'UN' },
    { title: 'Torta Salgada (Média 18cm)', description: 'Tipos: Palmito, Frango', price: '72,00', unit: 'UN' },
    { title: 'Torta Salgada (Grande 20cm)', description: 'Tipos: Palmito, Frango', price: '92,00', unit: 'UN' },
    { title: 'Quiche Grande (20cm)', description: 'Tipos: Queijo, Azeitona, Tomate Seco, Presunto, Alho Poró', price: '97,00', unit: 'UN' },
    { title: 'Quiche Médio (18cm)', description: 'Tipos: Queijo, Azeitona, Tomate Seco, Presunto, Alho Poró', price: '73,00', unit: 'UN' },
    { title: 'Mini Quiche', description: 'Tipos: Azeitona, Tomate Seco, Alho Poró', price: '120,00', unit: 'KG' },
    { title: 'Pizza Mussarela (8 Pedaços)', price: '75,00', unit: 'UN' },
    { title: 'Pizza Calabresa, Frango c/ Catupiry, 3 Queijos', description: '8 Pedaços', price: '77,00', unit: 'UN' },
  ]
}

export const doces: MenuCategory = {
  title: 'Bolos e Doces',
  items: [
    { title: 'Bolo Confeitado', description: 'Tipos: Floresta Negra/Branca, Prestígio, Mousse, Frutas, Brigadeiro, Ferrero Rocher, Oreo. (Consulte disponibilidade de outros sabores)', price: '85,00', unit: 'KG' },
    { title: 'Bolo Mil Folhas', price: '95,00', unit: 'KG' },
    { title: 'Mini Doces', description: 'Tipos: Brigadeiro, Brigadeiro em Flocos, Brigadeiro com Granulado Colorido, Beijinho, Camafeu, Bicho de Pé, Cajuzinho, Olho da Sogra', price: '90,00', unit: 'KG' },
    { title: 'Petit Four Doce', description: 'Tipos: Simples, Geleia de Morango, Goiabada e Chocolate', price: '90,00', unit: 'KG' },
    { title: 'Mini Croissant Recheado Doce', description: 'Tipo: Chocolate', price: '82,00', unit: 'KG' },
    { title: 'Mini Sonho', description: 'Tipos: Creme ou Doce de Leite', price: '82,00', unit: 'KG' },
    { title: 'Mini Lua de Mel', description: 'Tipos: Creme ou Maracujá', price: '82,00', unit: 'KG' },
    { title: 'Mini Bomba', description: 'Tipos: Chocolate ou Creme', price: '82,00', unit: 'KG' },
    { title: 'Carolina Recheada com Doce de Leite', price: '82,00', unit: 'KG' },
    { title: 'Mini Tortinha', description: 'Tipos: Morango, Limão, Maracujá, Chocolate', price: '105,00', unit: 'KG' },
    { title: 'Mini Quindim', price: '105,00', unit: 'KG' },
    { title: 'Mini Pudim', price: '105,00', unit: 'KG' },
  ]
}
