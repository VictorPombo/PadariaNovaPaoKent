import manifest from '../../public/images/reais/manifest.json';

export type ManifestCategory = keyof typeof manifest.categorias;
export type ImageCategory = ManifestCategory | 'produtos' | 'eventos';

export interface RealImage {
  id: string;
  src: string;
  alt: string;
  tags: string[];
}

/**
 * Retorna todas as imagens de uma categoria específica.
 */
export function getImagesByCategory(category: ImageCategory): RealImage[] {
  if (category === 'produtos') {
    return [
      ...getImagesByCategory('paes'),
      ...getImagesByCategory('sanduiches'),
      ...getImagesByCategory('salgados'),
      ...getImagesByCategory('doces-bolos'),
      ...getImagesByCategory('cafe-bebidas'),
    ];
  }
  if (category === 'eventos') {
    return [
      ...getImagesByCategory('ambiente-fachada'),
      ...getImagesByCategory('logo-cliente')
    ];
  }

  const rawImages = manifest.categorias[category as ManifestCategory] || [];
  return rawImages.map(raw => ({
    id: raw.id,
    src: raw.src,
    alt: raw.descricao || raw.id,
    tags: [raw.categoria, raw.usada_em].filter(Boolean) as string[]
  }));
}

/**
 * Retorna uma imagem aleatória de uma categoria.
 */
export function getRandomImage(category: ImageCategory): RealImage | null {
  const images = getImagesByCategory(category);
  if (images.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

/**
 * Retorna N imagens aleatórias (sem repetição) de uma categoria.
 */
export function getRandomImages(category: ImageCategory, count: number): RealImage[] {
  const images = [...getImagesByCategory(category)];
  // shuffle
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
  return images.slice(0, count);
}

/**
 * Tenta buscar uma imagem que combine com certas tags.
 */
export function getImageByTags(category: ImageCategory, tags: string[]): RealImage | null {
  const images = getImagesByCategory(category);
  const matched = images.filter(img => tags.some(tag => img.tags.includes(tag)));
  if (matched.length > 0) {
    const randomIndex = Math.floor(Math.random() * matched.length);
    return matched[randomIndex];
  }
  return getRandomImage(category);
}
