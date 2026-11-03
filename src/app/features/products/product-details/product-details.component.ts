import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  effect,
  signal,
  OnDestroy,
  ElementRef,
  PLATFORM_ID,
  viewChild,
  NgZone
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { NEXOGEN_PRODUCTS } from '../../home/data/products.data';
import { NexoProduct } from '../../home/models/product.model';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  selector: 'app-product-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly langService = inject(LanguageService);

  // Bound directly from route param :slug via withComponentInputBinding()
  readonly slug = input<string>();

  // Main container reference for scoped GSAP animations
  private readonly containerRef = viewChild<ElementRef<HTMLElement>>('detailsContainer');

  private ctx?: gsap.Context;

  // Active product resolved from master catalog
  readonly currentProduct = computed<NexoProduct | undefined>(() => {
    const s = this.slug() || this.route.snapshot.paramMap.get('slug');
    if (!s) return undefined;
    return NEXOGEN_PRODUCTS.find((p) => p.slug === s || p.id === s);
  });

  // Circular Previous / Next navigation computed from master catalog
  readonly navigation = computed(() => {
    const current = this.currentProduct();
    if (!current) return null;

    const index = NEXOGEN_PRODUCTS.findIndex((p) => p.id === current.id);
    const total = NEXOGEN_PRODUCTS.length;
    const prevIndex = (index - 1 + total) % total;
    const nextIndex = (index + 1) % total;

    return {
      previous: NEXOGEN_PRODUCTS[prevIndex],
      next: NEXOGEN_PRODUCTS[nextIndex]
    };
  });

  // Exactly 3 relevant related products based on category with deterministic fallback
  readonly relatedProducts = computed<NexoProduct[]>(() => {
    const current = this.currentProduct();
    if (!current) return [];

    const sameCategory = NEXOGEN_PRODUCTS.filter(
      (p) => p.category === current.category && p.id !== current.id
    );
    const others = NEXOGEN_PRODUCTS.filter(
      (p) => p.category !== current.category && p.id !== current.id
    );

    return [...sameCategory, ...others].slice(0, 3);
  });

  // Expandable information sections (accordions)
  readonly openSections = signal<Record<string, boolean>>({
    overview: true,
    packaging: false,
    storage: false
  });

  constructor() {
    // Dynamic metadata and page entrance coordination with bilingual support
    effect(() => {
      const prod = this.currentProduct();
      const lang = this.langService.language();
      if (prod) {
        if (lang === 'ar') {
          this.titleService.setTitle(`${prod.name} — نكسوجين فارما`);
          this.metaService.updateTag({
            name: 'description',
            content: `استكشف ${prod.name} من نكسوجين فارما — مواصفات التركيبة والجودة والجرعة.`
          });
        } else {
          this.titleService.setTitle(`${prod.name} — NexoGen Pharma`);
          this.metaService.updateTag({
            name: 'description',
            content: `${prod.name}: ${prod.shortDescription}`
          });
        }

        // Trigger GSAP entrance animation on product change
        if (isPlatformBrowser(this.platformId)) {
          this.ngZone.runOutsideAngular(() => {
            setTimeout(() => this.runEntranceAnimation(), 40);
          });
        }
      } else {
        if (lang === 'ar') {
          this.titleService.setTitle('تفاصيل المستحضر — نكسوجين فارما');
        } else {
          this.titleService.setTitle('Product Details — NexoGen Pharma');
        }
      }
    });
  }

  isSectionOpen(section: string): boolean {
    return !!this.openSections()[section];
  }

  toggleSection(section: string): void {
    this.openSections.update((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  }

  onNavigateProduct(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  private runEntranceAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const containerEl = this.containerRef()?.nativeElement;
    if (!containerEl) return;

    this.ctx?.revert();
    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 1. Breadcrumb subtle fade
      tl.fromTo(
        '.editorial-breadcrumb',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.4 },
        0
      );

      // 2. Product hero image gently moves into the foreground (scale 0.9 -> 1, y: 30 -> 0)
      tl.fromTo(
        '.product-hero-image',
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'power3.out' },
        0.05
      );

      // 3. Grounding shadow subtle expansion
      tl.fromTo(
        '.product-grounding-shadow',
        { opacity: 0, scale: 0.7 },
        { opacity: 0.85, scale: 1, duration: 0.7, ease: 'power2.out' },
        0.1
      );

      // 4. Product Title, Category, Subtitle sequential reveal
      tl.fromTo(
        ['.info-header-meta', '.editorial-product-title', '.editorial-product-subtitle'],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 },
        0.15
      );

      // 5. Description and facts table reveal
      tl.fromTo(
        ['.editorial-lead-description', '.product-facts-table', '.expandable-sections', '.editorial-actions'],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        0.25
      );
    }, containerEl);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    this.titleService.setTitle('NexoGen Pharma — Innovation in Patient Care');
    this.metaService.updateTag({
      name: 'description',
      content:
        'NexoGen Pharma — Advancing human health through innovative formulations, clinical excellence, and patient-centered pharmaceutical care.'
    });
  }
}
