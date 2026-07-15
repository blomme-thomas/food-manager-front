import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@features/dashboard/dashboard.routes').then((r) => r.DASHBOARD_ROUTES),
      },
      {
        path: 'aliments',
        loadChildren: () =>
          import('@features/aliments/aliments.routes').then((r) => r.ALIMENTS_ROUTES),
      },
      {
        path: 'recettes',
        loadChildren: () =>
          import('@features/recettes/recettes.routes').then((r) => r.RECETTES_ROUTES),
      },
      {
        path: 'planning',
        loadChildren: () =>
          import('@features/planning/planning.routes').then((r) => r.PLANNING_ROUTES),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
];
