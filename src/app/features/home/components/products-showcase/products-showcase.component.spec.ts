import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ProductsShowcaseComponent } from './products-showcase.component';
import { LanguageService } from '../../../../core/i18n/language.service';

describe('ProductsShowcaseComponent', () => {
  let component: ProductsShowcaseComponent;
  let fixture: ComponentFixture<ProductsShowcaseComponent>;
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
      imports: [ProductsShowcaseComponent],
      providers: [
        provideRouter([]),
        provideTranslateService()
      ]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');
    fixture = TestBed.createComponent(ProductsShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the ProductsShowcaseComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render the 6 authentic NexoGen products by default', () => {
    expect(component.allProducts().length).toBe(6);
    expect(component.filteredProducts().length).toBe(6);
    expect(component.totalCount()).toBe(6);
  });

  it('should default active product to LumGen-care Cream', () => {
    expect(component.activeIndex()).toBe(0);
    expect(component.activeProduct().name).toBe('LumGen-care Cream');
    expect(component.formattedCounter()).toBe('01 / 06');
  });

  it('should render section header with eyebrow, heading and lead', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.eyebrow-text')?.textContent).toContain('OUR COLLECTION');
    expect(compiled.querySelector('.section-heading')?.textContent).toContain('Discover Our');
    expect(compiled.querySelector('.section-lead')?.textContent).toContain('Explore NexoGen Pharma');
  });

  it('should render category filter pills', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const pills = compiled.querySelectorAll('.filter-pill');
    expect(pills.length).toBe(5); // All, Skin Care, Dietary Supplements, Vitamins & Minerals, Personal Care
  });

  it('should filter products when category is selected and clamp activeIndex', () => {
    component.selectCategory('Skin Care');
    expect(component.selectedCategory()).toBe('Skin Care');
    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].name).toBe('LumGen-care Cream');
    expect(component.activeIndex()).toBe(0);

    component.selectCategory('Dietary Supplements');
    expect(component.filteredProducts().length).toBe(2);
    expect(component.activeIndex()).toBe(0);

    component.selectCategory('All');
    expect(component.filteredProducts().length).toBe(6);
  });

  it('should navigate to next product and update activeProduct', () => {
    expect(component.activeIndex()).toBe(0);
    component.nextProduct();
    expect(component.activeIndex()).toBe(1);
    expect(component.activeProduct().name).toBe('Cascadin 4000 IU');
    expect(component.formattedCounter()).toBe('02 / 06');
  });

  it('should circularly navigate to previous product when on the first product', () => {
    expect(component.activeIndex()).toBe(0);
    component.previousProduct();
    expect(component.activeIndex()).toBe(5);
    expect(component.activeProduct().name).toBe('Nexray Care Spray');
    expect(component.formattedCounter()).toBe('06 / 06');
  });

  it('should jump to specific product with goToProduct', () => {
    component.goToProduct(2);
    expect(component.activeIndex()).toBe(2);
    expect(component.activeProduct().name).toBe('Sponge-IRON Oral Drops');
  });

  it('should cleanly destroy animations without errors', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});
