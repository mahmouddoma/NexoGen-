import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { HeroComponent } from './hero.component';
import { LanguageService } from '../../../../core/i18n/language.service';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
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
      imports: [HeroComponent],
      providers: [provideTranslateService()]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the HeroComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render the brand eyebrow "NEXOGEN PHARMA"', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const eyebrow = compiled.querySelector('.hero-eyebrow');
    expect(eyebrow?.textContent?.trim()).toBe('NEXOGEN PHARMA');
  });

  it('should render the headline "Science. Care. Wellbeing."', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const headline = compiled.querySelector('.hero-headline');
    expect(headline?.textContent).toContain('Science.');
    expect(headline?.textContent).toContain('Care.');
    expect(headline?.textContent).toContain('Wellbeing.');
  });

  it('should render the supporting description', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const desc = compiled.querySelector('.hero-description');
    expect(desc?.textContent).toContain('Discover NexoGen Pharma and our range of healthcare and personal care products.');
  });

  it('should render primary CTA "Explore Our Products" and secondary CTA "About NexoGen"', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const primaryBtn = compiled.querySelector('.hero-btn--primary');
    const secondaryBtn = compiled.querySelector('.hero-btn--secondary');

    expect(primaryBtn?.textContent).toContain('Explore Our Products');
    expect(secondaryBtn?.textContent).toContain('About NexoGen');
  });

  it('should render the brand visual monogram watermark and emblem logo', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const watermark = compiled.querySelector('.visual-monogram-watermark');
    const emblem = compiled.querySelector('.visual-emblem-logo');
    expect(watermark).toBeTruthy();
    expect(emblem).toBeTruthy();
    expect(emblem?.getAttribute('src')).toBe('assets/branding/nexogen-logo.png');
  });

  it('should render the brand category strip with 3 categories', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.category-item');
    expect(items.length).toBe(3);
  });

  it('should emit exploreClicked when primary CTA is clicked', () => {
    let emitted = false;
    component.exploreClicked.subscribe(() => {
      emitted = true;
    });

    const dummyEvent = new MouseEvent('click');
    component.onExploreProducts(dummyEvent);
    expect(emitted).toBe(true);
  });

  it('should emit discoverClicked when secondary CTA is clicked', () => {
    let emitted = false;
    component.discoverClicked.subscribe(() => {
      emitted = true;
    });

    const dummyEvent = new MouseEvent('click');
    component.onDiscoverNexogen(dummyEvent);
    expect(emitted).toBe(true);
  });

  it('should clean up animations safely on destroy', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});

