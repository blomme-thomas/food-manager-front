import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthProvider } from '@core/auth/models/auth-provider.model';
import { AuthFacadeService } from '@core/auth/services/auth-facade.service';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authFacade = inject(AuthFacadeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly AuthProvider = AuthProvider;

  public authenticate(provider: AuthProvider): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authFacade
      .authenticate(provider)
      .pipe(
        finalize((): void => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result): void => {
          console.log(result);
          void this.router.navigate(['/dashboard']);
        },
        error: (error: unknown): void => {
          console.error(error);

          this.errorMessage.set('AUTH.ERRORS.GENERIC');
        },
      });
  }
}
