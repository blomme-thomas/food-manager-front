import { Routes } from '@angular/router';

export const ERRORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./error-page/error-page').then((m) => m.ErrorPageComponent),
  },
  {
    path: '403',
    loadComponent: () => import('./forbidden/forbidden').then((m) => m.ForbiddenComponent),
  },
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
