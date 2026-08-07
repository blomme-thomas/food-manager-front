// core/guards/guest.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserService } from '@core/api/services/user.service';

export const guestGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.loadCurrentUser().pipe(
    map(() => router.createUrlTree(['/dashboard'])),
    catchError(() => of(true)),
  );
};
