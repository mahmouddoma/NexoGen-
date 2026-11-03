import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { AppLanguage } from '../../../core/i18n/language.types';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  private readonly langService = inject(LanguageService);

  readonly currentLang = this.langService.language;

  setLang(lang: AppLanguage): void {
    this.langService.setLanguage(lang);
  }
}

