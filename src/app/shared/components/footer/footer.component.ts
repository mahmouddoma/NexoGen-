import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  signal,
  NgZone,
  OnDestroy,
  afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NEXOGEN_PRODUCTS } from '../../../features/home/data/products.data';
import { NEXOGEN_CONTACT } from '../../../features/home/data/contact-info.data';

export interface DeveloperCreditInfo {
  readonly portfolioUrl: string;
  readonly email: string;
  readonly phoneDisplay: string;
  readonly phoneTel: string;
}

export const DEVELOPER_INFO: DeveloperCreditInfo = {
  portfolioUrl: 'https://mahmouddoma.github.io/md-portfolioo/',
  email: 'devdoma2002@gmail.com',
  phoneDisplay: '01093430526',
  phoneTel: '+201093430526'
};

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  readonly currentYear = new Date().getFullYear();
  readonly products = NEXOGEN_PRODUCTS;
  readonly contactInfo = NEXOGEN_CONTACT;
  readonly developerInfo = DEVELOPER_INFO;

  // Reactive visibility signal for the floating Back to Top button
  readonly showBackToTop = signal<boolean>(false);

  private scrollListener?: () => void;

  constructor() {
    afterNextRender(() => {
      this.setupScrollListener();
    });
  }

  ngOnDestroy(): void {
    if (this.scrollListener && isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private setupScrollListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const shouldShow = scrollY > 250;
        if (shouldShow !== this.showBackToTop()) {
          this.ngZone.run(() => {
            this.showBackToTop.set(shouldShow);
          });
        }
      };

      window.addEventListener('scroll', this.scrollListener, { passive: true });
      this.scrollListener();
    });
  }

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        history.replaceState(null, '', window.location.pathname);
      } catch {
        // Fallback for environments where history API is restricted
      }
    }
  }

  onNavigateHome(event: Event): void {
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      event.preventDefault();
      this.scrollToTop();
    }
  }

  onSectionClick(sectionId: string, event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      event.preventDefault();
      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        const navHeight = window.innerWidth <= 768 ? 68 : 80;
        const targetY = targetEl.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - navHeight;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }
    }
  }
}

