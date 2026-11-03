import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductCardComponent } from './product-card.component';
import { NEXOGEN_PRODUCTS } from '../../../features/home/data/products.data';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  const mockProduct = NEXOGEN_PRODUCTS[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create ProductCardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render product name and category', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-title')?.textContent).toContain(mockProduct.name);
    expect(compiled.querySelector('.card-category')?.textContent).toContain(mockProduct.category);
  });

  it('should render image with alt text', async () => {
    await fixture.whenStable();
    const img = fixture.nativeElement.querySelector('.card-img') as HTMLImageElement;
    expect(img.src).toContain('lumgen-care.webp');
    expect(img.alt).toBe(mockProduct.alt);
  });

  it('should emit selected event when clicked', () => {
    let emitted = false;
    component.selected.subscribe((p) => {
      emitted = true;
      expect(p.id).toBe(mockProduct.id);
    });

    component.onCardClick(new MouseEvent('click'));
    expect(emitted).toBe(true);
  });
});

