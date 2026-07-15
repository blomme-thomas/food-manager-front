import { Routes } from '@angular/router';

export const ALIMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./aliments.component').then((m) => m.AlimentsComponent),
  },
];
