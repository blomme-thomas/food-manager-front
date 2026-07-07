import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('@features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'foods',
    loadChildren: () => import('@features/foods/foods.routes').then((m) => m.FOODS_ROUTES),
  },
  {
    path: 'meal-plans',
    loadChildren: () => import('@features/meal-plans/meal-plans.routes').then((m) => m.MEAL_PLANS_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () => import('@features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'recipes',
    loadChildren: () => import('@features/recipes/recipes.routes').then((m) => m.RECIPES_ROUTES),
  },
  {
    path: 'shopping-lists',
    loadChildren: () => import('@features/shopping-lists/shopping-lists.routes').then((m) => m.SHOPPING_LISTS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
