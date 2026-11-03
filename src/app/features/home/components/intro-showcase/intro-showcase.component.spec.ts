import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { IntroShowcaseComponent } from './intro-showcase.component';
import { INITIAL_INTRO_PRODUCTS } from '../../data/intro-products.data';
import { LanguageService } from '../../../../core/i18n/language.service';

describe('IntroShowcaseComponent', () => {
  let component: IntroShowcaseComponent;
  let fixture: ComponentFixture<IntroShowcaseComponent>;
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
      imports: [IntroShowcaseComponent],
      providers: [provideTranslateService()]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');
    fixture = TestBed.createComponent(IntroShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the IntroShowcaseComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load initial 3 showcase products by default', () => {
    expect(component.products().length).toBe(3);
    expect(component.products()[0].name).toBe('LumGen-care Cream');
    expect(component.products()[1].name).toBe('Cascadin 4000 IU');
    expect(component.products()[2].name).toBe('Sponge-IRON Oral Drops');
  });

  it('should render product elements with correct accessible alt attributes', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const productImages = compiled.querySelectorAll<HTMLImageElement>('.product-img');

    expect(productImages.length).toBe(3);
    expect(productImages[0].alt).toContain('LumGen-care');
    expect(productImages[1].alt).toContain('Cascadin');
    expect(productImages[2].alt).toContain('Sponge-IRON');
  });

  it('should render destination dock with 3 target landing slots', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const slots = compiled.querySelectorAll('.destination-slot');
    expect(slots.length).toBe(3);
  });

  it('should trigger skipRequested output when skip button is clicked', () => {
    let emitted = false;
    component.skipRequested.subscribe(() => {
      emitted = true;
    });

    component.onSkipIntro();
    expect(emitted).toBe(true);
  });

  it('should safely clean up GSAP animations on component destruction', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});
