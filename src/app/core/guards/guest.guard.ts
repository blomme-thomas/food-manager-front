// core/guards/guest.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UsersApiService } from '@core/users/services/user-api.service';

export const guestGuard: CanActivateFn = () => {
  const usersApi = inject(UsersApiService);
  const router = inject(Router);

  return usersApi.getCurrentUser().pipe(
    map(() => router.createUrlTree(['/dashboard'])),
    catchError(() => of(true)),
  );
};
