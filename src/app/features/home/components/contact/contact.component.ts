import {
  Component,
  ChangeDetectionStrategy,
  signal,
  viewChild,
  ElementRef,
  OnDestroy,
  inject,
  PLATFORM_ID,
  NgZone,
  afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContactService, ContactSubmissionResult } from '../../services/contact.service';
import { NEXOGEN_CONTACT } from '../../data/contact-info.data';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  readonly companyInfo = NEXOGEN_CONTACT;

  readonly inquiryTypes = [
    'General Inquiry',
    'Product Information',
    'Business Partnership',
    'Distribution Inquiry',
    'Other'
  ] as const;

  getInquiryTypeKey(type: string): string {
    const map: Record<string, string> = {
      'General Inquiry': 'CONTACT.INQUIRY_TYPES.GENERAL',
      'Product Information': 'CONTACT.INQUIRY_TYPES.PRODUCT',
      'Business Partnership': 'CONTACT.INQUIRY_TYPES.PARTNERSHIP',
      'Distribution Inquiry': 'CONTACT.INQUIRY_TYPES.DISTRIBUTION',
      'Other': 'CONTACT.INQUIRY_TYPES.OTHER'
    };
    return map[type] || type;
  }

  readonly isSubmitting = signal<boolean>(false);
  readonly submissionResult = signal<ContactSubmissionResult | null>(null);

  readonly contactForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    inquiryType: ['General Inquiry', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  // DOM Signal References
  private readonly contactSection = viewChild<ElementRef<HTMLElement>>('contactSection');
  private readonly contactInfo = viewChild<ElementRef<HTMLElement>>('contactInfo');
  private readonly contactFormWrapper = viewChild<ElementRef<HTMLElement>>('contactFormWrapper');

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

  isFieldInvalid(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.contactService.submitInquiry(this.contactForm.value).subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        this.submissionResult.set(result);
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  resetForm(): void {
    this.contactForm.reset({
      inquiryType: 'General Inquiry'
    });
    this.submissionResult.set(null);
  }

  private initializeAnimations(): void {
    const sectionEl = this.contactSection()?.nativeElement;
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
        const infoEl = this.contactInfo()?.nativeElement;
        const formEl = this.contactFormWrapper()?.nativeElement;

        if (!infoEl || !formEl) return;

        this.revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true,
            invalidateOnRefresh: true
          }
        });

        this.revealTimeline
          .fromTo(
            infoEl,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          )
          .fromTo(
            formEl,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
            '-=0.5'
          );
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

