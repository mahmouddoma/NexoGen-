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
  afterNextRender,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IntroProduct } from '../../models/intro-product.model';
import { INITIAL_INTRO_PRODUCTS } from '../../data/intro-products.data';
import { LanguageService } from '../../../../core/i18n/language.service';

interface ProductMotionConfig {
  enterX: number;
  enterY: number;
  settleX: number;
  settleY: number;
  rot: number;
  scale: number;
}

interface ChoreographyConfig {
  lumgen: ProductMotionConfig;
  cascadin: ProductMotionConfig;
  sponge: ProductMotionConfig;
}

@Component({
  selector: 'app-intro-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './intro-showcase.component.html',
  styleUrl: './intro-showcase.component.scss',
})
export class IntroShowcaseComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly languageService = inject(LanguageService);

  // Data Signals
  readonly products = signal<IntroProduct[]>(INITIAL_INTRO_PRODUCTS);
  readonly loadedImagesCount = signal<number>(0);
  readonly isEntranceCompleted = signal<boolean>(false);

  // Output events for homepage orchestration
  readonly introCompleted = output<void>();
  readonly skipRequested = output<void>();

  // DOM Signal References
  private readonly introContainer = viewChild<ElementRef<HTMLElement>>('introContainer');
  private readonly stageElement = viewChild<ElementRef<HTMLElement>>('stageElement');
  private readonly brandIntro = viewChild<ElementRef<HTMLElement>>('brandIntro');
  private readonly productsStage = viewChild<ElementRef<HTMLElement>>('productsStage');
  private readonly productItems = viewChildren<ElementRef<HTMLElement>>('productItem');
  private readonly destinationSlots = viewChildren<ElementRef<HTMLElement>>('destinationSlot');
  private readonly productsDestination = viewChild<ElementRef<HTMLElement>>('productsDestination');
  private readonly scrollHint = viewChild<ElementRef<HTMLElement>>('scrollHint');

  // GSAP context & timelines
  private ctx?: gsap.Context;
  private entranceTimeline?: gsap.core.Timeline;
  private scrollTimeline?: gsap.core.Timeline;
  private mm?: gsap.MatchMedia;
  private isInitialized = false;

  constructor() {
    // React dynamically to language/direction changes so RTL and LTR coordinates re-sync
    effect(() => {
      const dir = this.languageService.direction();
      if (isPlatformBrowser(this.platformId) && this.isInitialized) {
        this.cleanupAnimations();
        this.initializeAnimations();
      }
    });

    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        const hash = window.location.hash;
        if (hash && hash !== '#home' && hash !== '#hero') {
          // If the user navigates directly to a sub-section anchor (e.g., #products),
          // instantly settle intro elements to prevent half-animated pinned entrapment
          this.setupReducedMotionState();
          this.isInitialized = true;
          this.introCompleted.emit();

          setTimeout(() => {
            const cleanId = hash.replace(/^#+/, '');
            const target = document.getElementById(cleanId);
            if (target) {
              const navHeight = window.innerWidth <= 768 ? 68 : 80;
              const targetY = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - navHeight;
              window.scrollTo({ top: targetY, behavior: 'auto' });
            }
          }, 60);
          return;
        }

        this.initializeAnimations();
        this.isInitialized = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanupAnimations();
  }

  /**
   * Track image loading so positions and bounds are calculated accurately
   */
  onImageLoaded(productId: string): void {
    this.loadedImagesCount.update((count) => count + 1);
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.refresh();
    }
  }

  /**
   * Fast-forwards the entrance animation and smoothly scrolls into the next section
   */
  onSkipIntro(): void {
    this.skipRequested.emit();
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.entranceTimeline && this.entranceTimeline.progress() < 1) {
      this.entranceTimeline.progress(1);
    }
    this.isEntranceCompleted.set(true);

    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      const container = this.introContainer()?.nativeElement;
      if (container) {
        const scrollTarget = container.offsetTop + container.offsetHeight;
        window.scrollTo({
          top: scrollTarget,
          behavior: 'smooth',
        });
      }
    }
  }

  /**
   * Main animation initialization wrapped in NgZone outsideAngular
   */
  private initializeAnimations(): void {
    const container = this.introContainer()?.nativeElement;
    if (!container) return;

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      this.setupReducedMotionState();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    this.ngZone.runOutsideAngular(() => {
      // Create GSAP context for easy scoping and complete cleanup
      this.ctx = gsap.context(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
          this.setupReducedMotionState();
          return;
        }

        this.setupResponsiveAnimations();
      }, container);
    });
  }

  /**
   * Responsive choreography setup using GSAP matchMedia
   */
  private setupResponsiveAnimations(): void {
    this.mm = gsap.matchMedia();
    const isRtl = this.languageService.isRtl();
    const dirSign = isRtl ? -1 : 1;

    // DESKTOP: >= 1025px
    this.mm.add('(min-width: 1025px)', () => {
      const config: ChoreographyConfig = {
        lumgen: {
          enterX: dirSign * -window.innerWidth * 0.6,
          enterY: 60,
          settleX: dirSign * -260,
          settleY: 25,
          rot: dirSign * -5,
          scale: 1.02,
        },
        cascadin: {
          enterX: dirSign * window.innerWidth * 0.6,
          enterY: -60,
          settleX: 0,
          settleY: -35,
          rot: 0,
          scale: 1.18,
        },
        sponge: {
          enterX: dirSign * window.innerWidth * 0.45,
          enterY: window.innerHeight * 0.55,
          settleX: dirSign * 250,
          settleY: 20,
          rot: dirSign * 5,
          scale: 0.98,
        },
      };

      this.createEntranceAnimation(config);
      this.createScrollAnimation({
        targetScale: 0.22,
        destinationOffsetY: 180,
        config,
      });
    });

    // TABLET: 769px to 1024px
    this.mm.add('(min-width: 769px) and (max-width: 1024px)', () => {
      const config: ChoreographyConfig = {
        lumgen: {
          enterX: dirSign * -window.innerWidth * 0.55,
          enterY: 40,
          settleX: dirSign * -180,
          settleY: 20,
          rot: dirSign * -4,
          scale: 0.92,
        },
        cascadin: {
          enterX: dirSign * window.innerWidth * 0.55,
          enterY: -40,
          settleX: 0,
          settleY: -25,
          rot: 0,
          scale: 1.05,
        },
        sponge: {
          enterX: dirSign * window.innerWidth * 0.35,
          enterY: window.innerHeight * 0.45,
          settleX: dirSign * 180,
          settleY: 15,
          rot: dirSign * 4,
          scale: 0.9,
        },
      };

      this.createEntranceAnimation(config);
      this.createScrollAnimation({
        targetScale: 0.2,
        destinationOffsetY: 160,
        config,
      });
    });

    // MOBILE: <= 768px (Responsive spread prevents clipping on 320px - 430px viewports)
    this.mm.add('(max-width: 768px)', () => {
      const isSmallMobile = window.innerWidth <= 380;
      const mobileSpread = Math.min(64, Math.max(46, window.innerWidth * 0.16));
      const flankingScale = isSmallMobile ? 0.78 : 0.85;
      const centerScale = isSmallMobile ? 0.95 : 1.05;

      const config: ChoreographyConfig = {
        lumgen: {
          enterX: dirSign * -window.innerWidth * 0.55,
          enterY: 20,
          settleX: dirSign * -mobileSpread,
          settleY: 15,
          rot: dirSign * -3,
          scale: flankingScale,
        },
        cascadin: {
          enterX: dirSign * window.innerWidth * 0.55,
          enterY: -20,
          settleX: 0,
          settleY: -10,
          rot: 0,
          scale: centerScale,
        },
        sponge: {
          enterX: dirSign * window.innerWidth * 0.45,
          enterY: window.innerHeight * 0.35,
          settleX: dirSign * mobileSpread,
          settleY: 12,
          rot: dirSign * 3,
          scale: flankingScale,
        },
      };

      this.createEntranceAnimation(config);
      this.createScrollAnimation({
        targetScale: 0.2,
        destinationOffsetY: 95,
        config,
      });
    });
  }

  /**
   * PHASE A & B: Product Entrance and Central Art-Directed Composition
   */
  private createEntranceAnimation(config: ChoreographyConfig): void {
    const brandIntroEl = this.brandIntro()?.nativeElement;
    const items = this.productItems().map((p) => p.nativeElement);
    const scrollHintEl = this.scrollHint()?.nativeElement;
    const destinationEl = this.productsDestination()?.nativeElement;

    if (!brandIntroEl || !scrollHintEl || !destinationEl || items.length < 3) return;

    const [lumgenEl, cascadinEl, spongeEl] = items;
    const metaLabels = items
      .map((item) => item.querySelector('.product-card-meta'))
      .filter(Boolean);

    // If entrance has already completed (e.g. language switched or user returned),
    // immediately set elements to pristine settled state without replaying the fly-in
    if (this.isEntranceCompleted()) {
      gsap.set(brandIntroEl, { opacity: 1, y: 0 });
      gsap.set(scrollHintEl, { opacity: 1, y: 0 });
      gsap.set(destinationEl, { opacity: 1, y: 0 });

      gsap.set(lumgenEl, {
        x: config.lumgen.settleX,
        y: config.lumgen.settleY,
        rotation: config.lumgen.rot,
        scale: config.lumgen.scale,
        opacity: 1,
      });

      gsap.set(cascadinEl, {
        x: config.cascadin.settleX,
        y: config.cascadin.settleY,
        rotation: config.cascadin.rot,
        scale: config.cascadin.scale,
        opacity: 1,
      });

      gsap.set(spongeEl, {
        x: config.sponge.settleX,
        y: config.sponge.settleY,
        rotation: config.sponge.rot,
        scale: config.sponge.scale,
        opacity: 1,
      });

      if (metaLabels.length) {
        gsap.set(metaLabels, { opacity: 1, y: 0 });
      }

      ScrollTrigger.refresh();
      return;
    }

    // Reset starting state
    gsap.set(brandIntroEl, { opacity: 0, y: 30 });
    gsap.set(scrollHintEl, { opacity: 0, y: 15 });
    gsap.set(destinationEl, { opacity: 0, y: 25 });

    // Initial positions outside visible viewport
    gsap.set(lumgenEl, {
      x: config.lumgen.enterX,
      y: config.lumgen.enterY,
      rotation: -16,
      scale: 0.7,
      opacity: 0,
    });

    gsap.set(cascadinEl, {
      x: config.cascadin.enterX,
      y: config.cascadin.enterY,
      rotation: 14,
      scale: 0.65,
      opacity: 0,
    });

    gsap.set(spongeEl, {
      x: config.sponge.enterX,
      y: config.sponge.enterY,
      rotation: 20,
      scale: 0.6,
      opacity: 0,
    });

    // Master Entrance Timeline (Runs Once on homepage load)
    this.entranceTimeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        this.ngZone.run(() => {
          this.isEntranceCompleted.set(true);
        });
        ScrollTrigger.refresh();
      },
    });

    // 1. Subtle Brand Typography Entrance
    this.entranceTimeline.to(brandIntroEl, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power2.out',
    });

    // 2. Product 1 — LumGen-care Cream
    this.entranceTimeline.to(
      lumgenEl,
      {
        x: config.lumgen.settleX,
        y: config.lumgen.settleY,
        rotation: config.lumgen.rot,
        scale: config.lumgen.scale,
        opacity: 1,
        duration: 1.35,
        ease: 'power3.out',
      },
      '-=0.75',
    );

    // 3. Product 2 — Cascadin 4000 IU
    this.entranceTimeline.to(
      cascadinEl,
      {
        x: config.cascadin.settleX,
        y: config.cascadin.settleY,
        rotation: config.cascadin.rot,
        scale: config.cascadin.scale,
        opacity: 1,
        duration: 1.45,
        ease: 'power3.out',
      },
      '-=1.1',
    );

    // 4. Product 3 — Sponge-IRON Oral Drops
    this.entranceTimeline.to(
      spongeEl,
      {
        x: config.sponge.settleX,
        y: config.sponge.settleY,
        rotation: config.sponge.rot,
        scale: config.sponge.scale,
        opacity: 1,
        duration: 1.4,
        ease: 'power3.out',
      },
      '-=1.15',
    );

    // 5. Product Editorial Labels & Destination Dock fade in cleanly
    if (metaLabels.length) {
      this.entranceTimeline.to(
        metaLabels,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.5',
      );
    }

    this.entranceTimeline.to(
      destinationEl,
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      },
      '-=0.4',
    );

    // 6. Scroll Hint emerges indicating scroll readiness
    this.entranceTimeline.to(
      scrollHintEl,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.3',
    );
  }

  /**
   * PHASE C: Pinned, Scroll-Driven Product Distribution (GSAP ScrollTrigger)
   */
  private createScrollAnimation(params: {
    targetScale: number;
    destinationOffsetY: number;
    config: ChoreographyConfig;
  }): void {
    const container = this.introContainer()?.nativeElement;
    const brandIntroEl = this.brandIntro()?.nativeElement;
    const items = this.productItems().map((p) => p.nativeElement);
    const slots = this.destinationSlots().map((s) => s.nativeElement);
    const scrollHintEl = this.scrollHint()?.nativeElement;

    if (!container || !brandIntroEl || !scrollHintEl || items.length < 3) return;

    const [lumgenEl, cascadinEl, spongeEl] = items;
    const [slotLumgen, slotCascadin, slotSponge] = slots;
    const { config } = params;

    // Build the pinned scroll timeline with scrub without destructive invalidation
    this.scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=170%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onLeave: () => {
          this.ngZone.run(() => {
            this.introCompleted.emit();
          });
        },
      },
    });

    // As scroll begins, hide scroll hint
    this.scrollTimeline.fromTo(
      scrollHintEl,
      { opacity: 1, y: 0 },
      { opacity: 0, y: 20, duration: 0.25, ease: 'power1.out' },
      0,
    );

    // Hide product metadata tags
    const metaLabels = items
      .map((item) => item.querySelector('.product-card-meta'))
      .filter(Boolean);
    if (metaLabels.length) {
      this.scrollTimeline.fromTo(
        metaLabels,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -10, duration: 0.3, ease: 'power1.out' },
        0,
      );
    }

    // Step 1: Product 1 (LumGen-care) moves downward toward dock slot 1
    if (lumgenEl) {
      this.scrollTimeline.fromTo(
        lumgenEl,
        {
          x: config.lumgen.settleX,
          y: config.lumgen.settleY,
          scale: config.lumgen.scale,
          rotation: config.lumgen.rot,
          opacity: 1,
        },
        {
          x: () => this.calculateSlotRelativeX(lumgenEl, slotLumgen, config.lumgen.settleX),
          y: () => this.calculateSlotRelativeY(lumgenEl, slotLumgen, params.destinationOffsetY),
          scale: params.targetScale,
          rotation: 0,
          opacity: 0.9,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0.1,
      );

      if (slotLumgen) {
        this.scrollTimeline.fromTo(
          slotLumgen,
          { backgroundColor: 'rgba(246, 248, 248, 0.75)', borderColor: 'rgba(18, 48, 82, 0.14)' },
          { backgroundColor: '#ffffff', borderColor: '#009f9c', duration: 0.2 },
          0.7,
        );
      }
    }

    // Step 2: Product 2 (Cascadin 4000 IU) begins transition toward dock slot 2
    if (cascadinEl) {
      this.scrollTimeline.fromTo(
        cascadinEl,
        {
          x: config.cascadin.settleX,
          y: config.cascadin.settleY,
          scale: config.cascadin.scale,
          rotation: config.cascadin.rot,
          opacity: 1,
        },
        {
          x: () => this.calculateSlotRelativeX(cascadinEl, slotCascadin, 0),
          y: () => this.calculateSlotRelativeY(cascadinEl, slotCascadin, params.destinationOffsetY),
          scale: params.targetScale,
          rotation: 0,
          opacity: 0.9,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0.35,
      );

      if (slotCascadin) {
        this.scrollTimeline.fromTo(
          slotCascadin,
          { backgroundColor: 'rgba(246, 248, 248, 0.75)', borderColor: 'rgba(18, 48, 82, 0.14)' },
          { backgroundColor: '#ffffff', borderColor: '#009f9c', duration: 0.2 },
          0.95,
        );
      }
    }

    // Step 3: Product 3 (Sponge-IRON) begins transition toward dock slot 3
    if (spongeEl) {
      this.scrollTimeline.fromTo(
        spongeEl,
        {
          x: config.sponge.settleX,
          y: config.sponge.settleY,
          scale: config.sponge.scale,
          rotation: config.sponge.rot,
          opacity: 1,
        },
        {
          x: () => this.calculateSlotRelativeX(spongeEl, slotSponge, config.sponge.settleX),
          y: () => this.calculateSlotRelativeY(spongeEl, slotSponge, params.destinationOffsetY),
          scale: params.targetScale,
          rotation: 0,
          opacity: 0.9,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0.6,
      );

      if (slotSponge) {
        this.scrollTimeline.fromTo(
          slotSponge,
          { backgroundColor: 'rgba(246, 248, 248, 0.75)', borderColor: 'rgba(18, 48, 82, 0.14)' },
          { backgroundColor: '#ffffff', borderColor: '#009f9c', duration: 0.2 },
          1.2,
        );
      }
    }

    // Transition of brand typography leading toward Hero section
    this.scrollTimeline.fromTo(
      brandIntroEl,
      { y: 0, opacity: 1 },
      {
        y: -40,
        opacity: 0.2,
        duration: 0.9,
        ease: 'power1.out',
      },
      0.5,
    );
  }

  /**
   * Helper to dynamically compute relative X coordinate between an animated product and its target slot
   */
  private calculateSlotRelativeX(
    itemEl: HTMLElement,
    slotEl?: HTMLElement,
    fallbackX: number = 0,
  ): number {
    if (!slotEl) return fallbackX;
    const stage = this.productsStage()?.nativeElement || this.stageElement()?.nativeElement;
    if (!stage) return fallbackX;
    const ringEl = (slotEl.querySelector('.slot-pedestal-ring') as HTMLElement) || slotEl;
    const stageRect = stage.getBoundingClientRect();
    const targetRect = ringEl.getBoundingClientRect();

    if (!stageRect.width || !targetRect.width) return fallbackX;

    const stageCenterX = stageRect.left + stageRect.width / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    return targetCenterX - stageCenterX;
  }

  /**
   * Helper to dynamically compute relative Y coordinate between an animated product and its target slot
   */
  private calculateSlotRelativeY(
    itemEl: HTMLElement,
    slotEl?: HTMLElement,
    fallbackY: number = 180,
  ): number {
    if (!slotEl) return fallbackY;
    const stage = this.productsStage()?.nativeElement || this.stageElement()?.nativeElement;
    if (!stage) return fallbackY;
    const ringEl = (slotEl.querySelector('.slot-pedestal-ring') as HTMLElement) || slotEl;
    const stageRect = stage.getBoundingClientRect();
    const targetRect = ringEl.getBoundingClientRect();

    if (!stageRect.height || !targetRect.height) return fallbackY;

    const stageCenterY = stageRect.top + stageRect.height / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    // Upward offset so the base of the bottle sits directly on the pedestal ring
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const baseOffset = isMobile ? -14 : -24;

    return (targetCenterY - stageCenterY) + baseOffset;
  }

  /**
   * Immediate accessible state for users with prefers-reduced-motion
   */
  private setupReducedMotionState(): void {
    const brandIntroEl = this.brandIntro()?.nativeElement;
    const items = this.productItems().map((p) => p.nativeElement);
    const scrollHintEl = this.scrollHint()?.nativeElement;
    const destinationEl = this.productsDestination()?.nativeElement;
    const isRtl = this.languageService.isRtl();
    const dirSign = isRtl ? -1 : 1;

    if (brandIntroEl) gsap.set(brandIntroEl, { opacity: 1, y: 0 });
    if (scrollHintEl) gsap.set(scrollHintEl, { opacity: 0 });
    if (destinationEl) gsap.set(destinationEl, { opacity: 1, y: 0 });

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const spread = isMobile ? Math.min(64, window.innerWidth * 0.16) : 240;
    const sideScale = isMobile ? 0.85 : 0.95;
    const centerScale = 1.05;

    const [lumgenEl, cascadinEl, spongeEl] = items;
    if (lumgenEl)
      gsap.set(lumgenEl, { x: dirSign * -spread, y: isMobile ? 15 : 25, rotation: 0, scale: sideScale, opacity: 1 });
    if (cascadinEl) gsap.set(cascadinEl, { x: 0, y: isMobile ? -10 : -25, rotation: 0, scale: centerScale, opacity: 1 });
    if (spongeEl)
      gsap.set(spongeEl, { x: dirSign * spread, y: isMobile ? 12 : 20, rotation: 0, scale: sideScale, opacity: 1 });

    const metaLabels = items
      .map((item) => item.querySelector('.product-card-meta'))
      .filter(Boolean);
    if (metaLabels.length) gsap.set(metaLabels, { opacity: 1, y: 0 });

    this.isEntranceCompleted.set(true);
  }

  /**
   * Complete teardown of GSAP instances to prevent memory leaks and duplicate triggers
   */
  private cleanupAnimations(): void {
    if (this.mm) {
      this.mm.revert();
    }
    if (this.scrollTimeline) {
      this.scrollTimeline.kill();
    }
    if (this.entranceTimeline) {
      this.entranceTimeline.kill();
    }
    if (this.ctx) {
      this.ctx.revert();
    }
  }
}
