import manifest from '../../public/images/reais/manifest.json';

export type ImageCategory = keyof typeof manifest.categorias;

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
  return manifest.categorias[category] || [];
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
