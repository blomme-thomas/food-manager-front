import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UsersApiService } from '@core/users/services/user-api.service';

export const authGuard: CanActivateFn = () => {
  const usersApi = inject(UsersApiService);
  const router = inject(Router);

  return usersApi.getCurrentUser().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
