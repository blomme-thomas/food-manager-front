import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadChildren: () => import('@features/auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: '',
    loadComponent: () => import('@layout/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
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
  {
    path: '',
    loadChildren: () =>
      import('@features/errors/errors.routes').then(({ ERRORS_ROUTES }) => ERRORS_ROUTES),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
