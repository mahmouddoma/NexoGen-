import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { ProductDetailsComponent } from './product-details.component';
import { LanguageService } from '../../../core/i18n/language.service';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let titleService: Title;
  let langService: LanguageService;

  beforeAll(() => {
    if (typeof window !== 'undefined') {
      window.matchMedia =
        window.matchMedia ||
        function () {
          return {
            matches: false,
            addListener: function () {},
            removeListener: function () {},
            addEventListener: function () {},
            removeEventListener: function () {},
            dispatchEvent: function () {
              return false;
            }
          } as any;
        };
      window.scrollTo = window.scrollTo || function () {};
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'slug' ? 'lumgen-care' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    titleService = TestBed.inject(Title);
    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create ProductDetailsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve and render the matching product', () => {
    const prod = component.currentProduct();
    expect(prod).toBeDefined();
    expect(prod?.name).toBe('LumGen-care Cream');

    const heading = fixture.nativeElement.querySelector('.editorial-product-title');
    expect(heading?.textContent).toContain('LumGen-care Cream');
  });

  it('should update the document title to include the product name', () => {
    expect(titleService.getTitle()).toContain('LumGen-care Cream');
  });

  it('should compute circular previous and next products', () => {
    const nav = component.navigation();
    expect(nav).toBeTruthy();
    expect(nav?.previous).toBeDefined();
    expect(nav?.next).toBeDefined();
    // In catalog: lumgen-care is index 0. Previous should be last product (nexray-care-spray) and next is cascadin-4000iu
    expect(nav?.previous.slug).toBe('nexray-care-spray');
    expect(nav?.next.slug).toBe('cascadin-4000iu');
  });

  it('should compute exactly 3 related products excluding active product', () => {
    const related = component.relatedProducts();
    expect(related.length).toBe(3);
    const active = component.currentProduct();
    expect(related.some((p) => p.id === active?.id)).toBe(false);
  });

  it('should toggle expandable accordion sections', () => {
    expect(component.isSectionOpen('overview')).toBe(true);
    expect(component.isSectionOpen('packaging')).toBe(false);

    component.toggleSection('packaging');
    expect(component.isSectionOpen('packaging')).toBe(true);

    component.toggleSection('overview');
    expect(component.isSectionOpen('overview')).toBe(false);
  });

  it('should cleanly destroy animations and restore metadata without error', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});
