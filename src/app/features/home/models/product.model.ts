/**
 * Centralized NexoProduct interface representing all pharmaceutical products
 * across the NexoGen Pharma application (Intro Showcase, Hero, Products Showcase, and Details).
 */
export interface NexoProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  png?: string;
  width?: number;
  height?: number;
  shortDescription: string;
  subtitle?: string;
  tagline?: string;
  badge?: string;
  packaging?: string;
  accentColor?: string;
  alt: string;
  featured?: boolean;
  order: number;
  animationOrder?: number;
  entranceDirection?: 'left' | 'right' | 'bottom-right';
  // Detailed Editorial Specifications
  packagingDetails?: string;
  storageAndHandling?: string;
  therapeuticClass?: string;
}

/**
 * Filter categories for the product showcase
 */
export type ProductCategory =
  | 'All'
  | 'Skin Care'
  | 'Dietary Supplements'
  | 'Vitamins & Minerals'
  | 'Personal Care';

