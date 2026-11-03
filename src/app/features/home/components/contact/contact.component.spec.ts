import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ContactComponent } from './contact.component';
import { LanguageService } from '../../../../core/i18n/language.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
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
      imports: [ContactComponent],
      providers: [provideTranslateService()]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create ContactComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form', () => {
    expect(component.contactForm.valid).toBe(false);
  });

  it('should validate full name, email, and message requirements', () => {
    const form = component.contactForm;
    form.patchValue({
      fullName: 'Dr. John Doe',
      email: 'john.doe@example.com',
      inquiryType: 'Product Information',
      message: 'This is a valid inquiry message with sufficient length.'
    });

    expect(form.valid).toBe(true);
  });

  it('should display submission feedback upon submitting a valid form', async () => {
    component.contactForm.patchValue({
      fullName: 'Sarah Jenkins',
      email: 'sarah@pharmaceuticals.com',
      inquiryType: 'Business Partnership',
      message: 'Requesting partnership portfolio information for regional clinics.'
    });

    component.onSubmit();
    expect(component.isSubmitting()).toBe(true);

    // Wait for the simulated delay to resolve
    await new Promise((resolve) => setTimeout(resolve, 650));
    fixture.detectChanges();

    expect(component.isSubmitting()).toBe(false);
    expect(component.submissionResult()).toBeTruthy();
    expect(component.submissionResult()?.success).toBe(true);
  });

  it('should reset form state when resetForm is called', () => {
    component.contactForm.patchValue({ fullName: 'Test User' });
    component.resetForm();

    expect(component.contactForm.get('fullName')?.value).toBeNull();
    expect(component.submissionResult()).toBeNull();
  });

  it('should render authentic company contact details and Facebook link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent || '';
    expect(text).toContain('moamen.haleem555@gmail.com');
    expect(text).toContain('010 95177255');
    expect(text).toContain('Sharqia, Zagazig, Egypt');
    expect(text).toContain('Egypt');

    const mailto = compiled.querySelector('a[href^="mailto:moamen.haleem555@gmail.com"]');
    expect(mailto).toBeTruthy();

    const tel = compiled.querySelector('a[href^="tel:+201095177255"]');
    expect(tel).toBeTruthy();

    const fb = compiled.querySelector('a[href*="facebook.com"]');
    expect(fb).toBeTruthy();
  });

  it('should cleanly destroy animations without errors', () => {
    expect(() => fixture.destroy()).not.toThrow();
  });
});

