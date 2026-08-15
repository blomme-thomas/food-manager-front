import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserService } from '@core/api/services/user.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.loadCurrentUser().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
