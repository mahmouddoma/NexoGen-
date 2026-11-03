import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  viewChild,
  viewChildren,
  ElementRef,
  OnDestroy,
  inject,
  PLATFORM_ID,
  NgZone,
  output,
  afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NexoProduct } from '../../models/product.model';
import { NEXOGEN_PRODUCTS, PRODUCT_CATEGORIES } from '../../data/products.data';

interface CardTransformConfig {
  xPercent: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
  rotateY: number;
  pointerEvents: string;
}

@Component({
  selector: 'app-products-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './products-showcase.component.html',
  styleUrl: './products-showcase.component.scss'
})
export class ProductsShowcaseComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  // Master product data and reactive filter state
  readonly allProducts = signal<NexoProduct[]>(NEXOGEN_PRODUCTS);
  readonly selectedCategory = signal<string>('All');
  readonly categories = signal<readonly string[]>(PRODUCT_CATEGORIES);
  readonly activeIndex = signal<number>(0);
  readonly isTransitioning = signal<boolean>(false);

  /**
   * Resolve translation key for category filter pills.
   */
  getCategoryKey(category: string): string {
    const map: Record<string, string> = {
      'All': 'PRODUCTS.CATEGORIES.ALL',
      'Skin Care': 'PRODUCTS.CATEGORIES.SKIN_CARE',
      'Dietary Supplements': 'PRODUCTS.CATEGORIES.DIETARY_SUPPLEMENTS',
      'Vitamins & Minerals': 'PRODUCTS.CATEGORIES.VITAMINS_MINERALS',
      'Personal Care': 'PRODUCTS.CATEGORIES.PERSONAL_CARE'
    };
    return map[category] || category;
  }

  // Output event for product interactions
  readonly productSelected = output<NexoProduct>();

  // Filtered products derived reactively via computed signal
  readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const products = this.allProducts();
    if (category === 'All') {
      return products;
    }
    return products.filter((p) => p.category === category);
  });

  readonly totalCount = computed(() => this.filteredProducts().length);

  readonly activeProduct = computed<NexoProduct>(() => {
    const list = this.filteredProducts();
    if (!list.length) return this.allProducts()[0];
    const idx = Math.min(Math.max(0, this.activeIndex()), list.length - 1);
    return list[idx];
  });

  readonly prevIndex = computed(() => {
    const total = this.totalCount();
    if (total <= 1) return -1;
    return (this.activeIndex() - 1 + total) % total;
  });

  readonly nextIndex = computed(() => {
    const total = this.totalCount();
    if (total <= 1) return -1;
    return (this.activeIndex() + 1) % total;
  });

  readonly formattedCounter = computed(() => {
    const total = this.totalCount();
    if (total === 0) return '00 / 00';
    const current = (this.activeIndex() + 1).toString().padStart(2, '0');
    const totalStr = total.toString().padStart(2, '0');
    return `${current} / ${totalStr}`;
  });

  // DOM Signal References
  private readonly showcaseSection = viewChild<ElementRef<HTMLElement>>('showcaseSection');
  private readonly sectionEyebrow = viewChild<ElementRef<HTMLElement>>('sectionEyebrow');
  private readonly sectionHeading = viewChild<ElementRef<HTMLElement>>('sectionHeading');
  private readonly sectionLead = viewChild<ElementRef<HTMLElement>>('sectionLead');
  private readonly categoryFiltersNav = viewChild<ElementRef<HTMLElement>>('categoryFiltersNav');
  private readonly spotlightDossier = viewChild<ElementRef<HTMLElement>>('spotlightDossier');
  private readonly spotlightStage = viewChild<ElementRef<HTMLElement>>('spotlightStage');
  private readonly slideCards = viewChildren<ElementRef<HTMLElement>>('slideCard');

  // GSAP Context & Timelines
  private ctx?: gsap.Context;
  private revealTimeline?: gsap.core.Timeline;
  private carouselTimeline?: gsap.core.Timeline;

  // Touch tracking for swipe navigation
  private touchStartX = 0;
  private touchStartY = 0;

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.initializeAnimations();
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanupAnimations();
  }

  /**
   * Filter category selection
   */
  selectCategory(category: string): void {
    if (this.isTransitioning()) return;
    this.selectedCategory.set(category);
    this.activeIndex.set(0);

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.applyCardTransformsInstant();
        ScrollTrigger.refresh();
      }, 50);
    }
  }

  getCategoryCount(category: string): number {
    if (category === 'All') {
      return this.allProducts().length;
    }
    return this.allProducts().filter((p) => p.category === category).length;
  }

  /**
   * Navigate to Next Product
   */
  nextProduct(): void {
    if (this.isTransitioning() || this.totalCount() <= 1) return;
    const nextIdx = (this.activeIndex() + 1) % this.totalCount();
    this.transitionToProduct(nextIdx, 1);
  }

  /**
   * Navigate to Previous Product
   */
  previousProduct(): void {
    if (this.isTransitioning() || this.totalCount() <= 1) return;
    const prevIdx = (this.activeIndex() - 1 + this.totalCount()) % this.totalCount();
    this.transitionToProduct(prevIdx, -1);
  }

  /**
   * Jump to specific product index
   */
  goToProduct(index: number): void {
    if (this.isTransitioning() || index === this.activeIndex() || index < 0 || index >= this.totalCount()) {
      return;
    }
    const direction = index > this.activeIndex() ? 1 : -1;
    this.transitionToProduct(index, direction);
  }

  /**
   * Click on stage background card to bring it forward
   */
  onSlideCardClick(index: number): void {
    if (this.isTransitioning()) return;
    if (index === this.activeIndex()) {
      this.productSelected.emit(this.activeProduct());
      return;
    }
    if (index === this.nextIndex()) {
      this.nextProduct();
    } else if (index === this.prevIndex()) {
      this.previousProduct();
    } else {
      this.goToProduct(index);
    }
  }

  /**
   * Keyboard arrow support within carousel region
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextProduct();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previousProduct();
    }
  }

  /**
   * Mobile touch swipe handling
   */
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.changedTouches.length > 0) {
      const deltaX = event.changedTouches[0].clientX - this.touchStartX;
      const deltaY = event.changedTouches[0].clientY - this.touchStartY;

      // Only trigger if horizontal swipe is stronger than vertical scroll
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          this.nextProduct();
        } else {
          this.previousProduct();
        }
      }
    }
  }

  /**
   * Calculate responsive horizontal separation to guarantee clear spacing between active and side products
   */
  private getResponsiveSpread(): number {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return 270;
    const w = window.innerWidth;
    if (w <= 480) return 130;
    if (w <= 768) return 160;
    if (w <= 1024) return 220;
    return 270;
  }

  /**
   * Compute 3D spotlight card position, scale, opacity, and rotation based on relative index distance.
   * xPercent: -50 perfectly centers any product element, while x provides calibrated horizontal separation.
   */
  getCardTransform(index: number, targetActiveIndex: number, total: number): CardTransformConfig {
    const spreadX = this.getResponsiveSpread();

    if (total <= 1) {
      return {
        xPercent: -50,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        rotateY: 0,
        pointerEvents: 'auto'
      };
    }

    let diff = index - targetActiveIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      // Active Foreground Product - Perfectly Centered on Stage Pedestal
      return {
        xPercent: -50,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        rotateY: 0,
        pointerEvents: 'auto'
      };
    }

    if (diff === 1) {
      // Next Product (Stage Right, clearly separated without overlap)
      return {
        xPercent: -50,
        x: spreadX,
        y: 0,
        scale: 0.62,
        opacity: 0.52,
        zIndex: 5,
        rotateY: -10,
        pointerEvents: 'auto'
      };
    }

    if (diff === -1) {
      // Previous Product (Stage Left, clearly separated without overlap)
      return {
        xPercent: -50,
        x: -spreadX,
        y: 0,
        scale: 0.62,
        opacity: 0.52,
        zIndex: 5,
        rotateY: 10,
        pointerEvents: 'auto'
      };
    }

    if (diff > 1) {
      // Waiting off right
      return {
        xPercent: -50,
        x: spreadX * 1.6,
        y: 8,
        scale: 0.42,
        opacity: 0,
        zIndex: 1,
        rotateY: -16,
        pointerEvents: 'none'
      };
    }

    // diff < -1: Waiting off left
    return {
      xPercent: -50,
      x: -spreadX * 1.6,
      y: 8,
      scale: 0.42,
      opacity: 0,
      zIndex: 1,
      rotateY: 16,
      pointerEvents: 'none'
    };
  }

  /**
   * Instant styling for reduced-motion or initialization
   */
  private applyCardTransformsInstant(): void {
    const cards = this.slideCards().map((c) => c.nativeElement);
    const total = this.totalCount();
    const active = this.activeIndex();

    cards.forEach((card, i) => {
      const cfg = this.getCardTransform(i, active, total);
      gsap.set(card, {
        xPercent: cfg.xPercent,
        x: cfg.x,
        y: cfg.y,
        scale: cfg.scale,
        opacity: cfg.opacity,
        zIndex: cfg.zIndex,
        rotateY: cfg.rotateY,
        pointerEvents: cfg.pointerEvents,
        transformPerspective: 1200
      });
    });
  }

  /**
   * Coordinated 3D Carousel Transition
   */
  private transitionToProduct(targetIndex: number, direction: number): void {
    this.activeIndex.set(targetIndex);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.applyCardTransformsInstant();
      return;
    }

    this.isTransitioning.set(true);

    this.ngZone.runOutsideAngular(() => {
      if (this.carouselTimeline) {
        this.carouselTimeline.kill();
      }

      const dossierEl = this.spotlightDossier()?.nativeElement;
      const cards = this.slideCards().map((c) => c.nativeElement);
      const total = this.totalCount();

      this.carouselTimeline = gsap.timeline({
        onComplete: () => {
          this.ngZone.run(() => {
            this.isTransitioning.set(false);
          });
        }
      });

      // 1. Text reveals into place in direction of movement
      const textAnimTargets = dossierEl?.querySelectorAll('.dossier-anim') || [];
      if (textAnimTargets.length) {
        this.carouselTimeline.fromTo(
          textAnimTargets,
          {
            y: direction > 0 ? 12 : -12,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.38,
            stagger: 0.03,
            ease: 'power2.out'
          },
          0.05
        );
      }

      // 2. 3D Card Choreography: Smoothly translate, scale, and rotate cards to new slots
      cards.forEach((card, i) => {
        const cfg = this.getCardTransform(i, targetIndex, total);
        this.carouselTimeline?.to(
          card,
          {
            xPercent: cfg.xPercent,
            x: cfg.x,
            y: cfg.y,
            scale: cfg.scale,
            opacity: cfg.opacity,
            zIndex: cfg.zIndex,
            rotateY: cfg.rotateY,
            pointerEvents: cfg.pointerEvents,
            duration: 0.58,
            ease: 'power3.out'
          },
          0
        );
      });
    });
  }

  /**
   * Section Reveal Animation on Scroll Entry
   */
  private initializeAnimations(): void {
    const sectionEl = this.showcaseSection()?.nativeElement;
    if (!sectionEl) return;

    this.applyCardTransformsInstant();

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    this.ngZone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const eyebrowEl = this.sectionEyebrow()?.nativeElement;
        const headingEl = this.sectionHeading()?.nativeElement;
        const leadEl = this.sectionLead()?.nativeElement;
        const filtersEl = this.categoryFiltersNav()?.nativeElement;
        const dossierEl = this.spotlightDossier()?.nativeElement;
        const stageEl = this.spotlightStage()?.nativeElement;

        if (!eyebrowEl || !headingEl || !leadEl || !filtersEl || !dossierEl || !stageEl) {
          return;
        }

        this.revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true,
            invalidateOnRefresh: true
          }
        });

        // 1. Header elements
        this.revealTimeline
          .fromTo(
            eyebrowEl,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }
          )
          .fromTo(
            headingEl,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
            '-=0.45'
          )
          .fromTo(
            leadEl,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
            '-=0.45'
          )
          .fromTo(
            filtersEl,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.4'
          );

        // 2. Editorial Spotlight Split Layout
        this.revealTimeline
          .fromTo(
            dossierEl,
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.35'
          )
          .fromTo(
            stageEl,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out' },
            '-=0.65'
          );
      }, sectionEl);
    });
  }

  private cleanupAnimations(): void {
    if (this.carouselTimeline) {
      this.carouselTimeline.kill();
    }
    if (this.revealTimeline) {
      this.revealTimeline.kill();
    }
    if (this.ctx) {
      this.ctx.revert();
    }
  }
}
