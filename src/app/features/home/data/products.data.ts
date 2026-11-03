import { NexoProduct } from '../models/product.model';

/**
 * Centralized master catalog of the 6 authentic NexoGen Pharma products.
 * Shared between Intro Showcase, Hero, Products Showcase, and Details routes.
 */
export const NEXOGEN_PRODUCTS: NexoProduct[] = [
  {
    id: 'lumgen-care',
    slug: 'lumgen-care',
    name: 'LumGen-care Cream',
    category: 'Skin Care',
    image: 'assets/products/lumgen-care.webp',
    png: 'assets/products/lumgen-care.png',
    width: 629,
    height: 419,
    order: 1,
    animationOrder: 1,
    featured: true,
    shortDescription: 'Advanced barrier repair cream formulated to soothe, hydrate, and restore delicate epidermal tissue.',
    subtitle: 'Ceramides & Bio-Complex Jar 50g',
    packaging: '50g Pharmaceutical Jar',
    packagingDetails: '50g sealed pharmaceutical jar with protective barrier inner seal.',
    storageAndHandling: 'Store below 25°C in a dry place. Protect from direct heat and sunlight. For external topical dermatological use only.',
    therapeuticClass: 'Dermatological Barrier Restoration',
    accentColor: '#009f9c',
    tagline: 'Advanced Epidermal Barrier Restoration',
    badge: 'Core Therapy 01',
    alt: 'LumGen-care Cream pharmaceutical jar and lid cutout',
    entranceDirection: 'left'
  },
  {
    id: 'cascadin-4000iu',
    slug: 'cascadin-4000iu',
    name: 'Cascadin 4000 IU',
    category: 'Dietary Supplements',
    image: 'assets/products/cascadin-4000iu.webp',
    png: 'assets/products/cascadin-4000iu.png',
    width: 405,
    height: 508,
    order: 2,
    animationOrder: 2,
    featured: true,
    shortDescription: 'High-potency cholecalciferol formulation supporting bone mineral density and immune system vitality.',
    subtitle: 'Cholecalciferol 30 Film-Coated Tablets',
    packaging: '30 Film-Coated Tablets',
    packagingDetails: 'Carton containing 30 film-coated tablets packaged in 3 blister strips (10 tablets per strip).',
    storageAndHandling: 'Store below 30°C in a dry place away from light and excessive moisture. Dietary supplement — use under professional healthcare guidance.',
    therapeuticClass: 'Cholecalciferol Bone & Metabolic Support',
    accentColor: '#d97706',
    tagline: 'High-Bioavailability Vitamin D3 Formulation',
    badge: 'Core Therapy 02',
    alt: 'Cascadin 4000 IU pharmaceutical packaging cutout',
    entranceDirection: 'right'
  },
  {
    id: 'sponge-iron',
    slug: 'sponge-iron',
    name: 'Sponge-IRON Oral Drops',
    category: 'Vitamins & Minerals',
    image: 'assets/products/sponge-iron.webp',
    png: 'assets/products/sponge-iron.png',
    width: 443,
    height: 638,
    order: 3,
    animationOrder: 3,
    featured: true,
    shortDescription: 'Gentle micro-encapsulated iron oral drops with high bioavailability designed for optimal gastrointestinal tolerance.',
    subtitle: 'Micro-Encapsulated Iron 30mL',
    packaging: '30mL Dropper Bottle',
    packagingDetails: '30mL amber glass dropper bottle with calibrated graduated dosing pipette.',
    storageAndHandling: 'Store at controlled room temperature below 25°C. Keep bottle tightly closed. Shake gently before administration.',
    therapeuticClass: 'Hematologic Iron Micronutrient Therapy',
    accentColor: '#16a34a',
    tagline: 'Gentle Bioactive Hematologic Delivery System',
    badge: 'Core Therapy 03',
    alt: 'Sponge-IRON Oral Drops amber dropper bottle cutout',
    entranceDirection: 'bottom-right'
  },
  {
    id: 'nexogen-massage-gel',
    slug: 'nexogen-massage-gel',
    name: 'NexoGen Massage Gel',
    category: 'Personal Care',
    image: 'assets/products/nexogen-massage-gel.webp',
    png: 'assets/products/nexogen-massage-gel.png',
    width: 951,
    height: 750,
    order: 4,
    animationOrder: 4,
    featured: false,
    shortDescription: 'Soothing topical formulation engineered for deep muscle relaxation and targeted physical recovery.',
    subtitle: 'Targeted Muscle Soothing Matrix 100mL',
    packaging: '100mL Carton & Ergonomic Tube',
    packagingDetails: '100mL flexible ergonomic squeeze tube with precision flip-top cap inside protective carton.',
    storageAndHandling: 'For external topical use only. Do not apply to broken skin. Avoid eye contact. Store below 30°C.',
    therapeuticClass: 'Topical Musculoskeletal Comfort Matrix',
    accentColor: '#0284c7',
    tagline: 'Targeted Deep-Tissue Comfort',
    badge: 'Personal Care',
    alt: 'NexoGen Massage Gel 100mL carton and tube cutout'
  },
  {
    id: 'nexoflon',
    slug: 'nexoflon',
    name: 'Nexoflon',
    category: 'Dietary Supplements',
    image: 'assets/products/nexoflon.webp',
    png: 'assets/products/nexoflon.png',
    width: 748,
    height: 1033,
    order: 5,
    animationOrder: 5,
    featured: false,
    shortDescription: 'Targeted flunarizine capsule formulation developed to support cellular calcium homeostasis and wellness.',
    subtitle: 'Flunarizine 10mg Capsules',
    packaging: '20 Capsules (2 Strips x 10)',
    packagingDetails: 'Unit-dose blister packaging containing 20 capsules (2 aluminium/PVC blister strips of 10 capsules).',
    storageAndHandling: 'Store below 25°C in a dry environment protected from light. Keep out of reach of children.',
    therapeuticClass: 'Selective Calcium Entry Modulation',
    accentColor: '#e11d48',
    tagline: 'Selective Calcium Entry Blocker Therapy',
    badge: 'Targeted Care',
    alt: 'Nexoflon Flunarizine 10mg pharmaceutical box cutout'
  },
  {
    id: 'nexray-care-spray',
    slug: 'nexray-care-spray',
    name: 'Nexray Care Spray',
    category: 'Personal Care',
    image: 'assets/products/nexray-care-spray.webp',
    png: 'assets/products/nexray-care-spray.png',
    width: 421,
    height: 746,
    order: 6,
    animationOrder: 6,
    featured: false,
    shortDescription: 'Fast-acting antiseptic spray mist offering broad-spectrum skin hygiene and protective topical care.',
    subtitle: 'Antiseptic Solution 150mL',
    packaging: '150mL Fine-Mist Dispenser',
    packagingDetails: '150mL pressure-free ergonomic bottle with directional fine-mist pump mechanism.',
    storageAndHandling: 'Store upright below 25°C away from heat or open flame. For external dermatological hygiene only.',
    therapeuticClass: 'Topical Antiseptic Hygiene Solution',
    accentColor: '#0891b2',
    tagline: 'Microbial Barrier Disinfectant Mist',
    badge: 'Topical Mist',
    alt: 'Nexray Care Spray 150mL bottle and carton cutout'
  }
];

/**
 * Filter categories derived from the products
 */
export const PRODUCT_CATEGORIES = [
  'All',
  'Skin Care',
  'Dietary Supplements',
  'Vitamins & Minerals',
  'Personal Care'
] as const;

/**
 * First 3 products used in the cinematic Intro Showcase
 */
export const INITIAL_INTRO_PRODUCTS: NexoProduct[] = NEXOGEN_PRODUCTS.slice(0, 3);

/**
 * Pipeline expansion products
 */
export const ADDITIONAL_NEXOGEN_PRODUCTS: NexoProduct[] = NEXOGEN_PRODUCTS.slice(3);

