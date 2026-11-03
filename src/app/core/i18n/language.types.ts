export type AppLanguage = 'en' | 'ar';
export type AppDirection = 'ltr' | 'rtl';

export interface LanguageOption {
  readonly code: AppLanguage;
  readonly label: string;
  readonly nativeLabel: string;
  readonly direction: AppDirection;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', direction: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', direction: 'rtl' }
] as const;

export const DEFAULT_LANGUAGE: AppLanguage = 'en';
export const FALLBACK_LANGUAGE: AppLanguage = 'en';
export const LANGUAGE_STORAGE_KEY = 'nexogen_preferred_lang';

