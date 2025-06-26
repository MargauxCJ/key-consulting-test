import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'region-search',
    pathMatch: 'full',
  },
  {
    path: 'region-search',
    loadComponent: () => import('./features/region-search/region-search.component').then((m) => m.RegionSearchComponent),
  },
];
