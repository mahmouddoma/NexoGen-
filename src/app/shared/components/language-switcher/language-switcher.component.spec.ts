import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { LanguageService } from '../../../core/i18n/language.service';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let langService: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
      providers: [provideTranslateService()]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create LanguageSwitcherComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display active language and allow switching to Arabic', () => {
    expect(component.currentLang()).toBe('en');

    component.setLang('ar');
    expect(component.currentLang()).toBe('ar');
    expect(langService.language()).toBe('ar');
    expect(langService.direction()).toBe('rtl');
  });

  it('should switch back to English', () => {
    component.setLang('ar');
    expect(component.currentLang()).toBe('ar');

    component.setLang('en');
    expect(component.currentLang()).toBe('en');
    expect(langService.language()).toBe('en');
    expect(langService.direction()).toBe('ltr');
  });
});

