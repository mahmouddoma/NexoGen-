import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { FooterComponent } from './footer.component';
import { LanguageService } from '../../../core/i18n/language.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let langService: LanguageService;

  beforeAll(() => {
    window.scrollTo = () => {};
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideRouter([]),
        provideTranslateService()
      ]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create FooterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render the dynamic copyright year and brand text', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const copyright = compiled.querySelector('.copyright-text')?.textContent;
    expect(copyright).toContain(String(component.currentYear));
    expect(copyright).toContain('NexoGen Pharma');
  });

  it('should list all 6 authentic products in therapeutics column', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const productLinks = compiled.querySelectorAll('.footer-col:nth-child(3) li a');
    expect(productLinks.length).toBe(6);
  });

  it('should trigger scrollToTop when back to top is clicked', () => {
    let scrolled = false;
    window.scrollTo = () => {
      scrolled = true;
    };

    component.scrollToTop();
    expect(scrolled).toBe(true);
  });

  it('should render authentic company contact info and Facebook link', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const footerText = compiled.textContent || '';
    expect(footerText).toContain('moamen.haleem555@gmail.com');
    expect(footerText).toContain('010 95177255');
    expect(footerText).toContain('Sharqia, Zagazig, Egypt');
    expect(footerText).toContain('Egypt');

    const fbLink = compiled.querySelector('a[href*="facebook.com"]');
    expect(fbLink).toBeTruthy();
    expect(fbLink?.getAttribute('href')).toContain('facebook.com');
  });

  it('should render the official NexoGen logo on a clean light surface', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const logoImg = compiled.querySelector<HTMLImageElement>('.footer-logo-surface .footer-logo-img');
    expect(logoImg).toBeTruthy();
    expect(logoImg?.getAttribute('src')).toContain('assets/branding/nexogen-logo.png');
    expect(logoImg?.getAttribute('alt')).toBe('NexoGen Pharma Logo');
  });

  it('should render the Developer Credit Bar with valid links and security attributes in English', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const devCredit = compiled.querySelector('.developer-credit');
    expect(devCredit).toBeTruthy();

    const portfolioLink = compiled.querySelector<HTMLAnchorElement>('.developer-link');
    expect(portfolioLink).toBeTruthy();
    expect(portfolioLink?.href).toBe('https://mahmouddoma.github.io/md-portfolioo/');
    expect(portfolioLink?.target).toBe('_blank');
    expect(portfolioLink?.rel).toContain('noopener');
    expect(portfolioLink?.rel).toContain('noreferrer');
    expect(portfolioLink?.textContent?.trim()).toBe('Mahmoud Doma');

    const emailLink = compiled.querySelector<HTMLAnchorElement>('.developer-contact-link[href^="mailto:"]');
    expect(emailLink).toBeTruthy();
    expect(emailLink?.href).toBe('mailto:devdoma2002@gmail.com');
    expect(emailLink?.textContent?.trim()).toBe('devdoma2002@gmail.com');
    expect(emailLink?.getAttribute('dir')).toBe('ltr');

    const phoneLink = compiled.querySelector<HTMLAnchorElement>('.developer-contact-link[href^="tel:"]');
    expect(phoneLink).toBeTruthy();
    expect(phoneLink?.href).toBe('tel:+201093430526');
    expect(phoneLink?.textContent?.trim()).toBe('01093430526');
    expect(phoneLink?.getAttribute('dir')).toBe('ltr');
  });

  it('should render Developer Credit Bar in Arabic when active', async () => {
    langService.setLanguage('ar');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const devText = compiled.querySelector('.developer-credit-text')?.textContent || '';
    expect(devText).toContain('تطوير');
    expect(devText).toContain('محمود دومه');

    const emailLink = compiled.querySelector<HTMLAnchorElement>('.developer-contact-link[href^="mailto:"]');
    expect(emailLink?.getAttribute('dir')).toBe('ltr');
    expect(emailLink?.textContent?.trim()).toBe('devdoma2002@gmail.com');
  });

  it('should render floating actions containing WhatsApp and Back to Top stacked buttons', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const floatingActions = compiled.querySelector('.floating-actions');
    expect(floatingActions).toBeTruthy();

    const waLink = compiled.querySelector<HTMLAnchorElement>('.floating-whatsapp');
    expect(waLink).toBeTruthy();
    expect(waLink?.href).toBe('https://wa.me/201095177255');
    expect(waLink?.target).toBe('_blank');
    expect(waLink?.rel).toContain('noopener');
    expect(waLink?.rel).toContain('noreferrer');

    const floatingTopBtn = compiled.querySelector<HTMLButtonElement>('.floating-top');
    expect(floatingTopBtn).toBeTruthy();

    let scrolled = false;
    window.scrollTo = () => {
      scrolled = true;
    };
    floatingTopBtn?.click();
    expect(scrolled).toBe(true);
  });
});

