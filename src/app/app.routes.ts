import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./features/products/product-details/product-details.component').then(m => m.ProductDetailsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
