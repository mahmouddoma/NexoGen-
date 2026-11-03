import {
  Injectable,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  NgZone
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AppLanguage,
  AppDirection,
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  LanguageOption
} from './language.types';
import { EN_TRANSLATIONS } from './translations/en.translations';
import { AR_TRANSLATIONS } from './translations/ar.translations';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly translate = inject(TranslateService);

  readonly supportedLanguages: readonly LanguageOption[] = SUPPORTED_LANGUAGES;

  // Active language state
  readonly language = signal<AppLanguage>(this.getInitialLanguage());

  // Reactive text direction: 'rtl' for Arabic, 'ltr' for English
  readonly direction = computed<AppDirection>(() =>
    this.language() === 'ar' ? 'rtl' : 'ltr'
  );

  readonly isRtl = computed<boolean>(() => this.direction() === 'rtl');

  constructor() {
    this.initializeI18n();
  }

  private initializeI18n(): void {
    // 1. Preload both bilingual dictionaries immediately into TranslateService
    this.translate.setTranslation('en', EN_TRANSLATIONS, true);
    this.translate.setTranslation('ar', AR_TRANSLATIONS, true);

    // 2. Configure defaults
    this.translate.setFallbackLang(FALLBACK_LANGUAGE);

    // 3. Apply active language
    const current = this.language();
    this.applyLanguageToDom(current);
    this.translate.use(current);
  }

  /**
   * Switch the application language at runtime without full page reload.
   */
  setLanguage(lang: AppLanguage): void {
    if (lang === this.language()) return;

    this.language.set(lang);
    this.translate.use(lang);
    this.applyLanguageToDom(lang);
    this.persistLanguage(lang);

    // Safe layout & ScrollTrigger recalibration after Angular paints the new direction
    this.recalibrateLayout();
  }

  /**
   * Toggle between English and Arabic.
   */
  toggleLanguage(): void {
    const next: AppLanguage = this.language() === 'en' ? 'ar' : 'en';
    this.setLanguage(next);
  }

  /**
   * Instant translation string lookup.
   */
  instant(key: string, interpolateParams?: Record<string, string | number>): string {
    return this.translate.instant(key, interpolateParams);
  }

  private applyLanguageToDom(lang: AppLanguage): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const htmlEl = this.document.documentElement;
    const dir: AppDirection = lang === 'ar' ? 'rtl' : 'ltr';

    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('dir', dir);
  }

  private recalibrateLayout(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      // Delay slightly to let the browser recompute typography and flow
      setTimeout(() => {
        try {
          gsap.registerPlugin(ScrollTrigger);
          ScrollTrigger.refresh();
        } catch {
          // Graceful fallback if animations are unmounted
        }
      }, 100);
    });
  }

  private persistLanguage(lang: AppLanguage): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Storage unavailable or disabled
    }
  }

  private getInitialLanguage(): AppLanguage {
    if (!isPlatformBrowser(this.platformId)) {
      return DEFAULT_LANGUAGE;
    }

    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage | null;
      if (saved && (saved === 'en' || saved === 'ar')) {
        return saved;
      }
    } catch {
      // Storage error
    }

    return DEFAULT_LANGUAGE;
  }
}
