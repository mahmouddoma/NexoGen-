import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { AboutNexogenComponent } from './about-nexogen.component';
import { LanguageService } from '../../../../core/i18n/language.service';

describe('AboutNexogenComponent', () => {
  let component: AboutNexogenComponent;
  let fixture: ComponentFixture<AboutNexogenComponent>;
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
      imports: [AboutNexogenComponent],
      providers: [provideTranslateService()]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');
    fixture = TestBed.createComponent(AboutNexogenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create AboutNexogenComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render eyebrow "01 / ABOUT NEXOGEN"', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.eyebrow-text')?.textContent).toContain('ABOUT NEXOGEN');
  });

  it('should render main heading "Driven by Care. Inspired by Science."', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('.about-heading');
    expect(heading?.textContent).toContain('Driven by Care.');
    expect(heading?.textContent).toContain('Inspired by');
    expect(heading?.textContent).toContain('Science.');
  });

  it('should render lead description', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const lead = compiled.querySelector('.lead-paragraph');
    expect(lead?.textContent).toContain('NexoGen Pharma brings together healthcare, wellness');
  });

  it('should emit exploreClicked on CTA click', () => {
    let emitted = false;
    component.exploreClicked.subscribe(() => {
      emitted = true;
    });

    component.onExploreProducts(new MouseEvent('click'));
    expect(emitted).toBe(true);
  });

  it('should cleanly destroy animations without errors', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});

