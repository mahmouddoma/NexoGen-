import {
  Component,
  ChangeDetectionStrategy,
  signal,
  viewChild,
  viewChildren,
  ElementRef,
  OnDestroy,
  inject,
  PLATFORM_ID,
  NgZone,
  afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface BrandValue {
  index: string;
  title: string;
  description: string;
  titleKey: string;
  descKey: string;
}

@Component({
  selector: 'app-why-nexogen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './why-nexogen.component.html',
  styleUrl: './why-nexogen.component.scss'
})
export class WhyNexogenComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  // Core brand values defined in a typed data signal
  readonly values = signal<BrandValue[]>([
    {
      index: '01',
      title: 'Quality',
      description: 'A considered approach to our product portfolio, prioritizing verified sourcing and reliable formulation.',
      titleKey: 'WHY_NEXOGEN.VALUES.V1_TITLE',
      descKey: 'WHY_NEXOGEN.VALUES.V1_DESC'
    },
    {
      index: '02',
      title: 'Care',
      description: 'Everyday wellbeing at the center of the brand, designing products that fit comfortably into patient lives.',
      titleKey: 'WHY_NEXOGEN.VALUES.V2_TITLE',
      descKey: 'WHY_NEXOGEN.VALUES.V2_DESC'
    },
    {
      index: '03',
      title: 'Responsibility',
      description: 'Thoughtful communication and clear product information, fostering long-term trust with healthcare providers.',
      titleKey: 'WHY_NEXOGEN.VALUES.V3_TITLE',
      descKey: 'WHY_NEXOGEN.VALUES.V3_DESC'
    },
    {
      index: '04',
      title: 'Innovation',
      description: 'An active interest in evolving healthcare needs, continuously refining delivery systems and therapeutic value.',
      titleKey: 'WHY_NEXOGEN.VALUES.V4_TITLE',
      descKey: 'WHY_NEXOGEN.VALUES.V4_DESC'
    }
  ]);

  // DOM Signal References
  private readonly whySection = viewChild<ElementRef<HTMLElement>>('whySection');
  private readonly whyStickyHeader = viewChild<ElementRef<HTMLElement>>('whyStickyHeader');
  private readonly whyValuesColumn = viewChild<ElementRef<HTMLElement>>('whyValuesColumn');
  private readonly valueItems = viewChildren<ElementRef<HTMLElement>>('valueItem');

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

  private initializeAnimations(): void {
    const sectionEl = this.whySection()?.nativeElement;
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
        const headerEl = this.whyStickyHeader()?.nativeElement;
        const items = this.valueItems().map((v) => v.nativeElement);

        if (!headerEl || !items.length) return;

        this.revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true,
            invalidateOnRefresh: true
          }
        });

        // 1. Sticky Editorial Header Entrance
        this.revealTimeline.fromTo(
          headerEl,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        // 2. Value Items Cascade
        this.revealTimeline.fromTo(
          items,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out'
          },
          '-=0.45'
        );

        // Individual item scroll highlighting triggers
        items.forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 75%',
            end: 'bottom 40%',
            toggleClass: 'item--active',
            invalidateOnRefresh: true
          });
        });
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

