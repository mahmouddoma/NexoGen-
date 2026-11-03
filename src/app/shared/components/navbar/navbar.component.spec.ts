import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { NavbarComponent } from './navbar.component';
import { LanguageService } from '../../../core/i18n/language.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let langService: LanguageService;

  beforeAll(() => {
    window.scrollTo = () => {};
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        provideTranslateService()
      ]
    }).compileComponents();

    langService = TestBed.inject(LanguageService);
    langService.setLanguage('en');
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create NavbarComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render all 5 primary navigation links', async () => {
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.desktop-nav .nav-link');
    expect(links.length).toBe(5);
    expect(compiled.textContent).toContain('Home');
    expect(compiled.textContent).toContain('Products');
    expect(compiled.textContent).toContain('About NexoGen');
    expect(compiled.textContent).toContain('Our Approach');
    expect(compiled.textContent).toContain('Contact');
  });

  it('should toggle mobile menu state when toggleMobileMenu is called', () => {
    expect(component.isMobileMenuOpen()).toBe(false);
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(true);
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('should close mobile menu on escape key press', () => {
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(true);

    component.onEscapePress();
    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('should close mobile menu when onNavClick is triggered', () => {
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(true);

    const dummyEvent = new MouseEvent('click');
    component.onNavClick('products', dummyEvent);
    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('should render the official NexoGen logo image in navbar brand', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoImg = compiled.querySelector<HTMLImageElement>('.navbar-logo-img');
    expect(logoImg).toBeTruthy();
    expect(logoImg?.getAttribute('src')).toContain('assets/branding/nexogen-logo.png');
    expect(logoImg?.getAttribute('alt')).toBe('NexoGen Pharma');
  });

  it('should render the floating bottom navigation dock with FontAwesome icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dock = compiled.querySelector('.nexo-floating-dock');
    expect(dock).toBeTruthy();

    const dockLinks = compiled.querySelectorAll('.dock-link');
    expect(dockLinks.length).toBe(5);

    const icons = compiled.querySelectorAll('.dock-icon-wrapper i.fa-solid');
    expect(icons.length).toBe(5);
  });
});

