import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  PLATFORM_ID,
  NgZone,
  HostListener,
  OnDestroy,
  afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

export interface NavItem {
  id: string;
  key: string;
  fallbackLabel: string;
}

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);

  readonly navItems: readonly NavItem[] = [
    { id: 'home', key: 'NAV.HOME', fallbackLabel: 'Home' },
    { id: 'products', key: 'NAV.PRODUCTS', fallbackLabel: 'Products' },
    { id: 'about', key: 'NAV.ABOUT', fallbackLabel: 'About NexoGen' },
    { id: 'why-nexogen', key: 'NAV.WHY_US', fallbackLabel: 'Our Approach' },
    { id: 'contact', key: 'NAV.CONTACT', fallbackLabel: 'Contact' }
  ];

  readonly isScrolled = signal<boolean>(false);
  readonly activeSection = signal<string>('home');
  readonly isMobileMenuOpen = signal<boolean>(false);

  private scrollListener?: () => void;

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.setupScrollListeners();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    this.unlockBodyScroll();
  }

  toggleMobileMenu(): void {
    const newState = !this.isMobileMenuOpen();
    this.isMobileMenuOpen.set(newState);
    if (newState) {
      this.lockBodyScroll();
    } else {
      this.unlockBodyScroll();
    }
  }

  closeMobileMenu(): void {
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
      this.unlockBodyScroll();
    }
  }

  @HostListener('window:keydown.escape')
  onEscapePress(): void {
    this.closeMobileMenu();
  }

  onNavClick(sectionId: string, event: Event): void {
    this.closeMobileMenu();

    if (!isPlatformBrowser(this.platformId)) return;

    const isHomePage = this.router.url === '/' || this.router.url.startsWith('/#');

    if (isHomePage) {
      event.preventDefault();

      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.activeSection.set('home');
        if (typeof window !== 'undefined' && window.location.hash) {
          try {
            history.replaceState(null, '', window.location.pathname);
          } catch {
            // Graceful fallback
          }
        }
        return;
      }

      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        this.activeSection.set(sectionId);
      }
    }
  }

  private setupScrollListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      this.scrollListener = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const scrolled = scrollY >= 50;

        if (this.isScrolled() !== scrolled) {
          this.ngZone.run(() => {
            this.isScrolled.set(scrolled);
          });
        }

        // Active section detection (only on homepage with section anchors)
        const isHomePage = this.router.url === '/' || this.router.url.startsWith('/#');
        if (!isHomePage) {
          if (this.activeSection() !== '') {
            this.ngZone.run(() => {
              this.activeSection.set('');
            });
          }
          return;
        }

        const sectionIds = ['home', 'products', 'about', 'why-nexogen', 'contact'];
        let currentActive = 'home';

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Section is in viewing zone when top is above 45% of viewport
            if (rect.top <= window.innerHeight * 0.45 && rect.bottom > 100) {
              currentActive = id;
            }
          }
        }

        if (this.activeSection() !== currentActive) {
          this.ngZone.run(() => {
            this.activeSection.set(currentActive);
          });
        }
      };

      window.addEventListener('scroll', this.scrollListener, { passive: true });
      // Initial trigger
      this.scrollListener();
    });
  }

  private lockBodyScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  private unlockBodyScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}

