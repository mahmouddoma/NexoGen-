/**
 * NexoGen Pharma — Official Contact & Corporate Details
 * Centralized Single Source of Truth for company communication channels.
 */
export interface NexoGenContactInfo {
  readonly companyName: string;
  readonly legalName: string;
  readonly tagline: string;
  readonly address: string;
  readonly serviceArea: string;
  readonly mobile: string;
  readonly mobileDisplay: string;
  readonly mobileTel: string;
  readonly whatsappUrl: string;
  readonly email: string;
  readonly facebookUrl: string;
  readonly facebookHandle: string;
}

export const NEXOGEN_CONTACT: NexoGenContactInfo = {
  companyName: 'NexoGen Pharma',
  legalName: 'NexoGen Pharmaceuticals',
  tagline: 'Precision Science. Everyday Care.',
  address: 'Sharqia, Zagazig, Egypt',
  serviceArea: 'Egypt',
  mobile: '010 95177255',
  mobileDisplay: '010 95177255',
  mobileTel: '+201095177255',
  whatsappUrl: 'https://wa.me/201095177255',
  email: 'moamen.haleem555@gmail.com',
  facebookUrl: 'https://www.facebook.com/share/1FW8jsbZwy/?mibextid=wwXIfr',
  facebookHandle: 'NexoGen Pharma'
};

