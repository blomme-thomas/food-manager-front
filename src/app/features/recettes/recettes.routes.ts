import { Routes } from '@angular/router';

export const RECETTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./recettes.component').then((m) => m.RecettesComponent),
  },
];
