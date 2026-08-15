import { Routes } from '@angular/router';

export const FOODS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/main/foods').then((m) => m.FoodsComponent),
  },
];
