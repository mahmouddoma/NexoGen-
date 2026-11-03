import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { WhyNexogenComponent } from './why-nexogen.component';
import { LanguageService } from '../../../../core/i18n/language.service';

describe('WhyNexogenComponent', () => {
  let component: WhyNexogenComponent;
  let fixture: ComponentFixture<WhyNexogenComponent>;
  let langService: LanguageService;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
    window.scrollTo = () => {};
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyNexogenComponent],
      providers: [provideTranslateService()]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');
    fixture = TestBed.createComponent(WhyNexogenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create WhyNexogenComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render eyebrow "02 / OUR APPROACH"', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.eyebrow-text')?.textContent).toContain('OUR APPROACH');
  });

  it('should render main headline "A Thoughtful Approach to Everyday Care."', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('.why-heading');
    expect(heading?.textContent).toContain('A Thoughtful Approach to');
    expect(heading?.textContent).toContain('Everyday Care.');
  });

  it('should render the 4 core brand values', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.value-item');
    expect(items.length).toBe(4);
    expect(compiled.textContent).toContain('Quality');
    expect(compiled.textContent).toContain('Care');
    expect(compiled.textContent).toContain('Responsibility');
    expect(compiled.textContent).toContain('Innovation');
  });

  it('should cleanly destroy animations without errors', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});

