import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { IntroShowcaseComponent } from './components/intro-showcase/intro-showcase.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProductsShowcaseComponent } from './components/products-showcase/products-showcase.component';
import { AboutNexogenComponent } from './components/about-nexogen/about-nexogen.component';
import { WhyNexogenComponent } from './components/why-nexogen/why-nexogen.component';
import { ContactComponent } from './components/contact/contact.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IntroShowcaseComponent,
    HeroComponent,
    ProductsShowcaseComponent,
    AboutNexogenComponent,
    WhyNexogenComponent,
    ContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly isIntroCompleted = signal(false);

  onIntroCompleted(): void {
    this.isIntroCompleted.set(true);
  }
}
