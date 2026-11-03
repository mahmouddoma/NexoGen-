import {
  Component,
  ChangeDetectionStrategy,
  viewChild,
  ElementRef,
  OnDestroy,
  inject,
  PLATFORM_ID,
  NgZone,
  output,
  afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  // CTA Event Outputs for programmatic homepage orchestration
  readonly exploreClicked = output<void>();
  readonly discoverClicked = output<void>();

  // DOM Signal References
  private readonly heroSection = viewChild<ElementRef<HTMLElement>>('heroSection');
  private readonly heroContentCol = viewChild<ElementRef<HTMLElement>>('heroContentCol');
  private readonly heroVisualCol = viewChild<ElementRef<HTMLElement>>('heroVisualCol');
  private readonly heroEyebrow = viewChild<ElementRef<HTMLElement>>('heroEyebrow');
  private readonly heroHeadline = viewChild<ElementRef<HTMLElement>>('heroHeadline');
  private readonly heroDescription = viewChild<ElementRef<HTMLElement>>('heroDescription');
  private readonly heroActions = viewChild<ElementRef<HTMLElement>>('heroActions');
  private readonly heroCategoryStrip = viewChild<ElementRef<HTMLElement>>('heroCategoryStrip');

  // GSAP Context & ScrollTrigger instance
  private ctx?: gsap.Context;
  private revealTimeline?: gsap.core.Timeline;

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
   * Primary CTA click handler - smooth scrolls to #products if exists, or emits event
   */
  onExploreProducts(event: Event): void {
    this.exploreClicked.emit();
    if (!isPlatformBrowser(this.platformId)) return;

    const targetEl = document.getElementById('products');
    if (targetEl) {
      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Secondary CTA click handler - smooth scrolls to #about if exists, or emits event
   */
  onDiscoverNexogen(event: Event): void {
    this.discoverClicked.emit();
    if (!isPlatformBrowser(this.platformId)) return;

    const targetEl = document.getElementById('about');
    if (targetEl) {
      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Initialize restrained, editorial GSAP ScrollTrigger entrance
   */
  private initializeAnimations(): void {
    const sectionEl = this.heroSection()?.nativeElement;
    if (!sectionEl) return;

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return; // Keep default CSS static visibility
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return; // Honor reduced-motion preference without JS animation
    }

    gsap.registerPlugin(ScrollTrigger);

    this.ngZone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const eyebrowEl = this.heroEyebrow()?.nativeElement;
        const headlineEl = this.heroHeadline()?.nativeElement;
        const descriptionEl = this.heroDescription()?.nativeElement;
        const actionsEl = this.heroActions()?.nativeElement;
        const visualColEl = this.heroVisualCol()?.nativeElement;
        const categoryStripEl = this.heroCategoryStrip()?.nativeElement;

        if (!eyebrowEl || !headlineEl || !descriptionEl || !actionsEl || !visualColEl || !categoryStripEl) {
          return;
        }

        const headlineLines = headlineEl.querySelectorAll('.headline-line');

        // Master Reveal Timeline synchronized with viewport entry
        this.revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true
          }
        });

        // Stage 1 — Brand Visual (Emblem & Monogram)
        this.revealTimeline.fromTo(
          visualColEl,
          { opacity: 0, scale: 0.94, y: 25 },
          { opacity: 1, scale: 1, y: 0, duration: 1.05, ease: 'power3.out' }
        );

        // Stage 2 — Eyebrow & Typography (Headline line by line)
        this.revealTimeline.fromTo(
          eyebrowEl,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.75'
        );

        if (headlineLines.length) {
          this.revealTimeline.fromTo(
            headlineLines,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.15,
              ease: 'power3.out'
            },
            '-=0.55'
          );
        }

        // Stage 3 — Supporting Description
        this.revealTimeline.fromTo(
          descriptionEl,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
          '-=0.5'
        );

        // Stage 4 — Primary and Secondary CTAs
        const actionBtns = actionsEl.querySelectorAll('.hero-btn');
        this.revealTimeline.fromTo(
          actionBtns.length ? actionBtns : actionsEl,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out' },
          '-=0.45'
        );

        // Stage 5 — Bottom Brand Category Strip
        this.revealTimeline.fromTo(
          categoryStripEl,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
          '-=0.35'
        );
      }, sectionEl);
    });
  }

  /**
   * Safely tear down GSAP context and kill triggers on component destroy
   */
  private cleanupAnimations(): void {
    if (this.revealTimeline) {
      this.revealTimeline.kill();
    }
    if (this.ctx) {
      this.ctx.revert();
    }
  }
}

