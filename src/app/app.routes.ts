import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'region-search',
    pathMatch: 'full',
  },
  {
    // I created the routing if we wanted to navigate to another page for towns, but for usability reasons, I decide to
    // stay in the same page
    path: 'region-search',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/region-search/region-search.component').then((m) => m.RegionSearchComponent),
      },
      {
        path: ':departmentCode/towns',
        loadComponent: () => import('./features/department-details/department-details.component').then((m) => m.DepartmentDetailsComponent),
      }
    ]
  },
];
