import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'work', loadComponent: () => import('./pages/work/work').then(m => m.Work) },
  { path: 'work/:slug', loadComponent: () => import('./pages/work/detail/work-detail').then(m => m.WorkDetail) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
];
