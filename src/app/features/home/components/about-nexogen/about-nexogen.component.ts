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
  selector: 'app-about-nexogen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './about-nexogen.component.html',
  styleUrl: './about-nexogen.component.scss'
})
export class AboutNexogenComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  readonly exploreClicked = output<void>();

  // DOM Signal References
  private readonly aboutSection = viewChild<ElementRef<HTMLElement>>('aboutSection');
  private readonly aboutEyebrow = viewChild<ElementRef<HTMLElement>>('aboutEyebrow');
  private readonly aboutHeading = viewChild<ElementRef<HTMLElement>>('aboutHeading');
  private readonly aboutVisual = viewChild<ElementRef<HTMLElement>>('aboutVisual');
  private readonly aboutText = viewChild<ElementRef<HTMLElement>>('aboutText');
  private readonly aboutActions = viewChild<ElementRef<HTMLElement>>('aboutActions');

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

  onExploreProducts(event: Event): void {
    this.exploreClicked.emit();
    if (!isPlatformBrowser(this.platformId)) return;

    const targetEl = document.getElementById('products');
    if (targetEl) {
      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private initializeAnimations(): void {
    const sectionEl = this.aboutSection()?.nativeElement;
    if (!sectionEl) return;

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
        const eyebrowEl = this.aboutEyebrow()?.nativeElement;
        const headingEl = this.aboutHeading()?.nativeElement;
        const visualEl = this.aboutVisual()?.nativeElement;
        const textEl = this.aboutText()?.nativeElement;
        const actionsEl = this.aboutActions()?.nativeElement;

        if (!eyebrowEl || !headingEl || !visualEl || !textEl) {
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

        // 1. Eyebrow
        this.revealTimeline.fromTo(
          eyebrowEl,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        );

        // 2. Heading lines
        this.revealTimeline.fromTo(
          headingEl,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.45'
        );

        // 3. Editorial Visual Pane
        this.revealTimeline.fromTo(
          visualEl,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
          '-=0.4'
        );

        // 4. Text Content Column
        this.revealTimeline.fromTo(
          textEl,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.55'
        );

        // 5. Action CTA
        if (actionsEl) {
          this.revealTimeline.fromTo(
            actionsEl,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
            '-=0.35'
          );
        }
      }, sectionEl);
    });
  }

  private cleanupAnimations(): void {
    if (this.revealTimeline) {
      this.revealTimeline.kill();
    }
    if (this.ctx) {
      this.ctx.revert();
    }
  }
}

